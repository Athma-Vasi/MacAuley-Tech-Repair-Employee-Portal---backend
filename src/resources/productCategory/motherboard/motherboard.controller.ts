import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewMotherboardBulkRequest,
	CreateNewMotherboardRequest,
	DeleteAMotherboardRequest,
	DeleteAllMotherboardsRequest,
	GetMotherboardByIdRequest,
	GetQueriedMotherboardsRequest,
	UpdateMotherboardByIdRequest,
	UpdateMotherboardsBulkRequest,
} from "./motherboard.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type {
	MotherboardDocument,
	MotherboardSchema,
} from "./motherboard.model";

import {
	createNewMotherboardService,
	deleteAMotherboardService,
	deleteAllMotherboardsService,
	getMotherboardByIdService,
	getQueriedMotherboardsService,
	getQueriedTotalMotherboardsService,
	returnAllMotherboardsUploadedFileIdsService,
	updateMotherboardByIdService,
} from "./motherboard.service";
import {
	FileUploadDocument,
	deleteFileUploadByIdService,
	getFileUploadByIdService,
} from "../../fileUpload";

import {
	ProductReviewDocument,
	deleteAProductReviewService,
	getProductReviewByIdService,
} from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";

// @desc   Create new motherboard
// @route  POST /api/v1/product-category/motherboard
// @access Private/Admin/Manager
const createNewMotherboardHandler = expressAsyncHandler(
	async (
		request: CreateNewMotherboardRequest,
		response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
	) => {
		const { motherboardSchema } = request.body;

		const motherboardDocument: MotherboardDocument =
			await createNewMotherboardService(motherboardSchema);

		if (!motherboardDocument) {
			response.status(400).json({
				message: "Could not create new motherboard",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${motherboardDocument.model} motherboard`,
			resourceData: [motherboardDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new motherboards bulk
// @route  POST /api/v1/product-category/motherboard/dev
// @access Private/Admin/Manager
const createNewMotherboardBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewMotherboardBulkRequest,
		response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
	) => {
		const { motherboardSchemas } = request.body;

		const newMotherboards = await Promise.all(
			motherboardSchemas.map(async (motherboardSchema) => {
				const newMotherboard =
					await createNewMotherboardService(motherboardSchema);
				return newMotherboard;
			}),
		);

		// filter out any motherboards that were not created
		const successfullyCreatedMotherboards = newMotherboards.filter(
			(motherboard) => motherboard,
		);

		// check if any motherboards were created
		if (successfullyCreatedMotherboards.length === motherboardSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedMotherboards.length} motherboards`,
				resourceData: successfullyCreatedMotherboards,
			});
			return;
		}

		if (successfullyCreatedMotherboards.length === 0) {
			response.status(400).json({
				message: "Could not create any motherboards",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				motherboardSchemas.length - successfullyCreatedMotherboards.length
			} motherboards`,
			resourceData: successfullyCreatedMotherboards,
		});
		return;
	},
);

// @desc   Update motherboards bulk
// @route  PATCH /api/v1/product-category/motherboard/dev
// @access Private/Admin/Manager
const updateMotherboardsBulkHandler = expressAsyncHandler(
	async (
		request: UpdateMotherboardsBulkRequest,
		response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
	) => {
		const { motherboardFields } = request.body;

		const updatedMotherboards = await Promise.all(
			motherboardFields.map(async (motherboardField) => {
				const {
					documentId,
					documentUpdate: { fields, updateOperator },
				} = motherboardField;

				const updatedMotherboard = await updateMotherboardByIdService({
					_id: documentId,
					fields,
					updateOperator,
				});

				return updatedMotherboard;
			}),
		);

		// filter out any motherboards that were not updated
		const successfullyUpdatedMotherboards = updatedMotherboards.filter(
			removeUndefinedAndNullValues,
		);

		// check if any motherboards were updated
		if (successfullyUpdatedMotherboards.length === motherboardFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedMotherboards.length} motherboards`,
				resourceData: successfullyUpdatedMotherboards,
			});
			return;
		}

		if (successfullyUpdatedMotherboards.length === 0) {
			response.status(400).json({
				message: "Could not update any motherboards",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				motherboardFields.length - successfullyUpdatedMotherboards.length
			} motherboards`,
			resourceData: successfullyUpdatedMotherboards,
		});
		return;
	},
);

// @desc   Get all motherboards
// @route  GET /api/v1/product-category/motherboard
// @access Private/Admin/Manager
const getQueriedMotherboardsHandler = expressAsyncHandler(
	async (
		request: GetQueriedMotherboardsRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				MotherboardDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalMotherboardsService({
				filter: filter as FilterQuery<MotherboardDocument> | undefined,
			});
		}

		// get all motherboards
		const motherboards = await getQueriedMotherboardsService({
			filter: filter as FilterQuery<MotherboardDocument> | undefined,
			projection: projection as QueryOptions<MotherboardDocument>,
			options: options as QueryOptions<MotherboardDocument>,
		});
		if (motherboards.length === 0) {
			response.status(200).json({
				message: "No motherboards that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the motherboards
		const fileUploadsArrArr = await Promise.all(
			motherboards.map(async (motherboard) => {
				const fileUploadPromises = motherboard.uploadedFilesIds.map(
					async (uploadedFileId) => {
						const fileUpload = await getFileUploadByIdService(uploadedFileId);

						return fileUpload;
					},
				);

				// Wait for all the promises to resolve before continuing to the next iteration
				const fileUploads = await Promise.all(fileUploadPromises);

				// Filter out any undefined values (in case fileUpload was not found)
				return fileUploads.filter(removeUndefinedAndNullValues);
			}),
		);

		// find all reviews associated with the motherboards
		const reviewsArrArr = await Promise.all(
			motherboards.map(async (motherboard) => {
				const reviewPromises = motherboard.productReviewsIds.map(
					async (reviewId) => {
						const review = await getProductReviewByIdService(reviewId);

						return review;
					},
				);

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create motherboardServerResponse array
		const motherboardServerResponseArray = motherboards.map(
			(motherboard, index) => {
				const fileUploads = fileUploadsArrArr[index];
				const productReviews = reviewsArrArr[index];
				return {
					...motherboard,
					fileUploads,
					productReviews,
				};
			},
		);

		response.status(200).json({
			message: "Successfully retrieved motherboards",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: motherboardServerResponseArray,
		});
	},
);

// @desc   Get motherboard by id
// @route  GET /api/v1/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const getMotherboardByIdHandler = expressAsyncHandler(
	async (
		request: GetMotherboardByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				MotherboardDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const motherboardId = request.params.motherboardId;

		// get motherboard by id
		const motherboard = await getMotherboardByIdService(motherboardId);
		if (!motherboard) {
			response
				.status(404)
				.json({ message: "Motherboard not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the motherboard
		const fileUploads = await Promise.all(
			motherboard.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the motherboard
		const productReviews = await Promise.all(
			motherboard.productReviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create motherboardServerResponse
		const motherboardServerResponse = {
			...motherboard,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved motherboard",
			resourceData: [motherboardServerResponse],
		});
	},
);

// @desc   Update a motherboard by id
// @route  PUT /api/v1/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const updateMotherboardByIdHandler = expressAsyncHandler(
	async (
		request: UpdateMotherboardByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				MotherboardDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { motherboardId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update motherboard
		const updatedMotherboard = await updateMotherboardByIdService({
			_id: motherboardId,
			fields,
			updateOperator,
		});

		if (!updatedMotherboard) {
			response.status(400).json({
				message: "Motherboard could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the motherboard
		const fileUploads = await Promise.all(
			updatedMotherboard.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the motherboard
		const productReviews = await Promise.all(
			updatedMotherboard.productReviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create motherboardServerResponse
		const motherboardServerResponse = {
			...updatedMotherboard,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Motherboard updated successfully",
			resourceData: [motherboardServerResponse],
		});
	},
);

// @desc   Delete all motherboards
// @route  DELETE /api/v1/product-category/motherboard
// @access Private/Admin/Manager
const deleteAllMotherboardsHandler = expressAsyncHandler(
	async (
		_request: DeleteAllMotherboardsRequest,
		response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
	) => {
		// grab all motherboards file upload ids
		const uploadedFilesIds =
			await returnAllMotherboardsUploadedFileIdsService();

		// delete all file uploads associated with all motherboards
		const deletedFileUploads = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId),
			),
		);

		if (
			deletedFileUploads.some(
				(deletedFileUpload) => deletedFileUpload.deletedCount === 0,
			)
		) {
			response.status(400).json({
				message: "Some File uploads could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete all reviews associated with all motherboards
		const deletedReviews = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteAProductReviewService(fileUploadId),
			),
		);

		if (
			deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)
		) {
			response.status(400).json({
				message: "Some reviews could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete all motherboards
		const deleteMotherboardsResult: DeleteResult =
			await deleteAllMotherboardsService();

		if (deleteMotherboardsResult.deletedCount === 0) {
			response.status(400).json({
				message: "All motherboards could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All motherboards deleted", resourceData: [] });
	},
);

// @desc   Delete a motherboard by id
// @route  DELETE /api/v1/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const deleteAMotherboardHandler = expressAsyncHandler(
	async (
		request: DeleteAMotherboardRequest,
		response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
	) => {
		const motherboardId = request.params.motherboardId;

		// check if motherboard exists
		const motherboardExists = await getMotherboardByIdService(motherboardId);
		if (!motherboardExists) {
			response
				.status(404)
				.json({ message: "Motherboard does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this motherboard
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...motherboardExists.uploadedFilesIds];

		// delete all file uploads associated with all motherboards
		const deletedFileUploads = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId),
			),
		);

		if (
			deletedFileUploads.some(
				(deletedFileUpload) => deletedFileUpload.deletedCount === 0,
			)
		) {
			response.status(400).json({
				message: "Some File uploads could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete all reviews associated with all motherboards
		const deletedReviews = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteAProductReviewService(fileUploadId),
			),
		);

		if (
			deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)
		) {
			response.status(400).json({
				message: "Some reviews could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete motherboard by id
		const deleteMotherboardResult: DeleteResult =
			await deleteAMotherboardService(motherboardId);

		if (deleteMotherboardResult.deletedCount === 0) {
			response.status(400).json({
				message: "Motherboard could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "Motherboard deleted", resourceData: [] });
	},
);

export {
	createNewMotherboardBulkHandler,
	createNewMotherboardHandler,
	deleteAMotherboardHandler,
	deleteAllMotherboardsHandler,
	getMotherboardByIdHandler,
	getQueriedMotherboardsHandler,
	updateMotherboardByIdHandler,
	updateMotherboardsBulkHandler,
};
