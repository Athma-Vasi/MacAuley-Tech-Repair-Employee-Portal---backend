import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewDesktopComputerBulkRequest,
  CreateNewDesktopComputerRequest,
  DeleteADesktopComputerRequest,
  DeleteAllDesktopComputersRequest,
  GetDesktopComputerByIdRequest,
  GetQueriedDesktopComputersRequest,
  UpdateDesktopComputerByIdRequest,
} from './desktopComputer.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { DesktopComputerDocument, DesktopComputerSchema } from './desktopComputer.model';

import {
  createNewDesktopComputerService,
  deleteADesktopComputerService,
  deleteAllDesktopComputersService,
  getDesktopComputerByIdService,
  getQueriedDesktopComputersService,
  getQueriedTotalDesktopComputersService,
  returnAllDesktopComputersUploadedFileIdsService,
  updateDesktopComputerByIdService,
} from './desktopComputer.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../product.types';

// @desc   Create new desktopComputer
// @route  POST /api/v1/actions/dashboard/product-category/desktopComputer
// @access Private/Admin/Manager
const createNewDesktopComputerHandler = expressAsyncHandler(
  async (
    request: CreateNewDesktopComputerRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      desktopComputerSchema,
    } = request.body;

    const newDesktopComputerObject: DesktopComputerSchema = {
      userId,
      username,
      ...desktopComputerSchema,
    };

    const newDesktopComputer = await createNewDesktopComputerService(newDesktopComputerObject);

    if (!newDesktopComputer) {
      response.status(400).json({
        message: 'Could not create new desktopComputer',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newDesktopComputer.model} desktopComputer`,
      resourceData: [newDesktopComputer],
    });
  }
);

// DEV ROUTE
// @desc   Create new desktopComputers bulk
// @route  POST /api/v1/actions/dashboard/product-category/desktopComputer/dev
// @access Private/Admin/Manager
const createNewDesktopComputerBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewDesktopComputerBulkRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const { desktopComputerSchemas } = request.body;

    const newDesktopComputers = await Promise.all(
      desktopComputerSchemas.map(async (desktopComputerSchema) => {
        const newDesktopComputer = await createNewDesktopComputerService(desktopComputerSchema);
        return newDesktopComputer;
      })
    );

    // filter out any desktopComputers that were not created
    const successfullyCreatedDesktopComputers = newDesktopComputers.filter(
      (desktopComputer) => desktopComputer
    );

    // check if any desktopComputers were created
    if (successfullyCreatedDesktopComputers.length === desktopComputerSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedDesktopComputers.length} desktopComputers`,
        resourceData: successfullyCreatedDesktopComputers,
      });
      return;
    } else if (successfullyCreatedDesktopComputers.length === 0) {
      response.status(400).json({
        message: 'Could not create any desktopComputers',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          desktopComputerSchemas.length - successfullyCreatedDesktopComputers.length
        } desktopComputers`,
        resourceData: successfullyCreatedDesktopComputers,
      });
      return;
    }
  }
);

// @desc   Get all desktopComputers
// @route  GET /api/v1/actions/dashboard/product-category/desktopComputer
// @access Private/Admin/Manager
const getQueriedDesktopComputersHandler = expressAsyncHandler(
  async (
    request: GetQueriedDesktopComputersRequest,
    response: Response<GetQueriedResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalDesktopComputersService({
        filter: filter as FilterQuery<DesktopComputerDocument> | undefined,
      });
    }

    // get all desktopComputers
    const desktopComputers = await getQueriedDesktopComputersService({
      filter: filter as FilterQuery<DesktopComputerDocument> | undefined,
      projection: projection as QueryOptions<DesktopComputerDocument>,
      options: options as QueryOptions<DesktopComputerDocument>,
    });
    if (desktopComputers.length === 0) {
      response.status(200).json({
        message: 'No desktopComputers that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the desktopComputers (in parallel)
    const fileUploadsArrArr = await Promise.all(
      desktopComputers.map(async (desktopComputer) => {
        const fileUploadPromises = desktopComputer.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create desktopComputerServerResponse array
    const desktopComputerServerResponseArray = desktopComputers
      .map((desktopComputer, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...desktopComputer,
          fileUploads,
        };
      })
      .filter((desktopComputer) => desktopComputer);

    response.status(200).json({
      message: 'Successfully retrieved desktopComputers',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: desktopComputerServerResponseArray as DesktopComputerDocument[],
    });
  }
);

// @desc   Get desktopComputer by id
// @route  GET /api/v1/actions/dashboard/product-category/desktopComputer/:desktopComputerId
// @access Private/Admin/Manager
const getDesktopComputerByIdHandler = expressAsyncHandler(
  async (
    request: GetDesktopComputerByIdRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const desktopComputerId = request.params.desktopComputerId;

    // get desktopComputer by id
    const desktopComputer = await getDesktopComputerByIdService(desktopComputerId);
    if (!desktopComputer) {
      response.status(404).json({ message: 'DesktopComputer not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the desktopComputer
    const fileUploadsArr = await Promise.all(
      desktopComputer.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create desktopComputerServerResponse
    const desktopComputerServerResponse: ProductServerResponse<DesktopComputerDocument> = {
      ...desktopComputer,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved desktopComputer',
      resourceData: [desktopComputerServerResponse],
    });
  }
);

// @desc   Update a desktopComputer by id
// @route  PUT /api/v1/actions/dashboard/product-category/desktopComputer/:desktopComputerId
// @access Private/Admin/Manager
const updateDesktopComputerByIdHandler = expressAsyncHandler(
  async (
    request: UpdateDesktopComputerByIdRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const { desktopComputerId } = request.params;
    const { desktopComputerFields } = request.body;

    // check if desktopComputer exists
    const desktopComputerExists = await getDesktopComputerByIdService(desktopComputerId);
    if (!desktopComputerExists) {
      response.status(404).json({ message: 'DesktopComputer does not exist', resourceData: [] });
      return;
    }

    const newDesktopComputer = {
      ...desktopComputerExists,
      ...desktopComputerFields,
    };

    // update desktopComputer
    const updatedDesktopComputer = await updateDesktopComputerByIdService({
      desktopComputerId,
      fieldsToUpdate: newDesktopComputer,
    });

    if (!updatedDesktopComputer) {
      response.status(400).json({
        message: 'DesktopComputer could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'DesktopComputer updated successfully',
      resourceData: [updatedDesktopComputer],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/desktopComputer/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForDesktopComputersHandler = expressAsyncHandler(
  async (
    _request: GetDesktopComputerByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllDesktopComputersUploadedFileIdsService();

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

// @desc   Delete all desktopComputers
// @route  DELETE /api/v1/actions/dashboard/product-category/desktopComputer
// @access Private/Admin/Manager
const deleteAllDesktopComputersHandler = expressAsyncHandler(
  async (
    _request: DeleteAllDesktopComputersRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    // grab all desktopComputers file upload ids
    const fileUploadsIds = await returnAllDesktopComputersUploadedFileIdsService();

    // delete all file uploads associated with all desktopComputers
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

    // delete all desktopComputers
    const deleteDesktopComputersResult: DeleteResult = await deleteAllDesktopComputersService();

    if (deleteDesktopComputersResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All desktopComputers could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All desktopComputers deleted', resourceData: [] });
  }
);

// @desc   Delete a desktopComputer by id
// @route  DELETE /api/v1/actions/dashboard/product-category/desktopComputer/:desktopComputerId
// @access Private/Admin/Manager
const deleteADesktopComputerHandler = expressAsyncHandler(
  async (
    request: DeleteADesktopComputerRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const desktopComputerId = request.params.desktopComputerId;

    // check if desktopComputer exists
    const desktopComputerExists = await getDesktopComputerByIdService(desktopComputerId);
    if (!desktopComputerExists) {
      response.status(404).json({ message: 'DesktopComputer does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this desktopComputer
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...desktopComputerExists.uploadedFilesIds];

    // delete all file uploads associated with this desktopComputer
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this desktopComputer could not be deleted. DesktopComputer not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete desktopComputer by id
    const deleteDesktopComputerResult: DeleteResult = await deleteADesktopComputerService(
      desktopComputerId
    );

    if (deleteDesktopComputerResult.deletedCount === 0) {
      response.status(400).json({
        message: 'DesktopComputer could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'DesktopComputer deleted', resourceData: [] });
  }
);

export {
  createNewDesktopComputerBulkHandler,
  createNewDesktopComputerHandler,
  deleteADesktopComputerHandler,
  deleteAllDesktopComputersHandler,
  getDesktopComputerByIdHandler,
  getQueriedDesktopComputersHandler,
  returnAllFileUploadsForDesktopComputersHandler,
  updateDesktopComputerByIdHandler,
};
