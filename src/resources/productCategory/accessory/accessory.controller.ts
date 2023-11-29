import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewAccessoryBulkRequest,
	CreateNewAccessoryRequest,
	DeleteAnAccessoryRequest,
	DeleteAllAccessoriesRequest,
	GetAccessoryByIdRequest,
	GetQueriedAccessoriesRequest,
	UpdateAccessoryByIdRequest,
	UpdateAccessoriesBulkRequest,
} from "./accessory.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { AccessoryDocument, AccessorySchema } from "./accessory.model";

import {
	createNewAccessoryService,
	deleteAnAccessoryService,
	deleteAllAccessoriesService,
	getAccessoryByIdService,
	getQueriedAccessoriesService,
	getQueriedTotalAccessoriesService,
	returnAllAccessoriesUploadedFileIdsService,
	updateAccessoryByIdService,
} from "./accessory.service";
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

// @desc   Create new accessory
// @route  POST /api/v1/product-category/accessory
// @access Private/Admin/Manager
const createNewAccessoryHandler = expressAsyncHandler(
	async (
		request: CreateNewAccessoryRequest,
		response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			accessoryFields,
		} = request.body;

		const accessorySchema: AccessorySchema = {
			userId,
			username,
			...accessoryFields,
		};

		const accessoryDocument: AccessoryDocument =
			await createNewAccessoryService(accessorySchema);

		if (!accessoryDocument) {
			response.status(400).json({
				message: "Could not create new accessory",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${accessoryDocument.model} accessory`,
			resourceData: [accessoryDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new accessories bulk
// @route  POST /api/v1/product-category/accessory/dev
// @access Private/Admin/Manager
const createNewAccessoryBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewAccessoryBulkRequest,
		response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
	) => {
		const { accessorySchemas } = request.body;

		const newAccessories = await Promise.all(
			accessorySchemas.map(async (accessorySchema) => {
				const newAccessory = await createNewAccessoryService(accessorySchema);
				return newAccessory;
			}),
		);

		// filter out any accessories that were not created
		const successfullyCreatedAccessories = newAccessories.filter(
			(accessory) => accessory,
		);

		// check if any accessories were created
		if (successfullyCreatedAccessories.length === accessorySchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedAccessories.length} accessories`,
				resourceData: successfullyCreatedAccessories,
			});
			return;
		}

		if (successfullyCreatedAccessories.length === 0) {
			response.status(400).json({
				message: "Could not create any accessories",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				accessorySchemas.length - successfullyCreatedAccessories.length
			} accessories`,
			resourceData: successfullyCreatedAccessories,
		});
		return;
	},
);

// @desc   Update accessories bulk
// @route  PATCH /api/v1/product-category/accessory/dev
// @access Private/Admin/Manager
const updateAccessoriesBulkHandler = expressAsyncHandler(
	async (
		request: UpdateAccessoriesBulkRequest,
		response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
	) => {
		const { accessoryFields } = request.body;

		const updatedAccessories = await Promise.all(
			accessoryFields.map(async (accessoryField) => {
				const {
					accessoryId,
					documentUpdate: { fields, updateOperator },
				} = accessoryField;

				const updatedAccessory = await updateAccessoryByIdService({
					_id: accessoryId,
					fields,
					updateOperator,
				});

				return updatedAccessory;
			}),
		);

		// filter out any accessories that were not updated
		const successfullyUpdatedAccessories = updatedAccessories.filter(
			removeUndefinedAndNullValues,
		);

		// check if any accessories were updated
		if (successfullyUpdatedAccessories.length === accessoryFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedAccessories.length} accessories`,
				resourceData: successfullyUpdatedAccessories,
			});
			return;
		}

		if (successfullyUpdatedAccessories.length === 0) {
			response.status(400).json({
				message: "Could not update any accessories",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				accessoryFields.length - successfullyUpdatedAccessories.length
			} accessories`,
			resourceData: successfullyUpdatedAccessories,
		});
		return;
	},
);

// @desc   Get all accessories
// @route  GET /api/v1/product-category/accessory
// @access Private/Admin/Manager
const getQueriedAccessoriesHandler = expressAsyncHandler(
	async (
		request: GetQueriedAccessoriesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				AccessoryDocument & {
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
			totalDocuments = await getQueriedTotalAccessoriesService({
				filter: filter as FilterQuery<AccessoryDocument> | undefined,
			});
		}

		// get all accessories
		const accessories = await getQueriedAccessoriesService({
			filter: filter as FilterQuery<AccessoryDocument> | undefined,
			projection: projection as QueryOptions<AccessoryDocument>,
			options: options as QueryOptions<AccessoryDocument>,
		});
		if (accessories.length === 0) {
			response.status(200).json({
				message: "No accessories that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the accessories
		const fileUploadsArrArr = await Promise.all(
			accessories.map(async (accessory) => {
				const fileUploadPromises = accessory.uploadedFilesIds.map(
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

		// find all reviews associated with the accessories
		const reviewsArrArr = await Promise.all(
			accessories.map(async (accessory) => {
				const reviewPromises = accessory.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create accessoryServerResponse array
		const accessoryServerResponseArray = accessories.map((accessory, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...accessory,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved accessories",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: accessoryServerResponseArray,
		});
	},
);

// @desc   Get accessory by id
// @route  GET /api/v1/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const getAccessoryByIdHandler = expressAsyncHandler(
	async (
		request: GetAccessoryByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				AccessoryDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const accessoryId = request.params.accessoryId;

		// get accessory by id
		const accessory = await getAccessoryByIdService(accessoryId);
		if (!accessory) {
			response
				.status(404)
				.json({ message: "Accessory not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the accessory
		const fileUploads = await Promise.all(
			accessory.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the accessory
		const productReviews = await Promise.all(
			accessory.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create accessoryServerResponse
		const accessoryServerResponse = {
			...accessory,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved accessory",
			resourceData: [accessoryServerResponse],
		});
	},
);

// @desc   Update a accessory by id
// @route  PUT /api/v1/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const updateAccessoryByIdHandler = expressAsyncHandler(
	async (
		request: UpdateAccessoryByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				AccessoryDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { accessoryId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update accessory
		const updatedAccessory = await updateAccessoryByIdService({
			_id: accessoryId,
			fields,
			updateOperator,
		});

		if (!updatedAccessory) {
			response.status(400).json({
				message: "Accessory could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the accessory
		const fileUploads = await Promise.all(
			updatedAccessory.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the accessory
		const productReviews = await Promise.all(
			updatedAccessory.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create accessoryServerResponse
		const accessoryServerResponse = {
			...updatedAccessory,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Accessory updated successfully",
			resourceData: [accessoryServerResponse],
		});
	},
);

// @desc   Delete all accessories
// @route  DELETE /api/v1/product-category/accessory
// @access Private/Admin/Manager
const deleteAllAccessoriesHandler = expressAsyncHandler(
	async (
		_request: DeleteAllAccessoriesRequest,
		response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
	) => {
		// grab all accessories file upload ids
		const uploadedFilesIds = await returnAllAccessoriesUploadedFileIdsService();

		// delete all file uploads associated with all accessories
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

		// delete all reviews associated with all accessories
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

		// delete all accessories
		const deleteAccessoriesResult: DeleteResult =
			await deleteAllAccessoriesService();

		if (deleteAccessoriesResult.deletedCount === 0) {
			response.status(400).json({
				message: "All accessories could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All accessories deleted", resourceData: [] });
	},
);

// @desc   Delete a accessory by id
// @route  DELETE /api/v1/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const deleteAAccessoryHandler = expressAsyncHandler(
	async (
		request: DeleteAnAccessoryRequest,
		response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
	) => {
		const accessoryId = request.params.accessoryId;

		// check if accessory exists
		const accessoryExists = await getAccessoryByIdService(accessoryId);
		if (!accessoryExists) {
			response
				.status(404)
				.json({ message: "Accessory does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this accessory
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...accessoryExists.uploadedFilesIds];

		// delete all file uploads associated with all accessories
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

		// delete all reviews associated with all accessories
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

		// delete accessory by id
		const deleteAccessoryResult: DeleteResult =
			await deleteAnAccessoryService(accessoryId);

		if (deleteAccessoryResult.deletedCount === 0) {
			response.status(400).json({
				message: "Accessory could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "Accessory deleted", resourceData: [] });
	},
);

export {
	createNewAccessoryBulkHandler,
	createNewAccessoryHandler,
	deleteAAccessoryHandler,
	deleteAllAccessoriesHandler,
	getAccessoryByIdHandler,
	getQueriedAccessoriesHandler,
	updateAccessoryByIdHandler,
	updateAccessoriesBulkHandler,
};
