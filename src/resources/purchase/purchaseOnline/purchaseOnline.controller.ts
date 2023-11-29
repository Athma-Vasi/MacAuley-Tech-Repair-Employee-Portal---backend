import expressAsyncHandler from "express-async-handler";

import type { Response } from "express";
import type {
	CreateNewPurchaseOnlinesBulkRequest,
	CreateNewPurchaseOnlineRequest,
	DeleteAPurchaseOnlineRequest,
	DeleteAllPurchaseOnlinesRequest,
	GetPurchaseOnlineByIdRequest,
	GetQueriedPurchaseOnlinesByUserRequest,
	GetQueriedPurchaseOnlinesRequest,
	UpdatePurchaseOnlineByIdRequest,
	UpdatePurchaseOnlinesBulkRequest,
	GetAllPurchaseOnlinesBulkRequest,
} from "./purchaseOnline.types";

import {
	createNewPurchaseOnlineService,
	deleteAPurchaseOnlineService,
	deleteAllPurchaseOnlinesService,
	getAllPurchaseOnlinesService,
	getPurchaseOnlineByIdService,
	getQueriedPurchaseOnlinesByUserService,
	getQueriedPurchaseOnlinesService,
	getQueriedTotalPurchaseOnlinesService,
	updatePurchaseOnlineByIdService,
} from "./purchaseOnline.service";
import {
	PurchaseOnlineDocument,
	PurchaseOnlineSchema,
} from "./purchaseOnline.model";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { FilterQuery, QueryOptions } from "mongoose";
import { removeUndefinedAndNullValues } from "../../../utils";

// @desc   Create new user
// @route  POST /api/v1/purchase/online
// @access Private
const createNewPurchaseOnlineHandler = expressAsyncHandler(
	async (
		request: CreateNewPurchaseOnlineRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const {
			userInfo: { userId },
			purchaseOnlineFields,
		} = request.body;

		const purchaseOnlineSchema: PurchaseOnlineSchema = {
			...purchaseOnlineFields,
			customerId: userId,
		};

		const purchaseOnlineDocument: PurchaseOnlineDocument =
			await createNewPurchaseOnlineService(purchaseOnlineSchema);
		if (!purchaseOnlineDocument) {
			response.status(400).json({
				message: "Purchase Online creation failed",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: "Purchase Online created successfully",
			resourceData: [purchaseOnlineDocument],
		});
	},
);

// DEV ROUTE
// @desc   create new purchaseOnlines in bulk
// @route  POST /api/v1/purchase/online/dev
// @access Private
const createNewPurchaseOnlinesBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewPurchaseOnlinesBulkRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const { purchaseOnlineSchemas } = request.body;

		const purchaseOnlineDocuments = await Promise.all(
			purchaseOnlineSchemas.map(async (purchaseOnlineSchema) => {
				const purchaseOnlineDocument: PurchaseOnlineDocument =
					await createNewPurchaseOnlineService(purchaseOnlineSchema);
				return purchaseOnlineDocument;
			}),
		);

		// filter out any purchaseOnlines that were not created
		const successfullyCreatedPurchaseOnlines = purchaseOnlineDocuments.filter(
			removeUndefinedAndNullValues,
		);

		// check if any purchaseOnlines were created
		if (
			successfullyCreatedPurchaseOnlines.length === purchaseOnlineSchemas.length
		) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedPurchaseOnlines.length} Product Reviews`,
				resourceData: successfullyCreatedPurchaseOnlines,
			});
			return;
		}

		if (successfullyCreatedPurchaseOnlines.length === 0) {
			response.status(400).json({
				message: "Could not create any Product Reviews",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				purchaseOnlineSchemas.length - successfullyCreatedPurchaseOnlines.length
			} Product Reviews`,
			resourceData: successfullyCreatedPurchaseOnlines,
		});
		return;
	},
);

// DEV ROUTE
// @desc   Add field to all purchaseOnlines
// @route  PATCH /api/v1/purchase/online/dev
// @access Private
const updatePurchaseOnlinesBulkHandler = expressAsyncHandler(
	async (
		request: UpdatePurchaseOnlinesBulkRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const { purchaseOnlineFields } = request.body;

		const updatedPurchaseOnlines = await Promise.all(
			purchaseOnlineFields.map(async (purchaseOnlineField) => {
				const {
					documentUpdate: { fields, updateOperator },
					purchaseOnlineId,
				} = purchaseOnlineField;

				const updatedPurchaseOnline = await updatePurchaseOnlineByIdService({
					_id: purchaseOnlineId,
					fields,
					updateOperator,
				});

				return updatedPurchaseOnline;
			}),
		);

		// filter out any purchaseOnlines that were not created
		const successfullyCreatedPurchaseOnlines = updatedPurchaseOnlines.filter(
			removeUndefinedAndNullValues,
		);

		// check if any purchaseOnlines were created
		if (
			successfullyCreatedPurchaseOnlines.length === purchaseOnlineFields.length
		) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedPurchaseOnlines.length} Product Reviews`,
				resourceData: successfullyCreatedPurchaseOnlines,
			});
			return;
		}

		if (successfullyCreatedPurchaseOnlines.length === 0) {
			response.status(400).json({
				message: "Could not create any Product Reviews",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				purchaseOnlineFields.length - successfullyCreatedPurchaseOnlines.length
			} Product Reviews`,
			resourceData: successfullyCreatedPurchaseOnlines,
		});
		return;
	},
);

// DEV ROUTE
// @desc   get all purchaseOnlines bulk (no filter, projection or options)
// @route  GET /api/v1/purchase/online/dev
// @access Private
const getAllPurchaseOnlinesBulkHandler = expressAsyncHandler(
	async (
		request: GetAllPurchaseOnlinesBulkRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const purchaseOnlines = await getAllPurchaseOnlinesService();

		if (!purchaseOnlines.length) {
			response.status(200).json({
				message: "Unable to find any purchase onlines. Please try again!",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase onlines!",
			resourceData: purchaseOnlines,
		});
	},
);

// @desc   Get all purchaseOnlines queried
// @route  GET /api/v1/purchase/online
// @access Private
const getQueriedPurchaseOnlinesHandler = expressAsyncHandler(
	async (
		request: GetQueriedPurchaseOnlinesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<PurchaseOnlineDocument>
		>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalPurchaseOnlinesService({
				filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
			});
		}

		// get all purchaseOnlines
		const purchaseOnlines = await getQueriedPurchaseOnlinesService({
			filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
			projection: projection as QueryOptions<PurchaseOnlineDocument>,
			options: options as QueryOptions<PurchaseOnlineDocument>,
		});
		if (!purchaseOnlines.length) {
			response.status(200).json({
				message: "No purchase onlines that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase onlines",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: purchaseOnlines,
		});
	},
);

// @desc   Get all purchaseOnlines queried by a user
// @route  GET /api/v1/purchase/online/user
// @access Private
const getQueriedPurchasesOnlineByUserHandler = expressAsyncHandler(
	async (
		request: GetQueriedPurchaseOnlinesByUserRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<PurchaseOnlineDocument>
		>,
	) => {
		let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

		let { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// assign userToBeQueriedId to filter
		filter = { ...filter, userId: userToBeQueriedId };

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalPurchaseOnlinesService({
				filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
			});
		}

		// get all purchaseOnlines
		const purchaseOnlines = await getQueriedPurchaseOnlinesService({
			filter: filter as FilterQuery<PurchaseOnlineDocument> | undefined,
			projection: projection as QueryOptions<PurchaseOnlineDocument>,
			options: options as QueryOptions<PurchaseOnlineDocument>,
		});
		if (!purchaseOnlines.length) {
			response.status(200).json({
				message: "No purchase onlines that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase onlines",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: purchaseOnlines,
		});
	},
);

// @desc   Get a purchaseOnline by id
// @route  GET /api/v1/purchase/online/:id
// @access Private
const getPurchaseOnlineByIdHandler = expressAsyncHandler(
	async (
		request: GetPurchaseOnlineByIdRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const { purchaseOnlineId } = request.params;

		const purchaseOnlineDocument =
			await getPurchaseOnlineByIdService(purchaseOnlineId);

		if (!purchaseOnlineDocument) {
			response
				.status(404)
				.json({ message: "Purchase Online not found.", resourceData: [] });
			return;
		}

		response.status(200).json({
			message: "Successfully found purchase onlines data!",
			resourceData: [purchaseOnlineDocument],
		});
	},
);

// @desc   Delete a purchaseOnline
// @route  DELETE /api/v1/purchase/online
// @access Private
const deletePurchaseOnlineHandler = expressAsyncHandler(
	async (
		request: DeleteAPurchaseOnlineRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const { purchaseOnlineId } = request.params;

		const deletedPurchaseOnline =
			await deleteAPurchaseOnlineService(purchaseOnlineId);

		if (!deletedPurchaseOnline.acknowledged) {
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

// @desc   Update a purchaseOnline
// @route  PATCH /api/v1/purchase/online
// @access Private
const updatePurchaseOnlineByIdHandler = expressAsyncHandler(
	async (
		request: UpdatePurchaseOnlineByIdRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const { purchaseOnlineId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		const updatedPurchaseOnline = await updatePurchaseOnlineByIdService({
			_id: purchaseOnlineId,
			fields,
			updateOperator,
		});

		if (!updatedPurchaseOnline) {
			response
				.status(400)
				.json({ message: "Purchase Online update failed", resourceData: [] });
			return;
		}

		response.status(200).json({
			message: "Purchase Online updated successfully",
			resourceData: [updatedPurchaseOnline],
		});
	},
);

// @desc   Delete all purchaseOnlines
// @route  DELETE /api/v1/purchase/online/delete-all
// @access Private
const deleteAllPurchaseOnlinesHandler = expressAsyncHandler(
	async (
		request: DeleteAllPurchaseOnlinesRequest,
		response: Response<ResourceRequestServerResponse<PurchaseOnlineDocument>>,
	) => {
		const deletedPurchaseOnlines = await deleteAllPurchaseOnlinesService();

		if (!deletedPurchaseOnlines.acknowledged) {
			response.status(400).json({
				message: "Failed to delete purchase onlines. Please try again!",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Successfully deleted purchase onlines!",
			resourceData: [],
		});
	},
);

export {
	updatePurchaseOnlinesBulkHandler,
	createNewPurchaseOnlineHandler,
	createNewPurchaseOnlinesBulkHandler,
	deleteAllPurchaseOnlinesHandler,
	deletePurchaseOnlineHandler,
	getAllPurchaseOnlinesBulkHandler,
	getPurchaseOnlineByIdHandler,
	getQueriedPurchaseOnlinesHandler,
	getQueriedPurchasesOnlineByUserHandler,
	updatePurchaseOnlineByIdHandler,
};
