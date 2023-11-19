import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewAccessoryBulkRequest,
  CreateNewAccessoryRequest,
  DeleteAnAccessoryRequest,
  DeleteAllAccessoriesRequest,
  GetAccessoryByIdRequest,
  GetQueriedAccessoriesRequest,
  UpdateAccessoryByIdRequest,
} from './accessory.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { AccessoryDocument, AccessorySchema } from './accessory.model';

import {
  createNewAccessoryService,
  deleteAnAccessoryService,
  deleteAllAccessoriesService,
  getAccessoryByIdService,
  getQueriedAccessoriesService,
  getQueriedTotalAccessoriesService,
  returnAllAccessoriesUploadedFileIdsService,
  updateAccessoryByIdService,
} from './accessory.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../types';

// @desc   Create new accessory
// @route  POST /api/v1/actions/dashboard/product-category/accessory
// @access Private/Admin/Manager
const createNewAccessoryHandler = expressAsyncHandler(
  async (
    request: CreateNewAccessoryRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      accessorySchema,
    } = request.body;

    const newAccessoryObject: AccessorySchema = {
      userId,
      username,
      ...accessorySchema,
    };

    const newAccessory = await createNewAccessoryService(newAccessoryObject);

    if (!newAccessory) {
      response.status(400).json({
        message: 'Could not create new accessory',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newAccessory.model} accessory`,
      resourceData: [newAccessory],
    });
  }
);

// DEV ROUTE
// @desc   Create new accessories bulk
// @route  POST /api/v1/actions/dashboard/product-category/accessory/dev
// @access Private/Admin/Manager
const createNewAccessoryBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewAccessoryBulkRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    const { accessorySchemas } = request.body;

    const newAccessories = await Promise.all(
      accessorySchemas.map(async (accessorySchema) => {
        const newAccessory = await createNewAccessoryService(accessorySchema);
        return newAccessory;
      })
    );

    // filter out any accessories that were not created
    const successfullyCreatedAccessories = newAccessories.filter((accessory) => accessory);

    // check if any accessories were created
    if (successfullyCreatedAccessories.length === accessorySchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedAccessories.length} accessories`,
        resourceData: successfullyCreatedAccessories,
      });
      return;
    } else if (successfullyCreatedAccessories.length === 0) {
      response.status(400).json({
        message: 'Could not create any accessories',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          accessorySchemas.length - successfullyCreatedAccessories.length
        } accessories`,
        resourceData: successfullyCreatedAccessories,
      });
      return;
    }
  }
);

// @desc   Get all accessories
// @route  GET /api/v1/actions/dashboard/product-category/accessory
// @access Private/Admin/Manager
const getQueriedAccessoriesHandler = expressAsyncHandler(
  async (
    request: GetQueriedAccessoriesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAccessoriesService({
        filter: filter as FilterQuery<AccessoryDocument> | undefined,
      });
    }

    // get all accessories
    const accessories = await getQueriedAccessoriesService({
      filter: filter as FilterQuery<AccessoryDocument> | undefined,
      projection: projection as QueryOptions<AccessoryDocument>,
      options: options as QueryOptions<AccessoryDocument>,
    });
    if (accessories.length === 0) {
      response.status(200).json({
        message: 'No accessories that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the accessories (in parallel)
    const fileUploadsArrArr = await Promise.all(
      accessories.map(async (accessory) => {
        const fileUploadPromises = accessory.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create accessoryServerResponse array
    const accessoryServerResponseArray = accessories
      .map((accessory, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...accessory,
          fileUploads,
        };
      })
      .filter((accessory) => accessory);

    response.status(200).json({
      message: 'Successfully retrieved accessories',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: accessoryServerResponseArray as AccessoryDocument[],
    });
  }
);

// @desc   Get accessory by id
// @route  GET /api/v1/actions/dashboard/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const getAccessoryByIdHandler = expressAsyncHandler(
  async (
    request: GetAccessoryByIdRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    const accessoryId = request.params.accessoryId;

    // get accessory by id
    const accessory = await getAccessoryByIdService(accessoryId);
    if (!accessory) {
      response.status(404).json({ message: 'Accessory not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the accessory
    const fileUploadsArr = await Promise.all(
      accessory.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create accessoryServerResponse
    const accessoryServerResponse: ProductServerResponse<AccessoryDocument> = {
      ...accessory,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved accessory',
      resourceData: [accessoryServerResponse],
    });
  }
);

// @desc   Update a accessory by id
// @route  PUT /api/v1/actions/dashboard/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const updateAccessoryByIdHandler = expressAsyncHandler(
  async (
    request: UpdateAccessoryByIdRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    const { accessoryId } = request.params;
    const { accessoryFields } = request.body;

    // check if accessory exists
    const accessoryExists = await getAccessoryByIdService(accessoryId);
    if (!accessoryExists) {
      response.status(404).json({ message: 'Accessory does not exist', resourceData: [] });
      return;
    }

    const newAccessory = {
      ...accessoryExists,
      ...accessoryFields,
    };

    // update accessory
    const updatedAccessory = await updateAccessoryByIdService({
      accessoryId,
      fieldsToUpdate: newAccessory,
    });

    if (!updatedAccessory) {
      response.status(400).json({
        message: 'Accessory could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Accessory updated successfully',
      resourceData: [updatedAccessory],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/accessory/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForAccessoriesHandler = expressAsyncHandler(
  async (
    _request: GetAccessoryByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllAccessoriesUploadedFileIdsService();

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

// @desc   Delete all accessories
// @route  DELETE /api/v1/actions/dashboard/product-category/accessory
// @access Private/Admin/Manager
const deleteAllAccessoriesHandler = expressAsyncHandler(
  async (
    _request: DeleteAllAccessoriesRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    // grab all accessories file upload ids
    const fileUploadsIds = await returnAllAccessoriesUploadedFileIdsService();

    // delete all file uploads associated with all accessories
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

    // delete all accessories
    const deleteAccessoriesResult: DeleteResult = await deleteAllAccessoriesService();

    if (deleteAccessoriesResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All accessories could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All accessories deleted', resourceData: [] });
  }
);

// @desc   Delete a accessory by id
// @route  DELETE /api/v1/actions/dashboard/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const deleteAAccessoryHandler = expressAsyncHandler(
  async (
    request: DeleteAnAccessoryRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    const accessoryId = request.params.accessoryId;

    // check if accessory exists
    const accessoryExists = await getAccessoryByIdService(accessoryId);
    if (!accessoryExists) {
      response.status(404).json({ message: 'Accessory does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this accessory
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...accessoryExists.uploadedFilesIds];

    // delete all file uploads associated with this accessory
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this accessory could not be deleted. Accessory not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete accessory by id
    const deleteAccessoryResult: DeleteResult = await deleteAnAccessoryService(accessoryId);

    if (deleteAccessoryResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Accessory could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Accessory deleted', resourceData: [] });
  }
);

export {
  createNewAccessoryBulkHandler,
  createNewAccessoryHandler,
  deleteAAccessoryHandler,
  deleteAllAccessoriesHandler,
  getAccessoryByIdHandler,
  getQueriedAccessoriesHandler,
  returnAllFileUploadsForAccessoriesHandler,
  updateAccessoryByIdHandler,
};