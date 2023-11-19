import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewDisplayBulkRequest,
  CreateNewDisplayRequest,
  DeleteADisplayRequest,
  DeleteAllDisplaysRequest,
  GetDisplayByIdRequest,
  GetQueriedDisplaysRequest,
  UpdateDisplayByIdRequest,
} from './display.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { DisplayDocument, DisplaySchema } from './display.model';

import {
  createNewDisplayService,
  deleteADisplayService,
  deleteAllDisplaysService,
  getDisplayByIdService,
  getQueriedDisplaysService,
  getQueriedTotalDisplaysService,
  returnAllDisplaysUploadedFileIdsService,
  updateDisplayByIdService,
} from './display.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../types';

// @desc   Create new display
// @route  POST /api/v1/actions/dashboard/product-category/display
// @access Private/Admin/Manager
const createNewDisplayHandler = expressAsyncHandler(
  async (
    request: CreateNewDisplayRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      displaySchema,
    } = request.body;

    const newDisplayObject: DisplaySchema = {
      userId,
      username,
      ...displaySchema,
    };

    const newDisplay = await createNewDisplayService(newDisplayObject);

    if (!newDisplay) {
      response.status(400).json({
        message: 'Could not create new display',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newDisplay.model} display`,
      resourceData: [newDisplay],
    });
  }
);

// DEV ROUTE
// @desc   Create new displays bulk
// @route  POST /api/v1/actions/dashboard/product-category/display/dev
// @access Private/Admin/Manager
const createNewDisplayBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewDisplayBulkRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const { displaySchemas } = request.body;

    const newDisplays = await Promise.all(
      displaySchemas.map(async (displaySchema) => {
        const newDisplay = await createNewDisplayService(displaySchema);
        return newDisplay;
      })
    );

    // filter out any displays that were not created
    const successfullyCreatedDisplays = newDisplays.filter((display) => display);

    // check if any displays were created
    if (successfullyCreatedDisplays.length === displaySchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedDisplays.length} displays`,
        resourceData: successfullyCreatedDisplays,
      });
      return;
    } else if (successfullyCreatedDisplays.length === 0) {
      response.status(400).json({
        message: 'Could not create any displays',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          displaySchemas.length - successfullyCreatedDisplays.length
        } displays`,
        resourceData: successfullyCreatedDisplays,
      });
      return;
    }
  }
);

// @desc   Get all displays
// @route  GET /api/v1/actions/dashboard/product-category/display
// @access Private/Admin/Manager
const getQueriedDisplaysHandler = expressAsyncHandler(
  async (
    request: GetQueriedDisplaysRequest,
    response: Response<GetQueriedResourceRequestServerResponse<DisplayDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalDisplaysService({
        filter: filter as FilterQuery<DisplayDocument> | undefined,
      });
    }

    // get all displays
    const displays = await getQueriedDisplaysService({
      filter: filter as FilterQuery<DisplayDocument> | undefined,
      projection: projection as QueryOptions<DisplayDocument>,
      options: options as QueryOptions<DisplayDocument>,
    });
    if (displays.length === 0) {
      response.status(200).json({
        message: 'No displays that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the displays (in parallel)
    const fileUploadsArrArr = await Promise.all(
      displays.map(async (display) => {
        const fileUploadPromises = display.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create displayServerResponse array
    const displayServerResponseArray = displays
      .map((display, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...display,
          fileUploads,
        };
      })
      .filter((display) => display);

    response.status(200).json({
      message: 'Successfully retrieved displays',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: displayServerResponseArray as DisplayDocument[],
    });
  }
);

// @desc   Get display by id
// @route  GET /api/v1/actions/dashboard/product-category/display/:displayId
// @access Private/Admin/Manager
const getDisplayByIdHandler = expressAsyncHandler(
  async (
    request: GetDisplayByIdRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const displayId = request.params.displayId;

    // get display by id
    const display = await getDisplayByIdService(displayId);
    if (!display) {
      response.status(404).json({ message: 'Display not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the display
    const fileUploadsArr = await Promise.all(
      display.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create displayServerResponse
    const displayServerResponse: ProductServerResponse<DisplayDocument> = {
      ...display,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved display',
      resourceData: [displayServerResponse],
    });
  }
);

// @desc   Update a display by id
// @route  PUT /api/v1/actions/dashboard/product-category/display/:displayId
// @access Private/Admin/Manager
const updateDisplayByIdHandler = expressAsyncHandler(
  async (
    request: UpdateDisplayByIdRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const { displayId } = request.params;
    const { displayFields } = request.body;

    // check if display exists
    const displayExists = await getDisplayByIdService(displayId);
    if (!displayExists) {
      response.status(404).json({ message: 'Display does not exist', resourceData: [] });
      return;
    }

    const newDisplay = {
      ...displayExists,
      ...displayFields,
    };

    // update display
    const updatedDisplay = await updateDisplayByIdService({
      displayId,
      fieldsToUpdate: newDisplay,
    });

    if (!updatedDisplay) {
      response.status(400).json({
        message: 'Display could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Display updated successfully',
      resourceData: [updatedDisplay],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/display/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForDisplaysHandler = expressAsyncHandler(
  async (
    _request: GetDisplayByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllDisplaysUploadedFileIdsService();

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

// @desc   Delete all displays
// @route  DELETE /api/v1/actions/dashboard/product-category/display
// @access Private/Admin/Manager
const deleteAllDisplaysHandler = expressAsyncHandler(
  async (
    _request: DeleteAllDisplaysRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    // grab all displays file upload ids
    const fileUploadsIds = await returnAllDisplaysUploadedFileIdsService();

    // delete all file uploads associated with all displays
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

    // delete all displays
    const deleteDisplaysResult: DeleteResult = await deleteAllDisplaysService();

    if (deleteDisplaysResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All displays could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All displays deleted', resourceData: [] });
  }
);

// @desc   Delete a display by id
// @route  DELETE /api/v1/actions/dashboard/product-category/display/:displayId
// @access Private/Admin/Manager
const deleteADisplayHandler = expressAsyncHandler(
  async (
    request: DeleteADisplayRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const displayId = request.params.displayId;

    // check if display exists
    const displayExists = await getDisplayByIdService(displayId);
    if (!displayExists) {
      response.status(404).json({ message: 'Display does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this display
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...displayExists.uploadedFilesIds];

    // delete all file uploads associated with this display
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this display could not be deleted. Display not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete display by id
    const deleteDisplayResult: DeleteResult = await deleteADisplayService(displayId);

    if (deleteDisplayResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Display could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Display deleted', resourceData: [] });
  }
);

export {
  createNewDisplayBulkHandler,
  createNewDisplayHandler,
  deleteADisplayHandler,
  deleteAllDisplaysHandler,
  getDisplayByIdHandler,
  getQueriedDisplaysHandler,
  returnAllFileUploadsForDisplaysHandler,
  updateDisplayByIdHandler,
};
