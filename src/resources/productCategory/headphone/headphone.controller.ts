import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewHeadphoneBulkRequest,
	CreateNewHeadphoneRequest,
	DeleteAHeadphoneRequest,
	DeleteAllHeadphonesRequest,
	GetHeadphoneByIdRequest,
	GetQueriedHeadphonesRequest,
	UpdateHeadphoneByIdRequest,
	UpdateHeadphonesBulkRequest,
} from "./headphone.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { HeadphoneDocument, HeadphoneSchema } from "./headphone.model";

import {
	createNewHeadphoneService,
	deleteAHeadphoneService,
	deleteAllHeadphonesService,
	getHeadphoneByIdService,
	getQueriedHeadphonesService,
	getQueriedTotalHeadphonesService,
	returnAllHeadphonesUploadedFileIdsService,
	updateHeadphoneByIdService,
} from "./headphone.service";
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

// @desc   Create new headphone
// @route  POST /api/v1/product-category/headphone
// @access Private/Admin/Manager
const createNewHeadphoneHandler = expressAsyncHandler(
	async (
		request: CreateNewHeadphoneRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			headphoneFields,
		} = request.body;

		const headphoneSchema: HeadphoneSchema = {
			userId,
			username,
			...headphoneFields,
		};

		const headphoneDocument: HeadphoneDocument =
			await createNewHeadphoneService(headphoneSchema);

		if (!headphoneDocument) {
			response.status(400).json({
				message: "Could not create new headphone",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${headphoneDocument.model} headphone`,
			resourceData: [headphoneDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new headphones bulk
// @route  POST /api/v1/product-category/headphone/dev
// @access Private/Admin/Manager
const createNewHeadphoneBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewHeadphoneBulkRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const { headphoneSchemas } = request.body;

		const newHeadphones = await Promise.all(
			headphoneSchemas.map(async (headphoneSchema) => {
				const newHeadphone = await createNewHeadphoneService(headphoneSchema);
				return newHeadphone;
			}),
		);

		// filter out any headphones that were not created
		const successfullyCreatedHeadphones = newHeadphones.filter(
			(headphone) => headphone,
		);

		// check if any headphones were created
		if (successfullyCreatedHeadphones.length === headphoneSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedHeadphones.length} headphones`,
				resourceData: successfullyCreatedHeadphones,
			});
			return;
		}

		if (successfullyCreatedHeadphones.length === 0) {
			response.status(400).json({
				message: "Could not create any headphones",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				headphoneSchemas.length - successfullyCreatedHeadphones.length
			} headphones`,
			resourceData: successfullyCreatedHeadphones,
		});
		return;
	},
);

// @desc   Update headphones bulk
// @route  PATCH /api/v1/product-category/headphone/dev
// @access Private/Admin/Manager
const updateHeadphonesBulkHandler = expressAsyncHandler(
	async (
		request: UpdateHeadphonesBulkRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const { headphoneFields } = request.body;

		const updatedHeadphones = await Promise.all(
			headphoneFields.map(async (headphoneField) => {
				const {
					headphoneId,
					documentUpdate: { fields, updateOperator },
				} = headphoneField;

				const updatedHeadphone = await updateHeadphoneByIdService({
					_id: headphoneId,
					fields,
					updateOperator,
				});

				return updatedHeadphone;
			}),
		);

		// filter out any headphones that were not updated
		const successfullyUpdatedHeadphones = updatedHeadphones.filter(
			removeUndefinedAndNullValues,
		);

		// check if any headphones were updated
		if (successfullyUpdatedHeadphones.length === headphoneFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedHeadphones.length} headphones`,
				resourceData: successfullyUpdatedHeadphones,
			});
			return;
		}

		if (successfullyUpdatedHeadphones.length === 0) {
			response.status(400).json({
				message: "Could not update any headphones",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				headphoneFields.length - successfullyUpdatedHeadphones.length
			} headphones`,
			resourceData: successfullyUpdatedHeadphones,
		});
		return;
	},
);

// @desc   Get all headphones
// @route  GET /api/v1/product-category/headphone
// @access Private/Admin/Manager
const getQueriedHeadphonesHandler = expressAsyncHandler(
	async (
		request: GetQueriedHeadphonesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				HeadphoneDocument & {
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
			totalDocuments = await getQueriedTotalHeadphonesService({
				filter: filter as FilterQuery<HeadphoneDocument> | undefined,
			});
		}

		// get all headphones
		const headphones = await getQueriedHeadphonesService({
			filter: filter as FilterQuery<HeadphoneDocument> | undefined,
			projection: projection as QueryOptions<HeadphoneDocument>,
			options: options as QueryOptions<HeadphoneDocument>,
		});
		if (headphones.length === 0) {
			response.status(200).json({
				message: "No headphones that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the headphones
		const fileUploadsArrArr = await Promise.all(
			headphones.map(async (headphone) => {
				const fileUploadPromises = headphone.uploadedFilesIds.map(
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

		// find all reviews associated with the headphones
		const reviewsArrArr = await Promise.all(
			headphones.map(async (headphone) => {
				const reviewPromises = headphone.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create headphoneServerResponse array
		const headphoneServerResponseArray = headphones.map((headphone, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...headphone,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved headphones",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: headphoneServerResponseArray,
		});
	},
);

// @desc   Get headphone by id
// @route  GET /api/v1/product-category/headphone/:headphoneId
// @access Private/Admin/Manager
const getHeadphoneByIdHandler = expressAsyncHandler(
	async (
		request: GetHeadphoneByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				HeadphoneDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const headphoneId = request.params.headphoneId;

		// get headphone by id
		const headphone = await getHeadphoneByIdService(headphoneId);
		if (!headphone) {
			response
				.status(404)
				.json({ message: "Headphone not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the headphone
		const fileUploads = await Promise.all(
			headphone.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the headphone
		const productReviews = await Promise.all(
			headphone.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create headphoneServerResponse
		const headphoneServerResponse = {
			...headphone,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved headphone",
			resourceData: [headphoneServerResponse],
		});
	},
);

// @desc   Update a headphone by id
// @route  PUT /api/v1/product-category/headphone/:headphoneId
// @access Private/Admin/Manager
const updateHeadphoneByIdHandler = expressAsyncHandler(
	async (
		request: UpdateHeadphoneByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				HeadphoneDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { headphoneId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update headphone
		const updatedHeadphone = await updateHeadphoneByIdService({
			_id: headphoneId,
			fields,
			updateOperator,
		});

		if (!updatedHeadphone) {
			response.status(400).json({
				message: "Headphone could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the headphone
		const fileUploads = await Promise.all(
			updatedHeadphone.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the headphone
		const productReviews = await Promise.all(
			updatedHeadphone.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create headphoneServerResponse
		const headphoneServerResponse = {
			...updatedHeadphone,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Headphone updated successfully",
			resourceData: [headphoneServerResponse],
		});
	},
);

// @desc   Delete all headphones
// @route  DELETE /api/v1/product-category/headphone
// @access Private/Admin/Manager
const deleteAllHeadphonesHandler = expressAsyncHandler(
	async (
		_request: DeleteAllHeadphonesRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		// grab all headphones file upload ids
		const uploadedFilesIds = await returnAllHeadphonesUploadedFileIdsService();

		// delete all file uploads associated with all headphones
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

		// delete all reviews associated with all headphones
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

		// delete all headphones
		const deleteHeadphonesResult: DeleteResult =
			await deleteAllHeadphonesService();

		if (deleteHeadphonesResult.deletedCount === 0) {
			response.status(400).json({
				message: "All headphones could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All headphones deleted", resourceData: [] });
	},
);

// @desc   Delete a headphone by id
// @route  DELETE /api/v1/product-category/headphone/:headphoneId
// @access Private/Admin/Manager
const deleteAHeadphoneHandler = expressAsyncHandler(
	async (
		request: DeleteAHeadphoneRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const headphoneId = request.params.headphoneId;

		// check if headphone exists
		const headphoneExists = await getHeadphoneByIdService(headphoneId);
		if (!headphoneExists) {
			response
				.status(404)
				.json({ message: "Headphone does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this headphone
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...headphoneExists.uploadedFilesIds];

		// delete all file uploads associated with all headphones
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

		// delete all reviews associated with all headphones
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

		// delete headphone by id
		const deleteHeadphoneResult: DeleteResult =
			await deleteAHeadphoneService(headphoneId);

		if (deleteHeadphoneResult.deletedCount === 0) {
			response.status(400).json({
				message: "Headphone could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "Headphone deleted", resourceData: [] });
	},
);

export {
	createNewHeadphoneBulkHandler,
	createNewHeadphoneHandler,
	deleteAHeadphoneHandler,
	deleteAllHeadphonesHandler,
	getHeadphoneByIdHandler,
	getQueriedHeadphonesHandler,
	updateHeadphoneByIdHandler,
	updateHeadphonesBulkHandler,
};