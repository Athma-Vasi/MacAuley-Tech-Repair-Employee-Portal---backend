import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewComputerCaseBulkRequest,
	CreateNewComputerCaseRequest,
	DeleteAComputerCaseRequest,
	DeleteAllComputerCasesRequest,
	GetComputerCaseByIdRequest,
	GetQueriedComputerCasesRequest,
	UpdateComputerCaseByIdRequest,
	UpdateComputerCasesBulkRequest,
} from "./computerCase.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type {
	ComputerCaseDocument,
	ComputerCaseSchema,
} from "./computerCase.model";

import {
	createNewComputerCaseService,
	deleteAComputerCaseService,
	deleteAllComputerCasesService,
	getComputerCaseByIdService,
	getQueriedComputerCasesService,
	getQueriedTotalComputerCasesService,
	returnAllComputerCasesUploadedFileIdsService,
	updateComputerCaseByIdService,
} from "./computerCase.service";
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

// @desc   Create new computerCase
// @route  POST /api/v1/product-category/computerCase
// @access Private/Admin/Manager
const createNewComputerCaseHandler = expressAsyncHandler(
	async (
		request: CreateNewComputerCaseRequest,
		response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>,
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

		const computerCaseDocument: ComputerCaseDocument =
			await createNewComputerCaseService(computerCaseSchema);

		if (!computerCaseDocument) {
			response.status(400).json({
				message: "Could not create new computerCase",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${computerCaseDocument.model} computerCase`,
			resourceData: [computerCaseDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new computerCases bulk
// @route  POST /api/v1/product-category/computerCase/dev
// @access Private/Admin/Manager
const createNewComputerCaseBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewComputerCaseBulkRequest,
		response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>,
	) => {
		const { computerCaseSchemas } = request.body;

		const newComputerCases = await Promise.all(
			computerCaseSchemas.map(async (computerCaseSchema) => {
				const newComputerCase =
					await createNewComputerCaseService(computerCaseSchema);
				return newComputerCase;
			}),
		);

		// filter out any computerCases that were not created
		const successfullyCreatedComputerCases = newComputerCases.filter(
			(computerCase) => computerCase,
		);

		// check if any computerCases were created
		if (
			successfullyCreatedComputerCases.length === computerCaseSchemas.length
		) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedComputerCases.length} computerCases`,
				resourceData: successfullyCreatedComputerCases,
			});
			return;
		}

		if (successfullyCreatedComputerCases.length === 0) {
			response.status(400).json({
				message: "Could not create any computerCases",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				computerCaseSchemas.length - successfullyCreatedComputerCases.length
			} computerCases`,
			resourceData: successfullyCreatedComputerCases,
		});
		return;
	},
);

// @desc   Update computerCases bulk
// @route  PATCH /api/v1/product-category/computerCase/dev
// @access Private/Admin/Manager
const updateComputerCasesBulkHandler = expressAsyncHandler(
	async (
		request: UpdateComputerCasesBulkRequest,
		response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>,
	) => {
		const { computerCaseFields } = request.body;

		const updatedComputerCases = await Promise.all(
			computerCaseFields.map(async (computerCaseField) => {
				const {
					computerCaseId,
					documentUpdate: { fields, updateOperator },
				} = computerCaseField;

				const updatedComputerCase = await updateComputerCaseByIdService({
					_id: computerCaseId,
					fields,
					updateOperator,
				});

				return updatedComputerCase;
			}),
		);

		// filter out any computerCases that were not updated
		const successfullyUpdatedComputerCases = updatedComputerCases.filter(
			removeUndefinedAndNullValues,
		);

		// check if any computerCases were updated
		if (successfullyUpdatedComputerCases.length === computerCaseFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedComputerCases.length} computerCases`,
				resourceData: successfullyUpdatedComputerCases,
			});
			return;
		}

		if (successfullyUpdatedComputerCases.length === 0) {
			response.status(400).json({
				message: "Could not update any computerCases",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				computerCaseFields.length - successfullyUpdatedComputerCases.length
			} computerCases`,
			resourceData: successfullyUpdatedComputerCases,
		});
		return;
	},
);

// @desc   Get all computerCases
// @route  GET /api/v1/product-category/computerCase
// @access Private/Admin/Manager
const getQueriedComputerCasesHandler = expressAsyncHandler(
	async (
		request: GetQueriedComputerCasesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				ComputerCaseDocument & {
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
				message: "No computerCases that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the computerCases
		const fileUploadsArrArr = await Promise.all(
			computerCases.map(async (computerCase) => {
				const fileUploadPromises = computerCase.uploadedFilesIds.map(
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

		// find all reviews associated with the computerCases
		const reviewsArrArr = await Promise.all(
			computerCases.map(async (computerCase) => {
				const reviewPromises = computerCase.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create computerCaseServerResponse array
		const computerCaseServerResponseArray = computerCases.map(
			(computerCase, index) => {
				const fileUploads = fileUploadsArrArr[index];
				const productReviews = reviewsArrArr[index];
				return {
					...computerCase,
					fileUploads,
					productReviews,
				};
			},
		);

		response.status(200).json({
			message: "Successfully retrieved computerCases",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: computerCaseServerResponseArray,
		});
	},
);

// @desc   Get computerCase by id
// @route  GET /api/v1/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const getComputerCaseByIdHandler = expressAsyncHandler(
	async (
		request: GetComputerCaseByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				ComputerCaseDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const computerCaseId = request.params.computerCaseId;

		// get computerCase by id
		const computerCase = await getComputerCaseByIdService(computerCaseId);
		if (!computerCase) {
			response
				.status(404)
				.json({ message: "ComputerCase not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the computerCase
		const fileUploads = await Promise.all(
			computerCase.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the computerCase
		const productReviews = await Promise.all(
			computerCase.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create computerCaseServerResponse
		const computerCaseServerResponse = {
			...computerCase,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved computerCase",
			resourceData: [computerCaseServerResponse],
		});
	},
);

// @desc   Update a computerCase by id
// @route  PUT /api/v1/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const updateComputerCaseByIdHandler = expressAsyncHandler(
	async (
		request: UpdateComputerCaseByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				ComputerCaseDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { computerCaseId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update computerCase
		const updatedComputerCase = await updateComputerCaseByIdService({
			_id: computerCaseId,
			fields,
			updateOperator,
		});

		if (!updatedComputerCase) {
			response.status(400).json({
				message: "ComputerCase could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the computerCase
		const fileUploads = await Promise.all(
			updatedComputerCase.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the computerCase
		const productReviews = await Promise.all(
			updatedComputerCase.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create computerCaseServerResponse
		const computerCaseServerResponse = {
			...updatedComputerCase,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "ComputerCase updated successfully",
			resourceData: [computerCaseServerResponse],
		});
	},
);

// @desc   Delete all computerCases
// @route  DELETE /api/v1/product-category/computerCase
// @access Private/Admin/Manager
const deleteAllComputerCasesHandler = expressAsyncHandler(
	async (
		_request: DeleteAllComputerCasesRequest,
		response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>,
	) => {
		// grab all computerCases file upload ids
		const uploadedFilesIds =
			await returnAllComputerCasesUploadedFileIdsService();

		// delete all file uploads associated with all computerCases
		await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId),
			),
		);

		// delete all reviews associated with all computerCases
		await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteAProductReviewService(fileUploadId),
			),
		);

		// delete all computerCases
		const deleteComputerCasesResult: DeleteResult =
			await deleteAllComputerCasesService();

		if (deleteComputerCasesResult.deletedCount === 0) {
			response.status(400).json({
				message: "All computerCases could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All computerCases deleted", resourceData: [] });
	},
);

// @desc   Delete a computerCase by id
// @route  DELETE /api/v1/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const deleteAComputerCaseHandler = expressAsyncHandler(
	async (
		request: DeleteAComputerCaseRequest,
		response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>,
	) => {
		const computerCaseId = request.params.computerCaseId;

		// check if computerCase exists
		const computerCaseExists = await getComputerCaseByIdService(computerCaseId);
		if (!computerCaseExists) {
			response
				.status(404)
				.json({ message: "Computer Case does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this computerCase
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...computerCaseExists.uploadedFilesIds];

		// delete all file uploads associated with all computerCases
		await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId),
			),
		);

		// delete all reviews associated with all computerCases
		await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteAProductReviewService(fileUploadId),
			),
		);

		// delete computerCase by id
		const deleteComputerCaseResult: DeleteResult =
			await deleteAComputerCaseService(computerCaseId);

		if (deleteComputerCaseResult.deletedCount === 0) {
			response.status(400).json({
				message: "Computer Case could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "Computer Case deleted", resourceData: [] });
	},
);

export {
	createNewComputerCaseBulkHandler,
	createNewComputerCaseHandler,
	deleteAComputerCaseHandler,
	deleteAllComputerCasesHandler,
	getComputerCaseByIdHandler,
	getQueriedComputerCasesHandler,
	updateComputerCaseByIdHandler,
	updateComputerCasesBulkHandler,
};
