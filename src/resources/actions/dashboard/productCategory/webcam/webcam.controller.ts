import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewWebcamBulkRequest,
  CreateNewWebcamRequest,
  DeleteAWebcamRequest,
  DeleteAllWebcamsRequest,
  GetWebcamByIdRequest,
  GetQueriedWebcamsRequest,
  UpdateWebcamByIdRequest,
} from './webcam.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { WebcamDocument, WebcamSchema } from './webcam.model';

import {
  createNewWebcamService,
  deleteAWebcamService,
  deleteAllWebcamsService,
  getWebcamByIdService,
  getQueriedWebcamsService,
  getQueriedTotalWebcamsService,
  returnAllWebcamsUploadedFileIdsService,
  updateWebcamByIdService,
} from './webcam.service';
import {
  FileUploadDocument,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../product.types';

// @desc   Create new webcam
// @route  POST /api/v1/actions/dashboard/product-category/webcam
// @access Private/Admin/Manager
const createNewWebcamHandler = expressAsyncHandler(
  async (
    request: CreateNewWebcamRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      webcamFields,
    } = request.body;

    const webcamSchema: WebcamSchema = {
      userId,
      username,
      ...webcamFields,
    };

    const webcamDocument: WebcamDocument = await createNewWebcamService(webcamSchema);

    if (!webcamDocument) {
      response.status(400).json({
        message: 'Could not create new webcam',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${webcamDocument.model} webcam`,
      resourceData: [webcamDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new webcams bulk
// @route  POST /api/v1/actions/dashboard/product-category/webcam/dev
// @access Private/Admin/Manager
const createNewWebcamBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewWebcamBulkRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>
  ) => {
    const { webcamSchemas } = request.body;

    const newWebcams = await Promise.all(
      webcamSchemas.map(async (webcamSchema) => {
        const newWebcam = await createNewWebcamService(webcamSchema);
        return newWebcam;
      })
    );

    // filter out any webcams that were not created
    const successfullyCreatedWebcams = newWebcams.filter((webcam) => webcam);

    // check if any webcams were created
    if (successfullyCreatedWebcams.length === webcamSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedWebcams.length} webcams`,
        resourceData: successfullyCreatedWebcams,
      });
      return;
    } else if (successfullyCreatedWebcams.length === 0) {
      response.status(400).json({
        message: 'Could not create any webcams',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          webcamSchemas.length - successfullyCreatedWebcams.length
        } webcams`,
        resourceData: successfullyCreatedWebcams,
      });
      return;
    }
  }
);

// @desc   Get all webcams
// @route  GET /api/v1/actions/dashboard/product-category/webcam
// @access Private/Admin/Manager
const getQueriedWebcamsHandler = expressAsyncHandler(
  async (
    request: GetQueriedWebcamsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<WebcamDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalWebcamsService({
        filter: filter as FilterQuery<WebcamDocument> | undefined,
      });
    }

    // get all webcams
    const webcams = await getQueriedWebcamsService({
      filter: filter as FilterQuery<WebcamDocument> | undefined,
      projection: projection as QueryOptions<WebcamDocument>,
      options: options as QueryOptions<WebcamDocument>,
    });
    if (webcams.length === 0) {
      response.status(200).json({
        message: 'No webcams that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the webcams (in parallel)
    const fileUploadsArrArr = await Promise.all(
      webcams.map(async (webcam) => {
        const fileUploadPromises = webcam.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create webcamServerResponse array
    const webcamServerResponseArray = webcams
      .map((webcam, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...webcam,
          fileUploads,
        };
      })
      .filter((webcam) => webcam);

    response.status(200).json({
      message: 'Successfully retrieved webcams',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: webcamServerResponseArray as WebcamDocument[],
    });
  }
);

// @desc   Get webcam by id
// @route  GET /api/v1/actions/dashboard/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const getWebcamByIdHandler = expressAsyncHandler(
  async (
    request: GetWebcamByIdRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>
  ) => {
    const webcamId = request.params.webcamId;

    // get webcam by id
    const webcam = await getWebcamByIdService(webcamId);
    if (!webcam) {
      response.status(404).json({ message: 'Webcam not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the webcam
    const fileUploadsArr = await Promise.all(
      webcam.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create webcamServerResponse
    const webcamServerResponse: ProductServerResponse<WebcamDocument> = {
      ...webcam,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved webcam',
      resourceData: [webcamServerResponse],
    });
  }
);

// @desc   Update a webcam by id
// @route  PUT /api/v1/actions/dashboard/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const updateWebcamByIdHandler = expressAsyncHandler(
  async (
    request: UpdateWebcamByIdRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>
  ) => {
    const { webcamId } = request.params;
    const { webcamFields } = request.body;

    // check if webcam exists
    const webcamExists = await getWebcamByIdService(webcamId);
    if (!webcamExists) {
      response.status(404).json({ message: 'Webcam does not exist', resourceData: [] });
      return;
    }

    const newWebcam = {
      ...webcamExists,
      ...webcamFields,
    };

    // update webcam
    const updatedWebcam = await updateWebcamByIdService({
      webcamId,
      fieldsToUpdate: newWebcam,
    });

    if (!updatedWebcam) {
      response.status(400).json({
        message: 'Webcam could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Webcam updated successfully',
      resourceData: [updatedWebcam],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/webcam/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForWebcamsHandler = expressAsyncHandler(
  async (
    _request: GetWebcamByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllWebcamsUploadedFileIdsService();

    if (fileUploadsIds.length === 0) {
      response.status(404).json({ message: 'No file uploads found', resourceData: [] });
      return;
    }

    const fileUploads = (await Promise.all(
      fileUploadsIds.map(async (fileUploadId) => {
        const fileUpload = await getFileUploadByIdService(fileUploadId);

        return fileUpload;
      })
    )) as FileUploadDocument[];

    // filter out any undefined values (in case fileUpload was not found)
    const filteredFileUploads = fileUploads.filter((fileUpload) => fileUpload);

    if (filteredFileUploads.length !== fileUploadsIds.length) {
      response.status(404).json({
        message: 'Some file uploads could not be found.',
        resourceData: filteredFileUploads,
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully retrieved file uploads',
      resourceData: filteredFileUploads,
    });
  }
);

// @desc   Delete all webcams
// @route  DELETE /api/v1/actions/dashboard/product-category/webcam
// @access Private/Admin/Manager
const deleteAllWebcamsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllWebcamsRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>
  ) => {
    // grab all webcams file upload ids
    const fileUploadsIds = await returnAllWebcamsUploadedFileIdsService();

    // delete all file uploads associated with all webcams
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      fileUploadsIds.map(async (fileUploadId) => deleteFileUploadByIdService(fileUploadId))
    );
    if (!deleteFileUploadsResult.every((result) => result.deletedCount !== 0)) {
      response.status(400).json({
        message: 'Some file uploads could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete all webcams
    const deleteWebcamsResult: DeleteResult = await deleteAllWebcamsService();

    if (deleteWebcamsResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All webcams could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All webcams deleted', resourceData: [] });
  }
);

// @desc   Delete a webcam by id
// @route  DELETE /api/v1/actions/dashboard/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const deleteAWebcamHandler = expressAsyncHandler(
  async (
    request: DeleteAWebcamRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>
  ) => {
    const webcamId = request.params.webcamId;

    // check if webcam exists
    const webcamExists = await getWebcamByIdService(webcamId);
    if (!webcamExists) {
      response.status(404).json({ message: 'Webcam does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this webcam
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...webcamExists.uploadedFilesIds];

    // delete all file uploads associated with this webcam
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this webcam could not be deleted. Webcam not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete webcam by id
    const deleteWebcamResult: DeleteResult = await deleteAWebcamService(webcamId);

    if (deleteWebcamResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Webcam could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Webcam deleted', resourceData: [] });
  }
);

export {
  createNewWebcamBulkHandler,
  createNewWebcamHandler,
  deleteAWebcamHandler,
  deleteAllWebcamsHandler,
  getWebcamByIdHandler,
  getQueriedWebcamsHandler,
  returnAllFileUploadsForWebcamsHandler,
  updateWebcamByIdHandler,
};
