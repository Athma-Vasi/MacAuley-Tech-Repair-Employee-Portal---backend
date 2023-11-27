import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  UpdatePurchaseInStoreRequest,
  GetPurchaseInStoreByIdRequest,
  GetAllPurchaseInStoresRequest,
  DeletePurchaseInStoreRequest,
  CreateNewPurchaseInStoreRequest,
  AddFieldsToPurchaseInStoresBulkRequest,
  CreateNewPurchaseInStoresBulkRequest,
  GetAllPurchaseInStoresBulkRequest,
} from './purchaseInStore.types';

import {
  createNewPurchaseInStoreService,
  deleteAPurchaseInStoreService,
  deleteAllPurchaseInStoresService,
  getAllPurchasesInStoreService,
  getPurchaseInStoreByIdService,
  getQueriedPurchaseInStoresByUserService,
  getQueriedPurchaseInStoresService,
  getQueriedTotalPurchaseInStoresService,
  updatePurchaseInStoreByIdService,
} from './purchaseInStore.service';
import { PurchaseInStoreDocument, PurchaseInStoreSchema } from './purchaseInStore.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';
import { removeUndefinedAndNullValues } from '../../../utils';
import { GetQueriedPurchasesInStoreByUserRequest } from './purchaseInStore.types';

// @desc   Create new user
// @route  POST /api/v1/purchase
// @access Private
const createNewPurchaseInStoreHandler = expressAsyncHandler(
  async (
    request: CreateNewPurchaseInStoreRequest,
    response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    const { purchaseInStoreSchema } = request.body;

    // create new user if all checks pass successfully
    const purchaseInStoreDocument: PurchaseInStoreDocument = await createNewPurchaseInStoreService(
      purchaseInStoreSchema
    );
    if (!purchaseInStoreDocument) {
      response.status(400).json({ message: 'PurchaseInStore creation failed', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'PurchaseInStore created successfully',
      resourceData: [purchaseInStoreDocument],
    });
  }
);

// DEV ROUTE
// @desc   create new purchases in bulk
// @route  POST /api/v1/purchase/in-store/dev
// @access Private
const createNewPurchaseInStoresBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewPurchaseInStoresBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    const { purchaseInStoreSchemas } = request.body;

    const purchaseDocuments = await Promise.all(
      purchaseInStoreSchemas.map(async (purchaseInStoreSchema) => {
        const purchaseDocument: PurchaseInStoreDocument = await createNewPurchaseInStoreService(
          purchaseInStoreSchema
        );
        return purchaseDocument;
      })
    );

    // filter out undefined values
    const purchaseDocumentsFiltered = purchaseDocuments.filter(removeUndefinedAndNullValues);

    // check if any purchases were created
    if (purchaseDocumentsFiltered.length === purchaseInStoreSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${purchaseDocumentsFiltered.length} purchases`,
        resourceData: purchaseDocumentsFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully created ${
          purchaseDocumentsFiltered.length
        } purchase(s), but failed to create ${
          purchaseInStoreSchemas.length - purchaseDocumentsFiltered.length
        } purchase(s)`,
        resourceData: purchaseDocumentsFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   Add field to all purchases
// @route  PATCH /api/v1/purchase/dev/add-field
// @access Private
const addFieldToPurchaseInStoresBulkHandler = expressAsyncHandler(
  async (
    request: AddFieldsToPurchaseInStoresBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    const { purchaseInStoreFields } = request.body;

    const updatedPurchaseInStores = await Promise.all(
      purchaseInStoreFields.map(async ({ purchaseInStoreFields, purchaseInStoreId }) => {
        const updatedPurchaseInStore = await updatePurchaseInStoreByIdService({
          purchaseInStoreFields,
          purchaseInStoreId,
        });

        return updatedPurchaseInStore;
      })
    );

    // filter out undefined values
    const updatedPurchaseInStoresFiltered = updatedPurchaseInStores.filter(
      removeUndefinedAndNullValues
    );

    // check if any purchases were updated
    if (updatedPurchaseInStoresFiltered.length === purchaseInStoreFields.length) {
      response.status(201).json({
        message: `Successfully updated ${updatedPurchaseInStoresFiltered.length} purchases`,
        resourceData: updatedPurchaseInStoresFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully updated ${
          updatedPurchaseInStoresFiltered.length
        } purchase(s), but failed to update ${
          purchaseInStoreFields.length - updatedPurchaseInStoresFiltered.length
        } purchase(s)`,
        resourceData: updatedPurchaseInStoresFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   get all purchases bulk (no filter, projection or options)
// @route  GET /api/v1/purchase/in-store/dev
// @access Private
const getAllPurchaseInStoresBulkHandler = expressAsyncHandler(
  async (
    request: GetAllPurchaseInStoresBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    const purchases = await getAllPurchasesInStoreService();

    if (!purchases.length) {
      response.status(200).json({
        message: 'Unable to find any purchases. Please try again!',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found purchases!',
      resourceData: purchases,
    });
  }
);

// @desc   Get all purchases queried
// @route  GET /api/v1/purchase/in-store
// @access Private
const getQueriedPurchaseInStoresHandler = expressAsyncHandler(
  async (
    request: GetAllPurchaseInStoresRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPurchaseInStoresService({
        filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
      });
    }

    // get all purchases
    const purchases = await getQueriedPurchaseInStoresService({
      filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
      projection: projection as QueryOptions<PurchaseInStoreDocument>,
      options: options as QueryOptions<PurchaseInStoreDocument>,
    });
    if (!purchases.length) {
      response.status(200).json({
        message: 'No purchases that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found purchases',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: purchases,
    });
  }
);

// @desc   Get all purchases queried by a user
// @route  GET /api/v1/purchase/in-store/user
// @access Private
const getQueriedPurchasesInStoreByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedPurchasesInStoreByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userToBeQueriedId to filter
    filter = { ...filter, customerId: userToBeQueriedId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPurchaseInStoresService({
        filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
      });
    }

    // get all purchases
    const purchases = await getQueriedPurchaseInStoresService({
      filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
      projection: projection as QueryOptions<PurchaseInStoreDocument>,
      options: options as QueryOptions<PurchaseInStoreDocument>,
    });
    if (!purchases.length) {
      response.status(200).json({
        message: 'No purchases that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found purchases',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: purchases,
    });
  }
);

// @desc   Get a purchase by id
// @route  GET /api/v1/purchase/in-store/:id
// @access Private
const getPurchaseInStoreByIdHandler = expressAsyncHandler(
  async (
    request: GetPurchaseInStoreByIdRequest,
    response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    const { purchaseInStoreId } = request.params;

    const purchaseDocument = await getPurchaseInStoreByIdService(purchaseInStoreId);

    if (!purchaseDocument) {
      response.status(404).json({ message: 'Purchase In-Store not found.', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Successfully found purchase data!', resourceData: [purchaseDocument] });
  }
);

// @desc   Delete a purchase
// @route  DELETE /api/v1/purchase/in-store
// @access Private
const deletePurchaseInStoreHandler = expressAsyncHandler(
  async (
    request: DeletePurchaseInStoreRequest,
    response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    // only managers/admin are allowed to delete purchases
    const { purchaseInStoreToBeDeletedId } = request.body;

    if (!purchaseInStoreToBeDeletedId) {
      response.status(400).json({ message: 'purchaseToBeDeletedId is required', resourceData: [] });
      return;
    }

    // delete purchase if all checks pass successfully
    const deletedPurchaseInStore = await deleteAPurchaseInStoreService(
      purchaseInStoreToBeDeletedId
    );

    if (!deletedPurchaseInStore.acknowledged) {
      response
        .status(400)
        .json({ message: 'Failed to delete purchase. Please try again!', resourceData: [] });
      return;
    }

    response.status(200).json({ message: 'Successfully deleted purchase!', resourceData: [] });
  }
);

// @desc   Update a purchase in-store
// @route  PATCH /api/v1/purchase/in-store
// @access Private
const updatePurchaseInStoreByIdHandler = expressAsyncHandler(
  async (
    request: UpdatePurchaseInStoreRequest,
    response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>
  ) => {
    const { purchaseInStoreFields, purchaseInStoreId } = request.body;

    // update user if all checks pass successfully
    const updatedPurchaseInStore = await updatePurchaseInStoreByIdService({
      purchaseInStoreFields,
      purchaseInStoreId,
    });

    if (!updatedPurchaseInStore) {
      response.status(400).json({ message: 'Purchase In-Store update failed', resourceData: [] });
      return;
    }

    response.status(200).json({
      message: 'Purchase In-Store updated successfully',
      resourceData: [updatedPurchaseInStore],
    });
  }
);

export {
  addFieldToPurchaseInStoresBulkHandler,
  createNewPurchaseInStoreHandler,
  createNewPurchaseInStoresBulkHandler,
  deletePurchaseInStoreHandler,
  getAllPurchaseInStoresBulkHandler,
  getPurchaseInStoreByIdHandler,
  getQueriedPurchaseInStoresHandler,
  updatePurchaseInStoreByIdHandler,
  getQueriedPurchasesInStoreByUserHandler,
};
