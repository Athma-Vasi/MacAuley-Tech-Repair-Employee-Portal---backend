import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  UpdatePurchaseOnlineRequest,
  GetPurchaseOnlineByIdRequest,
  GetAllPurchaseOnlinesRequest,
  DeletePurchaseOnlineRequest,
  CreateNewPurchaseOnlineRequest,
  AddFieldsToPurchaseOnlinesBulkRequest,
  CreateNewPurchaseOnlinesBulkRequest,
  GetAllPurchaseOnlinesBulkRequest,
} from './purchaseOnline.types';

import {
  createNewPurchaseOnlineService,
  deleteAPurchaseOnlineService,
  deleteAllPurchaseOnlinesService,
  getAllPurchasesOnlineService,
  getPurchaseOnlineByIdService,
  getQueriedPurchaseOnlinesByUserService,
  getQueriedPurchaseOnlinesService,
  getQueriedTotalPurchaseOnlinesService,
  updatePurchaseOnlineByIdService,
} from './purchaseOnline.service';
import { PurchaseOnlineDocument, PurchaseOnlineSchema } from './purchaseOnline.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';
import { removeUndefinedAndNullValues } from '../../../utils';
import { GetQueriedPurchasesOnlineByUserRequest } from './purchaseOnline.types';

// @desc   Create new user
// @route  POST /api/v1/purchase
// @access Private
const createNewPurchaseOnlineHandler = expressAsyncHandler(
  async (
    request: CreateNewPurchaseOnlineRequest,
    response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    const { purchaseOnlineSchema } = request.body;

    // create new user if all checks pass successfully
    const purchaseOnlineDocument: PurchaseOnlineDocument = await createNewPurchaseOnlineService(
      purchaseOnlineSchema
    );
    if (!purchaseOnlineDocument) {
      response.status(400).json({ message: 'PurchaseOnline creation failed', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'PurchaseOnline created successfully',
      resourceData: [purchaseOnlineDocument],
    });
  }
);

// DEV ROUTE
// @desc   create new purchases in bulk
// @route  POST /api/v1/purchase/in-store/dev
// @access Private
const createNewPurchaseOnlinesBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewPurchaseOnlinesBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    const { purchaseOnlineSchemas } = request.body;

    const purchaseDocuments = await Promise.all(
      purchaseOnlineSchemas.map(async (purchaseOnlineSchema) => {
        const purchaseDocument: PurchaseOnlineDocument = await createNewPurchaseOnlineService(
          purchaseOnlineSchema
        );
        return purchaseDocument;
      })
    );

    // filter out undefined values
    const purchaseDocumentsFiltered = purchaseDocuments.filter(removeUndefinedAndNullValues);

    // check if any purchases were created
    if (purchaseDocumentsFiltered.length === purchaseOnlineSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${purchaseDocumentsFiltered.length} purchases`,
        resourceData: purchaseDocumentsFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully created ${
          purchaseDocumentsFiltered.length
        } purchase(s), but failed to create ${
          purchaseOnlineSchemas.length - purchaseDocumentsFiltered.length
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
const addFieldToPurchaseOnlinesBulkHandler = expressAsyncHandler(
  async (
    request: AddFieldsToPurchaseOnlinesBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    const { purchaseOnlineFields } = request.body;

    const updatedPurchaseOnlines = await Promise.all(
      purchaseOnlineFields.map(async ({ purchaseOnlineFields, purchaseOnlineId }) => {
        const updatedPurchaseOnline = await updatePurchaseOnlineByIdService({
          purchaseOnlineFields,
          purchaseOnlineId,
        });

        return updatedPurchaseOnline;
      })
    );

    // filter out undefined values
    const updatedPurchaseOnlinesFiltered = updatedPurchaseOnlines.filter(
      removeUndefinedAndNullValues
    );

    // check if any purchases were updated
    if (updatedPurchaseOnlinesFiltered.length === purchaseOnlineFields.length) {
      response.status(201).json({
        message: `Successfully updated ${updatedPurchaseOnlinesFiltered.length} purchases`,
        resourceData: updatedPurchaseOnlinesFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully updated ${
          updatedPurchaseOnlinesFiltered.length
        } purchase(s), but failed to update ${
          purchaseOnlineFields.length - updatedPurchaseOnlinesFiltered.length
        } purchase(s)`,
        resourceData: updatedPurchaseOnlinesFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   get all purchases bulk (no filter, projection or options)
// @route  GET /api/v1/purchase/in-store/dev
// @access Private
const getAllPurchaseOnlinesBulkHandler = expressAsyncHandler(
  async (
    request: GetAllPurchaseOnlinesBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    const purchases = await getAllPurchasesOnlineService();

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
const getQueriedPurchaseOnlinesHandler = expressAsyncHandler(
  async (
    request: GetAllPurchaseOnlinesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPurchaseOnlinesService({
        filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
      });
    }

    // get all purchases
    const purchases = await getQueriedPurchaseOnlinesService({
      filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
      projection: projection as QueryOptions<PurchaseOnlineDocument>,
      options: options as QueryOptions<PurchaseOnlineDocument>,
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
const getQueriedPurchasesOnlineByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedPurchasesOnlineByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userToBeQueriedId to filter
    filter = { ...filter, customerId: userToBeQueriedId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPurchaseOnlinesService({
        filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
      });
    }

    // get all purchases
    const purchases = await getQueriedPurchaseOnlinesService({
      filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
      projection: projection as QueryOptions<PurchaseOnlineDocument>,
      options: options as QueryOptions<PurchaseOnlineDocument>,
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
const getPurchaseOnlineByIdHandler = expressAsyncHandler(
  async (
    request: GetPurchaseOnlineByIdRequest,
    response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    const { purchaseOnlineId } = request.params;

    const purchaseDocument = await getPurchaseOnlineByIdService(purchaseOnlineId);

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
const deletePurchaseOnlineHandler = expressAsyncHandler(
  async (
    request: DeletePurchaseOnlineRequest,
    response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    // only managers/admin are allowed to delete purchases
    const { purchaseOnlineToBeDeletedId } = request.body;

    if (!purchaseOnlineToBeDeletedId) {
      response.status(400).json({ message: 'purchaseToBeDeletedId is required', resourceData: [] });
      return;
    }

    // delete purchase if all checks pass successfully
    const deletedPurchaseOnline = await deleteAPurchaseOnlineService(purchaseOnlineToBeDeletedId);

    if (!deletedPurchaseOnline.acknowledged) {
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
const updatePurchaseOnlineByIdHandler = expressAsyncHandler(
  async (
    request: UpdatePurchaseOnlineRequest,
    response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>
  ) => {
    const { purchaseOnlineFields, purchaseOnlineId } = request.body;

    // update user if all checks pass successfully
    const updatedPurchaseOnline = await updatePurchaseOnlineByIdService({
      purchaseOnlineFields,
      purchaseOnlineId,
    });

    if (!updatedPurchaseOnline) {
      response.status(400).json({ message: 'Purchase In-Store update failed', resourceData: [] });
      return;
    }

    response.status(200).json({
      message: 'Purchase In-Store updated successfully',
      resourceData: [updatedPurchaseOnline],
    });
  }
);

export {
  addFieldToPurchaseOnlinesBulkHandler,
  createNewPurchaseOnlineHandler,
  createNewPurchaseOnlinesBulkHandler,
  deletePurchaseOnlineHandler,
  getAllPurchaseOnlinesBulkHandler,
  getPurchaseOnlineByIdHandler,
  getQueriedPurchaseOnlinesHandler,
  updatePurchaseOnlineByIdHandler,
  getQueriedPurchasesOnlineByUserHandler,
};
