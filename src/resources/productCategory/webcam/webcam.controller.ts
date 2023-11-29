import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewWebcamBulkRequest,
	CreateNewWebcamRequest,
	DeleteAWebcamRequest,
	DeleteAllWebcamsRequest,
	GetWebcamByIdRequest,
	GetQueriedWebcamsRequest,
	UpdateWebcamByIdRequest,
	UpdateWebcamsBulkRequest,
} from "./webcam.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { WebcamDocument, WebcamSchema } from "./webcam.model";

import {
	createNewWebcamService,
	deleteAWebcamService,
	deleteAllWebcamsService,
	getWebcamByIdService,
	getQueriedWebcamsService,
	getQueriedTotalWebcamsService,
	returnAllWebcamsUploadedFileIdsService,
	updateWebcamByIdService,
} from "./webcam.service";
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

// @desc   Create new webcam
// @route  POST /api/v1/product-category/webcam
// @access Private/Admin/Manager
const createNewWebcamHandler = expressAsyncHandler(
	async (
		request: CreateNewWebcamRequest,
		response: Response<ResourceRequestServerResponse<WebcamDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			webcamFields,
		} = request.body;

		const webcamSchema: WebcamSchema = {
			userId,
			username,
			...webcamFields,
		};

		const webcamDocument: WebcamDocument =
			await createNewWebcamService(webcamSchema);

		if (!webcamDocument) {
			response.status(400).json({
				message: "Could not create new webcam",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${webcamDocument.model} webcam`,
			resourceData: [webcamDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new webcams bulk
// @route  POST /api/v1/product-category/webcam/dev
// @access Private/Admin/Manager
const createNewWebcamBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewWebcamBulkRequest,
		response: Response<ResourceRequestServerResponse<WebcamDocument>>,
	) => {
		const { webcamSchemas } = request.body;

		const newWebcams = await Promise.all(
			webcamSchemas.map(async (webcamSchema) => {
				const newWebcam = await createNewWebcamService(webcamSchema);
				return newWebcam;
			}),
		);

		// filter out any webcams that were not created
		const successfullyCreatedWebcams = newWebcams.filter((webcam) => webcam);

		// check if any webcams were created
		if (successfullyCreatedWebcams.length === webcamSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedWebcams.length} webcams`,
				resourceData: successfullyCreatedWebcams,
			});
			return;
		}

		if (successfullyCreatedWebcams.length === 0) {
			response.status(400).json({
				message: "Could not create any webcams",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				webcamSchemas.length - successfullyCreatedWebcams.length
			} webcams`,
			resourceData: successfullyCreatedWebcams,
		});
		return;
	},
);

// @desc   Update webcams bulk
// @route  PATCH /api/v1/product-category/webcam/dev
// @access Private/Admin/Manager
const updateWebcamsBulkHandler = expressAsyncHandler(
	async (
		request: UpdateWebcamsBulkRequest,
		response: Response<ResourceRequestServerResponse<WebcamDocument>>,
	) => {
		const { webcamFields } = request.body;

		const updatedWebcams = await Promise.all(
			webcamFields.map(async (webcamField) => {
				const {
					webcamId,
					documentUpdate: { fields, updateOperator },
				} = webcamField;

				const updatedWebcam = await updateWebcamByIdService({
					_id: webcamId,
					fields,
					updateOperator,
				});

				return updatedWebcam;
			}),
		);

		// filter out any webcams that were not updated
		const successfullyUpdatedWebcams = updatedWebcams.filter(
			removeUndefinedAndNullValues,
		);

		// check if any webcams were updated
		if (successfullyUpdatedWebcams.length === webcamFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedWebcams.length} webcams`,
				resourceData: successfullyUpdatedWebcams,
			});
			return;
		}

		if (successfullyUpdatedWebcams.length === 0) {
			response.status(400).json({
				message: "Could not update any webcams",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				webcamFields.length - successfullyUpdatedWebcams.length
			} webcams`,
			resourceData: successfullyUpdatedWebcams,
		});
		return;
	},
);

// @desc   Get all webcams
// @route  GET /api/v1/product-category/webcam
// @access Private/Admin/Manager
const getQueriedWebcamsHandler = expressAsyncHandler(
	async (
		request: GetQueriedWebcamsRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				WebcamDocument & {
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
			totalDocuments = await getQueriedTotalWebcamsService({
				filter: filter as FilterQuery<WebcamDocument> | undefined,
			});
		}

		// get all webcams
		const webcams = await getQueriedWebcamsService({
			filter: filter as FilterQuery<WebcamDocument> | undefined,
			projection: projection as QueryOptions<WebcamDocument>,
			options: options as QueryOptions<WebcamDocument>,
		});
		if (webcams.length === 0) {
			response.status(200).json({
				message: "No webcams that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the webcams
		const fileUploadsArrArr = await Promise.all(
			webcams.map(async (webcam) => {
				const fileUploadPromises = webcam.uploadedFilesIds.map(
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

		// find all reviews associated with the webcams
		const reviewsArrArr = await Promise.all(
			webcams.map(async (webcam) => {
				const reviewPromises = webcam.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create webcamServerResponse array
		const webcamServerResponseArray = webcams.map((webcam, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...webcam,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved webcams",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: webcamServerResponseArray,
		});
	},
);

// @desc   Get webcam by id
// @route  GET /api/v1/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const getWebcamByIdHandler = expressAsyncHandler(
	async (
		request: GetWebcamByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				WebcamDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const webcamId = request.params.webcamId;

		// get webcam by id
		const webcam = await getWebcamByIdService(webcamId);
		if (!webcam) {
			response
				.status(404)
				.json({ message: "Webcam not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the webcam
		const fileUploads = await Promise.all(
			webcam.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the webcam
		const productReviews = await Promise.all(
			webcam.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create webcamServerResponse
		const webcamServerResponse = {
			...webcam,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved webcam",
			resourceData: [webcamServerResponse],
		});
	},
);

// @desc   Update a webcam by id
// @route  PUT /api/v1/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const updateWebcamByIdHandler = expressAsyncHandler(
	async (
		request: UpdateWebcamByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				WebcamDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { webcamId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update webcam
		const updatedWebcam = await updateWebcamByIdService({
			_id: webcamId,
			fields,
			updateOperator,
		});

		if (!updatedWebcam) {
			response.status(400).json({
				message: "Webcam could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the webcam
		const fileUploads = await Promise.all(
			updatedWebcam.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the webcam
		const productReviews = await Promise.all(
			updatedWebcam.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create webcamServerResponse
		const webcamServerResponse = {
			...updatedWebcam,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Webcam updated successfully",
			resourceData: [webcamServerResponse],
		});
	},
);

// @desc   Delete all webcams
// @route  DELETE /api/v1/product-category/webcam
// @access Private/Admin/Manager
const deleteAllWebcamsHandler = expressAsyncHandler(
	async (
		_request: DeleteAllWebcamsRequest,
		response: Response<ResourceRequestServerResponse<WebcamDocument>>,
	) => {
		// grab all webcams file upload ids
		const uploadedFilesIds = await returnAllWebcamsUploadedFileIdsService();

		// delete all file uploads associated with all webcams
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

		// delete all reviews associated with all webcams
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

		// delete all webcams
		const deleteWebcamsResult: DeleteResult = await deleteAllWebcamsService();

		if (deleteWebcamsResult.deletedCount === 0) {
			response.status(400).json({
				message: "All webcams could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All webcams deleted", resourceData: [] });
	},
);

// @desc   Delete a webcam by id
// @route  DELETE /api/v1/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const deleteAWebcamHandler = expressAsyncHandler(
	async (
		request: DeleteAWebcamRequest,
		response: Response<ResourceRequestServerResponse<WebcamDocument>>,
	) => {
		const webcamId = request.params.webcamId;

		// check if webcam exists
		const webcamExists = await getWebcamByIdService(webcamId);
		if (!webcamExists) {
			response
				.status(404)
				.json({ message: "Webcam does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this webcam
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...webcamExists.uploadedFilesIds];

		// delete all file uploads associated with all webcams
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

		// delete all reviews associated with all webcams
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

		// delete webcam by id
		const deleteWebcamResult: DeleteResult =
			await deleteAWebcamService(webcamId);

		if (deleteWebcamResult.deletedCount === 0) {
			response.status(400).json({
				message: "Webcam could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Webcam deleted", resourceData: [] });
	},
);

export {
	createNewWebcamBulkHandler,
	createNewWebcamHandler,
	deleteAWebcamHandler,
	deleteAllWebcamsHandler,
	getWebcamByIdHandler,
	getQueriedWebcamsHandler,
	updateWebcamByIdHandler,
	updateWebcamsBulkHandler,
};
