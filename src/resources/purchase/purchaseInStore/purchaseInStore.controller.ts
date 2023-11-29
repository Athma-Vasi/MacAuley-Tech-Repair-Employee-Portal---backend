import expressAsyncHandler from "express-async-handler";

import type { Response } from "express";
import type {
	CreateNewPurchaseInStoresBulkRequest,
	CreateNewPurchaseInStoreRequest,
	DeleteAPurchaseInStoreRequest,
	DeleteAllPurchaseInStoresRequest,
	GetPurchaseInStoreByIdRequest,
	GetQueriedPurchaseInStoresByUserRequest,
	GetQueriedPurchaseInStoresRequest,
	UpdatePurchaseInStoreByIdRequest,
	UpdatePurchaseInStoresBulkRequest,
	GetAllPurchaseInStoresBulkRequest,
} from "./purchaseInStore.types";

import {
	createNewPurchaseInStoreService,
	deleteAPurchaseInStoreService,
	deleteAllPurchaseInStoresService,
	getAllPurchaseInStoresService,
	getPurchaseInStoreByIdService,
	getQueriedPurchaseInStoresByUserService,
	getQueriedPurchaseInStoresService,
	getQueriedTotalPurchaseInStoresService,
	updatePurchaseInStoreByIdService,
} from "./purchaseInStore.service";
import {
	PurchaseInStoreDocument,
	PurchaseInStoreSchema,
} from "./purchaseInStore.model";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { FilterQuery, QueryOptions } from "mongoose";
import { removeUndefinedAndNullValues } from "../../../utils";

// @desc   Create new user
// @route  POST /api/v1/purchase/in-store
// @access Private
const createNewPurchaseInStoreHandler = expressAsyncHandler(
	async (
		request: CreateNewPurchaseInStoreRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const {
			userInfo: { userId },
			purchaseInStoreFields,
		} = request.body;

		const purchaseInStoreSchema: PurchaseInStoreSchema = {
			...purchaseInStoreFields,
			userId,
		};

		const purchaseInStoreDocument: PurchaseInStoreDocument =
			await createNewPurchaseInStoreService(purchaseInStoreSchema);
		if (!purchaseInStoreDocument) {
			response.status(400).json({
				message: "Purchase In-Store creation failed",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: "Purchase In-Store created successfully",
			resourceData: [purchaseInStoreDocument],
		});
	},
);

// DEV ROUTE
// @desc   create new purchaseInStores in bulk
// @route  POST /api/v1/purchase/in-store/dev
// @access Private
const createNewPurchaseInStoresBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewPurchaseInStoresBulkRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const { purchaseInStoreSchemas } = request.body;

		const purchaseInStoreDocuments = await Promise.all(
			purchaseInStoreSchemas.map(async (purchaseInStoreSchema) => {
				const purchaseInStoreDocument: PurchaseInStoreDocument =
					await createNewPurchaseInStoreService(purchaseInStoreSchema);
				return purchaseInStoreDocument;
			}),
		);

		// filter out any purchaseInStores that were not created
		const successfullyCreatedPurchaseInStores = purchaseInStoreDocuments.filter(
			removeUndefinedAndNullValues,
		);

		// check if any purchaseInStores were created
		if (
			successfullyCreatedPurchaseInStores.length ===
			purchaseInStoreSchemas.length
		) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedPurchaseInStores.length} Product Reviews`,
				resourceData: successfullyCreatedPurchaseInStores,
			});
			return;
		}

		if (successfullyCreatedPurchaseInStores.length === 0) {
			response.status(400).json({
				message: "Could not create any Product Reviews",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				purchaseInStoreSchemas.length -
				successfullyCreatedPurchaseInStores.length
			} Product Reviews`,
			resourceData: successfullyCreatedPurchaseInStores,
		});
		return;
	},
);

// DEV ROUTE
// @desc   Add field to all purchaseInStores
// @route  PATCH /api/v1/purchase/in-store/dev
// @access Private
const updatePurchaseInStoresBulkHandler = expressAsyncHandler(
	async (
		request: UpdatePurchaseInStoresBulkRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const { purchaseInStoreFields } = request.body;

		const updatedPurchaseInStores = await Promise.all(
			purchaseInStoreFields.map(async (purchaseInStoreField) => {
				const {
					documentUpdate: { fields, updateOperator },
					purchaseInStoreId,
				} = purchaseInStoreField;

				const updatedPurchaseInStore = await updatePurchaseInStoreByIdService({
					_id: purchaseInStoreId,
					fields,
					updateOperator,
				});

				return updatedPurchaseInStore;
			}),
		);

		// filter out any purchaseInStores that were not created
		const successfullyCreatedPurchaseInStores = updatedPurchaseInStores.filter(
			removeUndefinedAndNullValues,
		);

		// check if any purchaseInStores were created
		if (
			successfullyCreatedPurchaseInStores.length ===
			purchaseInStoreFields.length
		) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedPurchaseInStores.length} Product Reviews`,
				resourceData: successfullyCreatedPurchaseInStores,
			});
			return;
		}

		if (successfullyCreatedPurchaseInStores.length === 0) {
			response.status(400).json({
				message: "Could not create any Product Reviews",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				purchaseInStoreFields.length -
				successfullyCreatedPurchaseInStores.length
			} Product Reviews`,
			resourceData: successfullyCreatedPurchaseInStores,
		});
		return;
	},
);

// DEV ROUTE
// @desc   get all purchaseInStores bulk (no filter, projection or options)
// @route  GET /api/v1/purchase/in-store/dev
// @access Private
const getAllPurchaseInStoresBulkHandler = expressAsyncHandler(
	async (
		request: GetAllPurchaseInStoresBulkRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const purchaseInStores = await getAllPurchaseInStoresService();

		if (!purchaseInStores.length) {
			response.status(200).json({
				message: "Unable to find any purchase in stores. Please try again!",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase in stores!",
			resourceData: purchaseInStores,
		});
	},
);

// @desc   Get all purchaseInStores queried
// @route  GET /api/v1/purchase/in-store
// @access Private
const getQueriedPurchaseInStoresHandler = expressAsyncHandler(
	async (
		request: GetQueriedPurchaseInStoresRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<PurchaseInStoreDocument>
		>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalPurchaseInStoresService({
				filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
			});
		}

		// get all purchaseInStores
		const purchaseInStores = await getQueriedPurchaseInStoresService({
			filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
			projection: projection as QueryOptions<PurchaseInStoreDocument>,
			options: options as QueryOptions<PurchaseInStoreDocument>,
		});
		if (!purchaseInStores.length) {
			response.status(200).json({
				message: "No purchase in stores that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase in stores",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: purchaseInStores,
		});
	},
);

// @desc   Get all purchaseInStores queried by a user
// @route  GET /api/v1/purchase/in-store/user
// @access Private
const getQueriedPurchasesOnlineByUserHandler = expressAsyncHandler(
	async (
		request: GetQueriedPurchaseInStoresByUserRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<PurchaseInStoreDocument>
		>,
	) => {
		let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

		let { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// assign userToBeQueriedId to filter
		filter = { ...filter, userId: userToBeQueriedId };

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalPurchaseInStoresService({
				filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
			});
		}

		// get all purchaseInStores
		const purchaseInStores = await getQueriedPurchaseInStoresService({
			filter: filter as FilterQuery<PurchaseInStoreDocument> | undefined,
			projection: projection as QueryOptions<PurchaseInStoreDocument>,
			options: options as QueryOptions<PurchaseInStoreDocument>,
		});
		if (!purchaseInStores.length) {
			response.status(200).json({
				message: "No purchase in stores that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase in stores",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: purchaseInStores,
		});
	},
);

// @desc   Get a purchaseInStore by id
// @route  GET /api/v1/purchase/in-store/:id
// @access Private
const getPurchaseInStoreByIdHandler = expressAsyncHandler(
	async (
		request: GetPurchaseInStoreByIdRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const { purchaseInStoreId } = request.params;

		const purchaseInStoreDocument =
			await getPurchaseInStoreByIdService(purchaseInStoreId);

		if (!purchaseInStoreDocument) {
			response
				.status(404)
				.json({ message: "Purchase In-Store not found.", resourceData: [] });
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase in stores data!",
			resourceData: [purchaseInStoreDocument],
		});
	},
);

// @desc   Delete a purchaseInStore
// @route  DELETE /api/v1/purchase/in-store
// @access Private
const deletePurchaseInStoreHandler = expressAsyncHandler(
	async (
		request: DeleteAPurchaseInStoreRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const { purchaseInStoreId } = request.params;

		const deletedPurchaseInStore =
			await deleteAPurchaseInStoreService(purchaseInStoreId);

		if (!deletedPurchaseInStore.acknowledged) {
			response.status(400).json({
				message: "Failed to delete product review. Please try again!",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully deleted product review!",
			resourceData: [],
		});
	},
);

// @desc   Update a purchaseInStore
// @route  PATCH /api/v1/purchase/in-store
// @access Private
const updatePurchaseInStoreByIdHandler = expressAsyncHandler(
	async (
		request: UpdatePurchaseInStoreByIdRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const { purchaseInStoreId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		const updatedPurchaseInStore = await updatePurchaseInStoreByIdService({
			_id: purchaseInStoreId,
			fields,
			updateOperator,
		});

		if (!updatedPurchaseInStore) {
			response
				.status(400)
				.json({ message: "Purchase In-Store update failed", resourceData: [] });
			return;
		}

		response.status(200).json({
			message: "Purchase In-Store updated successfully",
			resourceData: [updatedPurchaseInStore],
		});
	},
);

// @desc   Delete all purchaseInStores
// @route  DELETE /api/v1/purchase/in-store/delete-all
// @access Private
const deleteAllPurchaseInStoresHandler = expressAsyncHandler(
	async (
		request: DeleteAllPurchaseInStoresRequest,
		response: Response<ResourceRequestServerResponse<PurchaseInStoreDocument>>,
	) => {
		const deletedPurchaseInStores = await deleteAllPurchaseInStoresService();

		if (!deletedPurchaseInStores.acknowledged) {
			response.status(400).json({
				message: "Failed to delete purchase in stores. Please try again!",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully deleted purchase in stores!",
			resourceData: [],
		});
	},
);

export {
	updatePurchaseInStoresBulkHandler,
	createNewPurchaseInStoreHandler,
	createNewPurchaseInStoresBulkHandler,
	deleteAllPurchaseInStoresHandler,
	deletePurchaseInStoreHandler,
	getAllPurchaseInStoresBulkHandler,
	getPurchaseInStoreByIdHandler,
	getQueriedPurchaseInStoresHandler,
	getQueriedPurchasesOnlineByUserHandler,
	updatePurchaseInStoreByIdHandler,
};
