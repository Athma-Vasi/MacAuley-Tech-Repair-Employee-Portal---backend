import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewMouseBulkRequest,
  CreateNewMouseRequest,
  DeleteAMouseRequest,
  DeleteAllMousesRequest,
  GetMouseByIdRequest,
  GetQueriedMousesRequest,
  UpdateMouseByIdRequest,
} from './mouse.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { MouseDocument, MouseSchema } from './mouse.model';

import {
  createNewMouseService,
  deleteAMouseService,
  deleteAllMousesService,
  getMouseByIdService,
  getQueriedMousesService,
  getQueriedTotalMousesService,
  returnAllMouseUploadedFileIdsService,
  updateMouseByIdService,
} from './mouse.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../types';

// @desc   Create new mouse
// @route  POST /api/v1/actions/dashboard/product-category/mouse
// @access Private/Admin/Manager
const createNewMouseHandler = expressAsyncHandler(
  async (
    request: CreateNewMouseRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      mouseSchema,
    } = request.body;

    const newMouseObject: MouseSchema = {
      userId,
      username,
      ...mouseSchema,
    };

    const newMouse = await createNewMouseService(newMouseObject);

    if (!newMouse) {
      response.status(400).json({
        message: 'Could not create new mouse',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newMouse.model} mouse`,
      resourceData: [newMouse],
    });
  }
);

// DEV ROUTE
// @desc   Create new mouses bulk
// @route  POST /api/v1/actions/dashboard/product-category/mouse/dev
// @access Private/Admin/Manager
const createNewMouseBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewMouseBulkRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const { mouseSchemas } = request.body;

    const newMouses = await Promise.all(
      mouseSchemas.map(async (mouseSchema) => {
        const newMouse = await createNewMouseService(mouseSchema);
        return newMouse;
      })
    );

    // filter out any mouses that were not created
    const successfullyCreatedMouses = newMouses.filter((mouse) => mouse);

    // check if any mouses were created
    if (successfullyCreatedMouses.length === mouseSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedMouses.length} mouses`,
        resourceData: successfullyCreatedMouses,
      });
      return;
    } else if (successfullyCreatedMouses.length === 0) {
      response.status(400).json({
        message: 'Could not create any mouses',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          mouseSchemas.length - successfullyCreatedMouses.length
        } mouses`,
        resourceData: successfullyCreatedMouses,
      });
      return;
    }
  }
);

// @desc   Get all mouses
// @route  GET /api/v1/actions/dashboard/product-category/mouse
// @access Private/Admin/Manager
const getQueriedMousesHandler = expressAsyncHandler(
  async (
    request: GetQueriedMousesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<MouseDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalMousesService({
        filter: filter as FilterQuery<MouseDocument> | undefined,
      });
    }

    // get all mouses
    const mouses = await getQueriedMousesService({
      filter: filter as FilterQuery<MouseDocument> | undefined,
      projection: projection as QueryOptions<MouseDocument>,
      options: options as QueryOptions<MouseDocument>,
    });
    if (mouses.length === 0) {
      response.status(200).json({
        message: 'No mouses that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the mouses (in parallel)
    const fileUploadsArrArr = await Promise.all(
      mouses.map(async (mouse) => {
        const fileUploadPromises = mouse.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create mouseServerResponse array
    const mouseServerResponseArray = mouses
      .map((mouse, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...mouse,
          fileUploads,
        };
      })
      .filter((mouse) => mouse);

    response.status(200).json({
      message: 'Successfully retrieved mouses',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: mouseServerResponseArray as MouseDocument[],
    });
  }
);

// @desc   Get mouse by id
// @route  GET /api/v1/actions/dashboard/product-category/mouse/:mouseId
// @access Private/Admin/Manager
const getMouseByIdHandler = expressAsyncHandler(
  async (
    request: GetMouseByIdRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const mouseId = request.params.mouseId;

    // get mouse by id
    const mouse = await getMouseByIdService(mouseId);
    if (!mouse) {
      response.status(404).json({ message: 'Mouse not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the mouse
    const fileUploadsArr = await Promise.all(
      mouse.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create mouseServerResponse
    const mouseServerResponse: ProductServerResponse<MouseDocument> = {
      ...mouse,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved mouse',
      resourceData: [mouseServerResponse],
    });
  }
);

// @desc   Update a mouse by id
// @route  PUT /api/v1/actions/dashboard/product-category/mouse/:mouseId
// @access Private/Admin/Manager
const updateMouseByIdHandler = expressAsyncHandler(
  async (
    request: UpdateMouseByIdRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const { mouseId } = request.params;
    const { mouseFields } = request.body;

    // check if mouse exists
    const mouseExists = await getMouseByIdService(mouseId);
    if (!mouseExists) {
      response.status(404).json({ message: 'Mouse does not exist', resourceData: [] });
      return;
    }

    const newMouse = {
      ...mouseExists,
      ...mouseFields,
    };

    // update mouse
    const updatedMouse = await updateMouseByIdService({
      mouseId,
      fieldsToUpdate: newMouse,
    });

    if (!updatedMouse) {
      response.status(400).json({
        message: 'Mouse could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Mouse updated successfully',
      resourceData: [updatedMouse],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/mouse/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForMousesHandler = expressAsyncHandler(
  async (
    _request: GetMouseByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllMouseUploadedFileIdsService();

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

// @desc   Delete all mouses
// @route  DELETE /api/v1/actions/dashboard/product-category/mouse
// @access Private/Admin/Manager
const deleteAllMousesHandler = expressAsyncHandler(
  async (
    _request: DeleteAllMousesRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    // grab all mouses file upload ids
    const fileUploadsIds = await returnAllMouseUploadedFileIdsService();

    // delete all file uploads associated with all mouses
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

    // delete all mouses
    const deleteMousesResult: DeleteResult = await deleteAllMousesService();

    if (deleteMousesResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All mouses could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All mouses deleted', resourceData: [] });
  }
);

// @desc   Delete a mouse by id
// @route  DELETE /api/v1/actions/dashboard/product-category/mouse/:mouseId
// @access Private/Admin/Manager
const deleteAMouseHandler = expressAsyncHandler(
  async (
    request: DeleteAMouseRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const mouseId = request.params.mouseId;

    // check if mouse exists
    const mouseExists = await getMouseByIdService(mouseId);
    if (!mouseExists) {
      response.status(404).json({ message: 'Mouse does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this mouse
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...mouseExists.uploadedFilesIds];

    // delete all file uploads associated with this mouse
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this mouse could not be deleted. Mouse not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete mouse by id
    const deleteMouseResult: DeleteResult = await deleteAMouseService(mouseId);

    if (deleteMouseResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Mouse could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Mouse deleted', resourceData: [] });
  }
);

export {
  createNewMouseBulkHandler,
  createNewMouseHandler,
  deleteAMouseHandler,
  deleteAllMousesHandler,
  getMouseByIdHandler,
  getQueriedMousesHandler,
  returnAllFileUploadsForMousesHandler,
  updateMouseByIdHandler,
};
