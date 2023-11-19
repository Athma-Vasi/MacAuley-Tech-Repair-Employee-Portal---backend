import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewTabletBulkRequest,
  CreateNewTabletRequest,
  DeleteATabletRequest,
  DeleteAllTabletsRequest,
  GetTabletByIdRequest,
  GetQueriedTabletsRequest,
  UpdateTabletByIdRequest,
} from './tablet.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { TabletDocument, TabletSchema } from './tablet.model';

import {
  createNewTabletService,
  deleteATabletService,
  deleteAllTabletsService,
  getTabletByIdService,
  getQueriedTabletsService,
  getQueriedTotalTabletsService,
  returnAllTabletsUploadedFileIdsService,
  updateTabletByIdService,
} from './tablet.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../product.types';

// @desc   Create new tablet
// @route  POST /api/v1/actions/dashboard/product-category/tablet
// @access Private/Admin/Manager
const createNewTabletHandler = expressAsyncHandler(
  async (
    request: CreateNewTabletRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      tabletSchema,
    } = request.body;

    const newTabletObject: TabletSchema = {
      userId,
      username,
      ...tabletSchema,
    };

    const newTablet = await createNewTabletService(newTabletObject);

    if (!newTablet) {
      response.status(400).json({
        message: 'Could not create new tablet',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newTablet.model} tablet`,
      resourceData: [newTablet],
    });
  }
);

// DEV ROUTE
// @desc   Create new tablets bulk
// @route  POST /api/v1/actions/dashboard/product-category/tablet/dev
// @access Private/Admin/Manager
const createNewTabletBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewTabletBulkRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>
  ) => {
    const { tabletSchemas } = request.body;

    const newTablets = await Promise.all(
      tabletSchemas.map(async (tabletSchema) => {
        const newTablet = await createNewTabletService(tabletSchema);
        return newTablet;
      })
    );

    // filter out any tablets that were not created
    const successfullyCreatedTablets = newTablets.filter((tablet) => tablet);

    // check if any tablets were created
    if (successfullyCreatedTablets.length === tabletSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedTablets.length} tablets`,
        resourceData: successfullyCreatedTablets,
      });
      return;
    } else if (successfullyCreatedTablets.length === 0) {
      response.status(400).json({
        message: 'Could not create any tablets',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          tabletSchemas.length - successfullyCreatedTablets.length
        } tablets`,
        resourceData: successfullyCreatedTablets,
      });
      return;
    }
  }
);

// @desc   Get all tablets
// @route  GET /api/v1/actions/dashboard/product-category/tablet
// @access Private/Admin/Manager
const getQueriedTabletsHandler = expressAsyncHandler(
  async (
    request: GetQueriedTabletsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<TabletDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalTabletsService({
        filter: filter as FilterQuery<TabletDocument> | undefined,
      });
    }

    // get all tablets
    const tablets = await getQueriedTabletsService({
      filter: filter as FilterQuery<TabletDocument> | undefined,
      projection: projection as QueryOptions<TabletDocument>,
      options: options as QueryOptions<TabletDocument>,
    });
    if (tablets.length === 0) {
      response.status(200).json({
        message: 'No tablets that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the tablets (in parallel)
    const fileUploadsArrArr = await Promise.all(
      tablets.map(async (tablet) => {
        const fileUploadPromises = tablet.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create tabletServerResponse array
    const tabletServerResponseArray = tablets
      .map((tablet, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...tablet,
          fileUploads,
        };
      })
      .filter((tablet) => tablet);

    response.status(200).json({
      message: 'Successfully retrieved tablets',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: tabletServerResponseArray as TabletDocument[],
    });
  }
);

// @desc   Get tablet by id
// @route  GET /api/v1/actions/dashboard/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const getTabletByIdHandler = expressAsyncHandler(
  async (
    request: GetTabletByIdRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>
  ) => {
    const tabletId = request.params.tabletId;

    // get tablet by id
    const tablet = await getTabletByIdService(tabletId);
    if (!tablet) {
      response.status(404).json({ message: 'Tablet not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the tablet
    const fileUploadsArr = await Promise.all(
      tablet.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create tabletServerResponse
    const tabletServerResponse: ProductServerResponse<TabletDocument> = {
      ...tablet,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved tablet',
      resourceData: [tabletServerResponse],
    });
  }
);

// @desc   Update a tablet by id
// @route  PUT /api/v1/actions/dashboard/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const updateTabletByIdHandler = expressAsyncHandler(
  async (
    request: UpdateTabletByIdRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>
  ) => {
    const { tabletId } = request.params;
    const { tabletFields } = request.body;

    // check if tablet exists
    const tabletExists = await getTabletByIdService(tabletId);
    if (!tabletExists) {
      response.status(404).json({ message: 'Tablet does not exist', resourceData: [] });
      return;
    }

    const newTablet = {
      ...tabletExists,
      ...tabletFields,
    };

    // update tablet
    const updatedTablet = await updateTabletByIdService({
      tabletId,
      fieldsToUpdate: newTablet,
    });

    if (!updatedTablet) {
      response.status(400).json({
        message: 'Tablet could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Tablet updated successfully',
      resourceData: [updatedTablet],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/tablet/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForTabletsHandler = expressAsyncHandler(
  async (
    _request: GetTabletByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllTabletsUploadedFileIdsService();

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

// @desc   Delete all tablets
// @route  DELETE /api/v1/actions/dashboard/product-category/tablet
// @access Private/Admin/Manager
const deleteAllTabletsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllTabletsRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>
  ) => {
    // grab all tablets file upload ids
    const fileUploadsIds = await returnAllTabletsUploadedFileIdsService();

    // delete all file uploads associated with all tablets
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

    // delete all tablets
    const deleteTabletsResult: DeleteResult = await deleteAllTabletsService();

    if (deleteTabletsResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All tablets could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All tablets deleted', resourceData: [] });
  }
);

// @desc   Delete a tablet by id
// @route  DELETE /api/v1/actions/dashboard/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const deleteATabletHandler = expressAsyncHandler(
  async (
    request: DeleteATabletRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>
  ) => {
    const tabletId = request.params.tabletId;

    // check if tablet exists
    const tabletExists = await getTabletByIdService(tabletId);
    if (!tabletExists) {
      response.status(404).json({ message: 'Tablet does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this tablet
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...tabletExists.uploadedFilesIds];

    // delete all file uploads associated with this tablet
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this tablet could not be deleted. Tablet not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete tablet by id
    const deleteTabletResult: DeleteResult = await deleteATabletService(tabletId);

    if (deleteTabletResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Tablet could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Tablet deleted', resourceData: [] });
  }
);

export {
  createNewTabletBulkHandler,
  createNewTabletHandler,
  deleteATabletHandler,
  deleteAllTabletsHandler,
  getTabletByIdHandler,
  getQueriedTabletsHandler,
  returnAllFileUploadsForTabletsHandler,
  updateTabletByIdHandler,
};
