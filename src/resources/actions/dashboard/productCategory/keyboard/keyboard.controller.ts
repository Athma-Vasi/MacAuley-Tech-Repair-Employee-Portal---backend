import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewKeyboardBulkRequest,
  CreateNewKeyboardRequest,
  DeleteAKeyboardRequest,
  DeleteAllKeyboardsRequest,
  GetKeyboardByIdRequest,
  GetQueriedKeyboardsRequest,
  UpdateKeyboardByIdRequest,
} from './keyboard.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { KeyboardDocument, KeyboardSchema } from './keyboard.model';

import {
  createNewKeyboardService,
  deleteAKeyboardService,
  deleteAllKeyboardsService,
  getKeyboardByIdService,
  getQueriedKeyboardsService,
  getQueriedTotalKeyboardsService,
  returnAllKeyboardsUploadedFileIdsService,
  updateKeyboardByIdService,
} from './keyboard.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../product.types';

// @desc   Create new keyboard
// @route  POST /api/v1/actions/dashboard/product-category/keyboard
// @access Private/Admin/Manager
const createNewKeyboardHandler = expressAsyncHandler(
  async (
    request: CreateNewKeyboardRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      keyboardSchema,
    } = request.body;

    const newKeyboardObject: KeyboardSchema = {
      userId,
      username,
      ...keyboardSchema,
    };

    const newKeyboard = await createNewKeyboardService(newKeyboardObject);

    if (!newKeyboard) {
      response.status(400).json({
        message: 'Could not create new keyboard',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newKeyboard.model} keyboard`,
      resourceData: [newKeyboard],
    });
  }
);

// DEV ROUTE
// @desc   Create new keyboards bulk
// @route  POST /api/v1/actions/dashboard/product-category/keyboard/dev
// @access Private/Admin/Manager
const createNewKeyboardBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewKeyboardBulkRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    const { keyboardSchemas } = request.body;

    const newKeyboards = await Promise.all(
      keyboardSchemas.map(async (keyboardSchema) => {
        const newKeyboard = await createNewKeyboardService(keyboardSchema);
        return newKeyboard;
      })
    );

    // filter out any keyboards that were not created
    const successfullyCreatedKeyboards = newKeyboards.filter((keyboard) => keyboard);

    // check if any keyboards were created
    if (successfullyCreatedKeyboards.length === keyboardSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedKeyboards.length} keyboards`,
        resourceData: successfullyCreatedKeyboards,
      });
      return;
    } else if (successfullyCreatedKeyboards.length === 0) {
      response.status(400).json({
        message: 'Could not create any keyboards',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          keyboardSchemas.length - successfullyCreatedKeyboards.length
        } keyboards`,
        resourceData: successfullyCreatedKeyboards,
      });
      return;
    }
  }
);

// @desc   Get all keyboards
// @route  GET /api/v1/actions/dashboard/product-category/keyboard
// @access Private/Admin/Manager
const getQueriedKeyboardsHandler = expressAsyncHandler(
  async (
    request: GetQueriedKeyboardsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalKeyboardsService({
        filter: filter as FilterQuery<KeyboardDocument> | undefined,
      });
    }

    // get all keyboards
    const keyboards = await getQueriedKeyboardsService({
      filter: filter as FilterQuery<KeyboardDocument> | undefined,
      projection: projection as QueryOptions<KeyboardDocument>,
      options: options as QueryOptions<KeyboardDocument>,
    });
    if (keyboards.length === 0) {
      response.status(200).json({
        message: 'No keyboards that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the keyboards (in parallel)
    const fileUploadsArrArr = await Promise.all(
      keyboards.map(async (keyboard) => {
        const fileUploadPromises = keyboard.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create keyboardServerResponse array
    const keyboardServerResponseArray = keyboards
      .map((keyboard, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...keyboard,
          fileUploads,
        };
      })
      .filter((keyboard) => keyboard);

    response.status(200).json({
      message: 'Successfully retrieved keyboards',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: keyboardServerResponseArray as KeyboardDocument[],
    });
  }
);

// @desc   Get keyboard by id
// @route  GET /api/v1/actions/dashboard/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const getKeyboardByIdHandler = expressAsyncHandler(
  async (
    request: GetKeyboardByIdRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    const keyboardId = request.params.keyboardId;

    // get keyboard by id
    const keyboard = await getKeyboardByIdService(keyboardId);
    if (!keyboard) {
      response.status(404).json({ message: 'Keyboard not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the keyboard
    const fileUploadsArr = await Promise.all(
      keyboard.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create keyboardServerResponse
    const keyboardServerResponse: ProductServerResponse<KeyboardDocument> = {
      ...keyboard,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved keyboard',
      resourceData: [keyboardServerResponse],
    });
  }
);

// @desc   Update a keyboard by id
// @route  PUT /api/v1/actions/dashboard/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const updateKeyboardByIdHandler = expressAsyncHandler(
  async (
    request: UpdateKeyboardByIdRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    const { keyboardId } = request.params;
    const { keyboardFields } = request.body;

    // check if keyboard exists
    const keyboardExists = await getKeyboardByIdService(keyboardId);
    if (!keyboardExists) {
      response.status(404).json({ message: 'Keyboard does not exist', resourceData: [] });
      return;
    }

    const newKeyboard = {
      ...keyboardExists,
      ...keyboardFields,
    };

    // update keyboard
    const updatedKeyboard = await updateKeyboardByIdService({
      keyboardId,
      fieldsToUpdate: newKeyboard,
    });

    if (!updatedKeyboard) {
      response.status(400).json({
        message: 'Keyboard could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Keyboard updated successfully',
      resourceData: [updatedKeyboard],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/keyboard/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForKeyboardsHandler = expressAsyncHandler(
  async (
    _request: GetKeyboardByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllKeyboardsUploadedFileIdsService();

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

// @desc   Delete all keyboards
// @route  DELETE /api/v1/actions/dashboard/product-category/keyboard
// @access Private/Admin/Manager
const deleteAllKeyboardsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllKeyboardsRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    // grab all keyboards file upload ids
    const fileUploadsIds = await returnAllKeyboardsUploadedFileIdsService();

    // delete all file uploads associated with all keyboards
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

    // delete all keyboards
    const deleteKeyboardsResult: DeleteResult = await deleteAllKeyboardsService();

    if (deleteKeyboardsResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All keyboards could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All keyboards deleted', resourceData: [] });
  }
);

// @desc   Delete a keyboard by id
// @route  DELETE /api/v1/actions/dashboard/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const deleteAKeyboardHandler = expressAsyncHandler(
  async (
    request: DeleteAKeyboardRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    const keyboardId = request.params.keyboardId;

    // check if keyboard exists
    const keyboardExists = await getKeyboardByIdService(keyboardId);
    if (!keyboardExists) {
      response.status(404).json({ message: 'Keyboard does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this keyboard
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...keyboardExists.uploadedFilesIds];

    // delete all file uploads associated with this keyboard
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this keyboard could not be deleted. Keyboard not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete keyboard by id
    const deleteKeyboardResult: DeleteResult = await deleteAKeyboardService(keyboardId);

    if (deleteKeyboardResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Keyboard could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Keyboard deleted', resourceData: [] });
  }
);

export {
  createNewKeyboardBulkHandler,
  createNewKeyboardHandler,
  deleteAKeyboardHandler,
  deleteAllKeyboardsHandler,
  getKeyboardByIdHandler,
  getQueriedKeyboardsHandler,
  returnAllFileUploadsForKeyboardsHandler,
  updateKeyboardByIdHandler,
};
