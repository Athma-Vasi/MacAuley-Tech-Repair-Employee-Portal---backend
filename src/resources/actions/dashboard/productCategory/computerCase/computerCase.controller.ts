import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewComputerCaseBulkRequest,
  CreateNewComputerCaseRequest,
  DeleteAComputerCaseRequest,
  DeleteAllComputerCasesRequest,
  GetComputerCaseByIdRequest,
  GetQueriedComputerCasesRequest,
  UpdateComputerCaseByIdRequest,
} from './computerCase.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { ComputerCaseDocument, ComputerCaseSchema } from './computerCase.model';

import {
  createNewComputerCaseService,
  deleteAComputerCaseService,
  deleteAllComputerCasesService,
  getComputerCaseByIdService,
  getQueriedComputerCasesService,
  getQueriedTotalComputerCasesService,
  returnAllComputerCasesUploadedFileIdsService,
  updateComputerCaseByIdService,
} from './computerCase.service';
import {
  FileUploadDocument,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../product.types';

// @desc   Create new computerCase
// @route  POST /api/v1/actions/dashboard/product-category/computerCase
// @access Private/Admin/Manager
const createNewComputerCaseHandler = expressAsyncHandler(
  async (
    request: CreateNewComputerCaseRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      computerCaseFields,
    } = request.body;

    const computerCaseSchema: ComputerCaseSchema = {
      userId,
      username,
      ...computerCaseFields,
    };

    const computerCaseDocument: ComputerCaseDocument = await createNewComputerCaseService(
      computerCaseSchema
    );

    if (!computerCaseDocument) {
      response.status(400).json({
        message: 'Could not create new computerCase',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${computerCaseDocument.model} computerCase`,
      resourceData: [computerCaseDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new computerCases bulk
// @route  POST /api/v1/actions/dashboard/product-category/computerCase/dev
// @access Private/Admin/Manager
const createNewComputerCaseBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewComputerCaseBulkRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const { computerCaseSchemas } = request.body;

    const newComputerCases = await Promise.all(
      computerCaseSchemas.map(async (computerCaseSchema) => {
        const newComputerCase = await createNewComputerCaseService(computerCaseSchema);
        return newComputerCase;
      })
    );

    // filter out any computerCases that were not created
    const successfullyCreatedComputerCases = newComputerCases.filter(
      (computerCase) => computerCase
    );

    // check if any computerCases were created
    if (successfullyCreatedComputerCases.length === computerCaseSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedComputerCases.length} computerCases`,
        resourceData: successfullyCreatedComputerCases,
      });
      return;
    } else if (successfullyCreatedComputerCases.length === 0) {
      response.status(400).json({
        message: 'Could not create any computerCases',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          computerCaseSchemas.length - successfullyCreatedComputerCases.length
        } computerCases`,
        resourceData: successfullyCreatedComputerCases,
      });
      return;
    }
  }
);

// @desc   Get all computerCases
// @route  GET /api/v1/actions/dashboard/product-category/computerCase
// @access Private/Admin/Manager
const getQueriedComputerCasesHandler = expressAsyncHandler(
  async (
    request: GetQueriedComputerCasesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalComputerCasesService({
        filter: filter as FilterQuery<ComputerCaseDocument> | undefined,
      });
    }

    // get all computerCases
    const computerCases = await getQueriedComputerCasesService({
      filter: filter as FilterQuery<ComputerCaseDocument> | undefined,
      projection: projection as QueryOptions<ComputerCaseDocument>,
      options: options as QueryOptions<ComputerCaseDocument>,
    });
    if (computerCases.length === 0) {
      response.status(200).json({
        message: 'No computerCases that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the computerCases (in parallel)
    const fileUploadsArrArr = await Promise.all(
      computerCases.map(async (computerCase) => {
        const fileUploadPromises = computerCase.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create computerCaseServerResponse array
    const computerCaseServerResponseArray = computerCases
      .map((computerCase, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...computerCase,
          fileUploads,
        };
      })
      .filter((computerCase) => computerCase);

    response.status(200).json({
      message: 'Successfully retrieved computerCases',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: computerCaseServerResponseArray as ComputerCaseDocument[],
    });
  }
);

// @desc   Get computerCase by id
// @route  GET /api/v1/actions/dashboard/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const getComputerCaseByIdHandler = expressAsyncHandler(
  async (
    request: GetComputerCaseByIdRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const computerCaseId = request.params.computerCaseId;

    // get computerCase by id
    const computerCase = await getComputerCaseByIdService(computerCaseId);
    if (!computerCase) {
      response.status(404).json({ message: 'ComputerCase not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the computerCase
    const fileUploadsArr = await Promise.all(
      computerCase.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create computerCaseServerResponse
    const computerCaseServerResponse: ProductServerResponse<ComputerCaseDocument> = {
      ...computerCase,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved computerCase',
      resourceData: [computerCaseServerResponse],
    });
  }
);

// @desc   Update a computerCase by id
// @route  PUT /api/v1/actions/dashboard/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const updateComputerCaseByIdHandler = expressAsyncHandler(
  async (
    request: UpdateComputerCaseByIdRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const { computerCaseId } = request.params;
    const { computerCaseFields } = request.body;

    // check if computerCase exists
    const computerCaseExists = await getComputerCaseByIdService(computerCaseId);
    if (!computerCaseExists) {
      response.status(404).json({ message: 'ComputerCase does not exist', resourceData: [] });
      return;
    }

    const newComputerCase = {
      ...computerCaseExists,
      ...computerCaseFields,
    };

    // update computerCase
    const updatedComputerCase = await updateComputerCaseByIdService({
      computerCaseId,
      fieldsToUpdate: newComputerCase,
    });

    if (!updatedComputerCase) {
      response.status(400).json({
        message: 'ComputerCase could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'ComputerCase updated successfully',
      resourceData: [updatedComputerCase],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/computerCase/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForComputerCasesHandler = expressAsyncHandler(
  async (
    _request: GetComputerCaseByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllComputerCasesUploadedFileIdsService();

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

// @desc   Delete all computerCases
// @route  DELETE /api/v1/actions/dashboard/product-category/computerCase
// @access Private/Admin/Manager
const deleteAllComputerCasesHandler = expressAsyncHandler(
  async (
    _request: DeleteAllComputerCasesRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    // grab all computerCases file upload ids
    const fileUploadsIds = await returnAllComputerCasesUploadedFileIdsService();

    // delete all file uploads associated with all computerCases
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

    // delete all computerCases
    const deleteComputerCasesResult: DeleteResult = await deleteAllComputerCasesService();

    if (deleteComputerCasesResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All computerCases could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All computerCases deleted', resourceData: [] });
  }
);

// @desc   Delete a computerCase by id
// @route  DELETE /api/v1/actions/dashboard/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const deleteAComputerCaseHandler = expressAsyncHandler(
  async (
    request: DeleteAComputerCaseRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const computerCaseId = request.params.computerCaseId;

    // check if computerCase exists
    const computerCaseExists = await getComputerCaseByIdService(computerCaseId);
    if (!computerCaseExists) {
      response.status(404).json({ message: 'ComputerCase does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this computerCase
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...computerCaseExists.uploadedFilesIds];

    // delete all file uploads associated with this computerCase
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this computerCase could not be deleted. ComputerCase not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete computerCase by id
    const deleteComputerCaseResult: DeleteResult = await deleteAComputerCaseService(computerCaseId);

    if (deleteComputerCaseResult.deletedCount === 0) {
      response.status(400).json({
        message: 'ComputerCase could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'ComputerCase deleted', resourceData: [] });
  }
);

export {
  createNewComputerCaseBulkHandler,
  createNewComputerCaseHandler,
  deleteAComputerCaseHandler,
  deleteAllComputerCasesHandler,
  getComputerCaseByIdHandler,
  getQueriedComputerCasesHandler,
  returnAllFileUploadsForComputerCasesHandler,
  updateComputerCaseByIdHandler,
};
