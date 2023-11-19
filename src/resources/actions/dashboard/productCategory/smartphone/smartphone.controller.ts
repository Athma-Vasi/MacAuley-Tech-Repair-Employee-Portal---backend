import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewSmartphoneBulkRequest,
  CreateNewSmartphoneRequest,
  DeleteASmartphoneRequest,
  DeleteAllSmartphonesRequest,
  GetSmartphoneByIdRequest,
  GetQueriedSmartphonesRequest,
  UpdateSmartphoneByIdRequest,
} from './smartphone.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { SmartphoneDocument, SmartphoneSchema } from './smartphone.model';

import {
  createNewSmartphoneService,
  deleteASmartphoneService,
  deleteAllSmartphonesService,
  getSmartphoneByIdService,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  returnAllSmartphonesUploadedFileIdsService,
  updateSmartphoneByIdService,
} from './smartphone.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../types';

// @desc   Create new smartphone
// @route  POST /api/v1/actions/dashboard/product-category/smartphone
// @access Private/Admin/Manager
const createNewSmartphoneHandler = expressAsyncHandler(
  async (
    request: CreateNewSmartphoneRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      smartphoneSchema,
    } = request.body;

    const newSmartphoneObject: SmartphoneSchema = {
      userId,
      username,
      ...smartphoneSchema,
    };

    const newSmartphone = await createNewSmartphoneService(newSmartphoneObject);

    if (!newSmartphone) {
      response.status(400).json({
        message: 'Could not create new smartphone',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newSmartphone.model} smartphone`,
      resourceData: [newSmartphone],
    });
  }
);

// DEV ROUTE
// @desc   Create new smartphones bulk
// @route  POST /api/v1/actions/dashboard/product-category/smartphone/dev
// @access Private/Admin/Manager
const createNewSmartphoneBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewSmartphoneBulkRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const { smartphoneSchemas } = request.body;

    const newSmartphones = await Promise.all(
      smartphoneSchemas.map(async (smartphoneSchema) => {
        const newSmartphone = await createNewSmartphoneService(smartphoneSchema);
        return newSmartphone;
      })
    );

    // filter out any smartphones that were not created
    const successfullyCreatedSmartphones = newSmartphones.filter((smartphone) => smartphone);

    // check if any smartphones were created
    if (successfullyCreatedSmartphones.length === smartphoneSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedSmartphones.length} smartphones`,
        resourceData: successfullyCreatedSmartphones,
      });
      return;
    } else if (successfullyCreatedSmartphones.length === 0) {
      response.status(400).json({
        message: 'Could not create any smartphones',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          smartphoneSchemas.length - successfullyCreatedSmartphones.length
        } smartphones`,
        resourceData: successfullyCreatedSmartphones,
      });
      return;
    }
  }
);

// @desc   Get all smartphones
// @route  GET /api/v1/actions/dashboard/product-category/smartphone
// @access Private/Admin/Manager
const getQueriedSmartphonesHandler = expressAsyncHandler(
  async (
    request: GetQueriedSmartphonesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSmartphonesService({
        filter: filter as FilterQuery<SmartphoneDocument> | undefined,
      });
    }

    // get all smartphones
    const smartphones = await getQueriedSmartphonesService({
      filter: filter as FilterQuery<SmartphoneDocument> | undefined,
      projection: projection as QueryOptions<SmartphoneDocument>,
      options: options as QueryOptions<SmartphoneDocument>,
    });
    if (smartphones.length === 0) {
      response.status(200).json({
        message: 'No smartphones that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the smartphones (in parallel)
    const fileUploadsArrArr = await Promise.all(
      smartphones.map(async (smartphone) => {
        const fileUploadPromises = smartphone.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create smartphoneServerResponse array
    const smartphoneServerResponseArray = smartphones
      .map((smartphone, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...smartphone,
          fileUploads,
        };
      })
      .filter((smartphone) => smartphone);

    response.status(200).json({
      message: 'Successfully retrieved smartphones',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: smartphoneServerResponseArray as SmartphoneDocument[],
    });
  }
);

// @desc   Get smartphone by id
// @route  GET /api/v1/actions/dashboard/product-category/smartphone/:smartphoneId
// @access Private/Admin/Manager
const getSmartphoneByIdHandler = expressAsyncHandler(
  async (
    request: GetSmartphoneByIdRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const smartphoneId = request.params.smartphoneId;

    // get smartphone by id
    const smartphone = await getSmartphoneByIdService(smartphoneId);
    if (!smartphone) {
      response.status(404).json({ message: 'Smartphone not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the smartphone
    const fileUploadsArr = await Promise.all(
      smartphone.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create smartphoneServerResponse
    const smartphoneServerResponse: ProductServerResponse<SmartphoneDocument> = {
      ...smartphone,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved smartphone',
      resourceData: [smartphoneServerResponse],
    });
  }
);

// @desc   Update a smartphone by id
// @route  PUT /api/v1/actions/dashboard/product-category/smartphone/:smartphoneId
// @access Private/Admin/Manager
const updateSmartphoneByIdHandler = expressAsyncHandler(
  async (
    request: UpdateSmartphoneByIdRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const { smartphoneId } = request.params;
    const { smartphoneFields } = request.body;

    // check if smartphone exists
    const smartphoneExists = await getSmartphoneByIdService(smartphoneId);
    if (!smartphoneExists) {
      response.status(404).json({ message: 'Smartphone does not exist', resourceData: [] });
      return;
    }

    const newSmartphone = {
      ...smartphoneExists,
      ...smartphoneFields,
    };

    // update smartphone
    const updatedSmartphone = await updateSmartphoneByIdService({
      smartphoneId,
      fieldsToUpdate: newSmartphone,
    });

    if (!updatedSmartphone) {
      response.status(400).json({
        message: 'Smartphone could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Smartphone updated successfully',
      resourceData: [updatedSmartphone],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/smartphone/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForSmartphonesHandler = expressAsyncHandler(
  async (
    _request: GetSmartphoneByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllSmartphonesUploadedFileIdsService();

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

// @desc   Delete all smartphones
// @route  DELETE /api/v1/actions/dashboard/product-category/smartphone
// @access Private/Admin/Manager
const deleteAllSmartphonesHandler = expressAsyncHandler(
  async (
    _request: DeleteAllSmartphonesRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    // grab all smartphones file upload ids
    const fileUploadsIds = await returnAllSmartphonesUploadedFileIdsService();

    // delete all file uploads associated with all smartphones
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

    // delete all smartphones
    const deleteSmartphonesResult: DeleteResult = await deleteAllSmartphonesService();

    if (deleteSmartphonesResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All smartphones could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All smartphones deleted', resourceData: [] });
  }
);

// @desc   Delete a smartphone by id
// @route  DELETE /api/v1/actions/dashboard/product-category/smartphone/:smartphoneId
// @access Private/Admin/Manager
const deleteASmartphoneHandler = expressAsyncHandler(
  async (
    request: DeleteASmartphoneRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const smartphoneId = request.params.smartphoneId;

    // check if smartphone exists
    const smartphoneExists = await getSmartphoneByIdService(smartphoneId);
    if (!smartphoneExists) {
      response.status(404).json({ message: 'Smartphone does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this smartphone
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...smartphoneExists.uploadedFilesIds];

    // delete all file uploads associated with this smartphone
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this smartphone could not be deleted. Smartphone not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete smartphone by id
    const deleteSmartphoneResult: DeleteResult = await deleteASmartphoneService(smartphoneId);

    if (deleteSmartphoneResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Smartphone could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Smartphone deleted', resourceData: [] });
  }
);

export {
  createNewSmartphoneBulkHandler,
  createNewSmartphoneHandler,
  deleteASmartphoneHandler,
  deleteAllSmartphonesHandler,
  getSmartphoneByIdHandler,
  getQueriedSmartphonesHandler,
  returnAllFileUploadsForSmartphonesHandler,
  updateSmartphoneByIdHandler,
};
