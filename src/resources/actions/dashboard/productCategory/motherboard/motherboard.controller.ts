import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewMotherboardBulkRequest,
  CreateNewMotherboardRequest,
  DeleteAMotherboardRequest,
  DeleteAllMotherboardsRequest,
  GetMotherboardByIdRequest,
  GetQueriedMotherboardsRequest,
  UpdateMotherboardByIdRequest,
} from './motherboard.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { MotherboardDocument, MotherboardSchema } from './motherboard.model';

import {
  createNewMotherboardService,
  deleteAMotherboardService,
  deleteAllMotherboardsService,
  getMotherboardByIdService,
  getQueriedMotherboardsService,
  getQueriedTotalMotherboardsService,
  returnAllMotherboardsUploadedFileIdsService,
  updateMotherboardByIdService,
} from './motherboard.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../product.types';

// @desc   Create new motherboard
// @route  POST /api/v1/actions/dashboard/product-category/motherboard
// @access Private/Admin/Manager
const createNewMotherboardHandler = expressAsyncHandler(
  async (
    request: CreateNewMotherboardRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      motherboardSchema,
    } = request.body;

    const newMotherboardObject: MotherboardSchema = {
      userId,
      username,
      ...motherboardSchema,
    };

    const newMotherboard = await createNewMotherboardService(newMotherboardObject);

    if (!newMotherboard) {
      response.status(400).json({
        message: 'Could not create new motherboard',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newMotherboard.model} motherboard`,
      resourceData: [newMotherboard],
    });
  }
);

// DEV ROUTE
// @desc   Create new motherboards bulk
// @route  POST /api/v1/actions/dashboard/product-category/motherboard/dev
// @access Private/Admin/Manager
const createNewMotherboardBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewMotherboardBulkRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    const { motherboardSchemas } = request.body;

    const newMotherboards = await Promise.all(
      motherboardSchemas.map(async (motherboardSchema) => {
        const newMotherboard = await createNewMotherboardService(motherboardSchema);
        return newMotherboard;
      })
    );

    // filter out any motherboards that were not created
    const successfullyCreatedMotherboards = newMotherboards.filter((motherboard) => motherboard);

    // check if any motherboards were created
    if (successfullyCreatedMotherboards.length === motherboardSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedMotherboards.length} motherboards`,
        resourceData: successfullyCreatedMotherboards,
      });
      return;
    } else if (successfullyCreatedMotherboards.length === 0) {
      response.status(400).json({
        message: 'Could not create any motherboards',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          motherboardSchemas.length - successfullyCreatedMotherboards.length
        } motherboards`,
        resourceData: successfullyCreatedMotherboards,
      });
      return;
    }
  }
);

// @desc   Get all motherboards
// @route  GET /api/v1/actions/dashboard/product-category/motherboard
// @access Private/Admin/Manager
const getQueriedMotherboardsHandler = expressAsyncHandler(
  async (
    request: GetQueriedMotherboardsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalMotherboardsService({
        filter: filter as FilterQuery<MotherboardDocument> | undefined,
      });
    }

    // get all motherboards
    const motherboards = await getQueriedMotherboardsService({
      filter: filter as FilterQuery<MotherboardDocument> | undefined,
      projection: projection as QueryOptions<MotherboardDocument>,
      options: options as QueryOptions<MotherboardDocument>,
    });
    if (motherboards.length === 0) {
      response.status(200).json({
        message: 'No motherboards that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the motherboards (in parallel)
    const fileUploadsArrArr = await Promise.all(
      motherboards.map(async (motherboard) => {
        const fileUploadPromises = motherboard.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create motherboardServerResponse array
    const motherboardServerResponseArray = motherboards
      .map((motherboard, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...motherboard,
          fileUploads,
        };
      })
      .filter((motherboard) => motherboard);

    response.status(200).json({
      message: 'Successfully retrieved motherboards',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: motherboardServerResponseArray as MotherboardDocument[],
    });
  }
);

// @desc   Get motherboard by id
// @route  GET /api/v1/actions/dashboard/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const getMotherboardByIdHandler = expressAsyncHandler(
  async (
    request: GetMotherboardByIdRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    const motherboardId = request.params.motherboardId;

    // get motherboard by id
    const motherboard = await getMotherboardByIdService(motherboardId);
    if (!motherboard) {
      response.status(404).json({ message: 'Motherboard not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the motherboard
    const fileUploadsArr = await Promise.all(
      motherboard.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create motherboardServerResponse
    const motherboardServerResponse: ProductServerResponse<MotherboardDocument> = {
      ...motherboard,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved motherboard',
      resourceData: [motherboardServerResponse],
    });
  }
);

// @desc   Update a motherboard by id
// @route  PUT /api/v1/actions/dashboard/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const updateMotherboardByIdHandler = expressAsyncHandler(
  async (
    request: UpdateMotherboardByIdRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    const { motherboardId } = request.params;
    const { motherboardFields } = request.body;

    // check if motherboard exists
    const motherboardExists = await getMotherboardByIdService(motherboardId);
    if (!motherboardExists) {
      response.status(404).json({ message: 'Motherboard does not exist', resourceData: [] });
      return;
    }

    const newMotherboard = {
      ...motherboardExists,
      ...motherboardFields,
    };

    // update motherboard
    const updatedMotherboard = await updateMotherboardByIdService({
      motherboardId,
      fieldsToUpdate: newMotherboard,
    });

    if (!updatedMotherboard) {
      response.status(400).json({
        message: 'Motherboard could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Motherboard updated successfully',
      resourceData: [updatedMotherboard],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/motherboard/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForMotherboardsHandler = expressAsyncHandler(
  async (
    _request: GetMotherboardByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllMotherboardsUploadedFileIdsService();

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

// @desc   Delete all motherboards
// @route  DELETE /api/v1/actions/dashboard/product-category/motherboard
// @access Private/Admin/Manager
const deleteAllMotherboardsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllMotherboardsRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    // grab all motherboards file upload ids
    const fileUploadsIds = await returnAllMotherboardsUploadedFileIdsService();

    // delete all file uploads associated with all motherboards
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

    // delete all motherboards
    const deleteMotherboardsResult: DeleteResult = await deleteAllMotherboardsService();

    if (deleteMotherboardsResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All motherboards could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All motherboards deleted', resourceData: [] });
  }
);

// @desc   Delete a motherboard by id
// @route  DELETE /api/v1/actions/dashboard/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const deleteAMotherboardHandler = expressAsyncHandler(
  async (
    request: DeleteAMotherboardRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    const motherboardId = request.params.motherboardId;

    // check if motherboard exists
    const motherboardExists = await getMotherboardByIdService(motherboardId);
    if (!motherboardExists) {
      response.status(404).json({ message: 'Motherboard does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this motherboard
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...motherboardExists.uploadedFilesIds];

    // delete all file uploads associated with this motherboard
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this motherboard could not be deleted. Motherboard not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete motherboard by id
    const deleteMotherboardResult: DeleteResult = await deleteAMotherboardService(motherboardId);

    if (deleteMotherboardResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Motherboard could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Motherboard deleted', resourceData: [] });
  }
);

export {
  createNewMotherboardBulkHandler,
  createNewMotherboardHandler,
  deleteAMotherboardHandler,
  deleteAllMotherboardsHandler,
  getMotherboardByIdHandler,
  getQueriedMotherboardsHandler,
  returnAllFileUploadsForMotherboardsHandler,
  updateMotherboardByIdHandler,
};
