import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewLaptopBulkRequest,
  CreateNewLaptopRequest,
  DeleteALaptopRequest,
  DeleteAllLaptopsRequest,
  GetLaptopByIdRequest,
  GetQueriedLaptopsRequest,
  UpdateLaptopByIdRequest,
} from './laptop.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { LaptopDocument, LaptopSchema } from './laptop.model';

import {
  createNewLaptopService,
  deleteALaptopService,
  deleteAllLaptopsService,
  getLaptopByIdService,
  getQueriedLaptopsService,
  getQueriedTotalLaptopsService,
  returnAllLaptopsUploadedFileIdsService,
  updateLaptopByIdService,
} from './laptop.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../product.types';

// @desc   Create new laptop
// @route  POST /api/v1/actions/dashboard/product-category/laptop
// @access Private/Admin/Manager
const createNewLaptopHandler = expressAsyncHandler(
  async (
    request: CreateNewLaptopRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      laptopSchema,
    } = request.body;

    const newLaptopObject: LaptopSchema = {
      userId,
      username,
      ...laptopSchema,
    };

    const newLaptop = await createNewLaptopService(newLaptopObject);

    if (!newLaptop) {
      response.status(400).json({
        message: 'Could not create new laptop',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newLaptop.model} laptop`,
      resourceData: [newLaptop],
    });
  }
);

// DEV ROUTE
// @desc   Create new laptops bulk
// @route  POST /api/v1/actions/dashboard/product-category/laptop/dev
// @access Private/Admin/Manager
const createNewLaptopBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewLaptopBulkRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const { laptopSchemas } = request.body;

    const newLaptops = await Promise.all(
      laptopSchemas.map(async (laptopSchema) => {
        const newLaptop = await createNewLaptopService(laptopSchema);
        return newLaptop;
      })
    );

    // filter out any laptops that were not created
    const successfullyCreatedLaptops = newLaptops.filter((laptop) => laptop);

    // check if any laptops were created
    if (successfullyCreatedLaptops.length === laptopSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedLaptops.length} laptops`,
        resourceData: successfullyCreatedLaptops,
      });
      return;
    } else if (successfullyCreatedLaptops.length === 0) {
      response.status(400).json({
        message: 'Could not create any laptops',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          laptopSchemas.length - successfullyCreatedLaptops.length
        } laptops`,
        resourceData: successfullyCreatedLaptops,
      });
      return;
    }
  }
);

// @desc   Get all laptops
// @route  GET /api/v1/actions/dashboard/product-category/laptop
// @access Private/Admin/Manager
const getQueriedLaptopsHandler = expressAsyncHandler(
  async (
    request: GetQueriedLaptopsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<LaptopDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalLaptopsService({
        filter: filter as FilterQuery<LaptopDocument> | undefined,
      });
    }

    // get all laptops
    const laptops = await getQueriedLaptopsService({
      filter: filter as FilterQuery<LaptopDocument> | undefined,
      projection: projection as QueryOptions<LaptopDocument>,
      options: options as QueryOptions<LaptopDocument>,
    });
    if (laptops.length === 0) {
      response.status(200).json({
        message: 'No laptops that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the laptops (in parallel)
    const fileUploadsArrArr = await Promise.all(
      laptops.map(async (laptop) => {
        const fileUploadPromises = laptop.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create laptopServerResponse array
    const laptopServerResponseArray = laptops
      .map((laptop, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...laptop,
          fileUploads,
        };
      })
      .filter((laptop) => laptop);

    response.status(200).json({
      message: 'Successfully retrieved laptops',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: laptopServerResponseArray as LaptopDocument[],
    });
  }
);

// @desc   Get laptop by id
// @route  GET /api/v1/actions/dashboard/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const getLaptopByIdHandler = expressAsyncHandler(
  async (
    request: GetLaptopByIdRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const laptopId = request.params.laptopId;

    // get laptop by id
    const laptop = await getLaptopByIdService(laptopId);
    if (!laptop) {
      response.status(404).json({ message: 'Laptop not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the laptop
    const fileUploadsArr = await Promise.all(
      laptop.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create laptopServerResponse
    const laptopServerResponse: ProductServerResponse<LaptopDocument> = {
      ...laptop,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved laptop',
      resourceData: [laptopServerResponse],
    });
  }
);

// @desc   Update a laptop by id
// @route  PUT /api/v1/actions/dashboard/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const updateLaptopByIdHandler = expressAsyncHandler(
  async (
    request: UpdateLaptopByIdRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const { laptopId } = request.params;
    const { laptopFields } = request.body;

    // check if laptop exists
    const laptopExists = await getLaptopByIdService(laptopId);
    if (!laptopExists) {
      response.status(404).json({ message: 'Laptop does not exist', resourceData: [] });
      return;
    }

    const newLaptop = {
      ...laptopExists,
      ...laptopFields,
    };

    // update laptop
    const updatedLaptop = await updateLaptopByIdService({
      laptopId,
      fieldsToUpdate: newLaptop,
    });

    if (!updatedLaptop) {
      response.status(400).json({
        message: 'Laptop could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Laptop updated successfully',
      resourceData: [updatedLaptop],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/laptop/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForLaptopsHandler = expressAsyncHandler(
  async (
    _request: GetLaptopByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllLaptopsUploadedFileIdsService();

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

// @desc   Delete all laptops
// @route  DELETE /api/v1/actions/dashboard/product-category/laptop
// @access Private/Admin/Manager
const deleteAllLaptopsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllLaptopsRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    // grab all laptops file upload ids
    const fileUploadsIds = await returnAllLaptopsUploadedFileIdsService();

    // delete all file uploads associated with all laptops
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

    // delete all laptops
    const deleteLaptopsResult: DeleteResult = await deleteAllLaptopsService();

    if (deleteLaptopsResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All laptops could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All laptops deleted', resourceData: [] });
  }
);

// @desc   Delete a laptop by id
// @route  DELETE /api/v1/actions/dashboard/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const deleteALaptopHandler = expressAsyncHandler(
  async (
    request: DeleteALaptopRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const laptopId = request.params.laptopId;

    // check if laptop exists
    const laptopExists = await getLaptopByIdService(laptopId);
    if (!laptopExists) {
      response.status(404).json({ message: 'Laptop does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this laptop
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...laptopExists.uploadedFilesIds];

    // delete all file uploads associated with this laptop
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this laptop could not be deleted. Laptop not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete laptop by id
    const deleteLaptopResult: DeleteResult = await deleteALaptopService(laptopId);

    if (deleteLaptopResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Laptop could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Laptop deleted', resourceData: [] });
  }
);

export {
  createNewLaptopBulkHandler,
  createNewLaptopHandler,
  deleteALaptopHandler,
  deleteAllLaptopsHandler,
  getLaptopByIdHandler,
  getQueriedLaptopsHandler,
  returnAllFileUploadsForLaptopsHandler,
  updateLaptopByIdHandler,
};
