import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewStorageBulkRequest,
	CreateNewStorageRequest,
	DeleteAStorageRequest,
	DeleteAllStoragesRequest,
	GetStorageByIdRequest,
	GetQueriedStoragesRequest,
	UpdateStorageByIdRequest,
	UpdateStoragesBulkRequest,
} from "./storage.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { StorageDocument, StorageSchema } from "./storage.model";

import {
	createNewStorageService,
	deleteAStorageService,
	deleteAllStoragesService,
	getStorageByIdService,
	getQueriedStoragesService,
	getQueriedTotalStoragesService,
	returnAllStoragesUploadedFileIdsService,
	updateStorageByIdService,
} from "./storage.service";
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

// @desc   Create new storage
// @route  POST /api/v1/product-category/storage
// @access Private/Admin/Manager
const createNewStorageHandler = expressAsyncHandler(
	async (
		request: CreateNewStorageRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		const { storageSchema } = request.body;

		const storageDocument: StorageDocument =
			await createNewStorageService(storageSchema);

		if (!storageDocument) {
			response.status(400).json({
				message: "Could not create new storage",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${storageDocument.model} storage`,
			resourceData: [storageDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new storages bulk
// @route  POST /api/v1/product-category/storage/dev
// @access Private/Admin/Manager
const createNewStorageBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewStorageBulkRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		const { storageSchemas } = request.body;

		const newStorages = await Promise.all(
			storageSchemas.map(async (storageSchema) => {
				const newStorage = await createNewStorageService(storageSchema);
				return newStorage;
			}),
		);

		// filter out any storages that were not created
		const successfullyCreatedStorages = newStorages.filter(
			(storage) => storage,
		);

		// check if any storages were created
		if (successfullyCreatedStorages.length === storageSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedStorages.length} storages`,
				resourceData: successfullyCreatedStorages,
			});
			return;
		}

		if (successfullyCreatedStorages.length === 0) {
			response.status(400).json({
				message: "Could not create any storages",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				storageSchemas.length - successfullyCreatedStorages.length
			} storages`,
			resourceData: successfullyCreatedStorages,
		});
		return;
	},
);

// @desc   Update storages bulk
// @route  PATCH /api/v1/product-category/storage/dev
// @access Private/Admin/Manager
const updateStoragesBulkHandler = expressAsyncHandler(
	async (
		request: UpdateStoragesBulkRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		const { storageFields } = request.body;

		const updatedStorages = await Promise.all(
			storageFields.map(async (storageField) => {
				const {
					documentId,
					documentUpdate: { fields, updateOperator },
				} = storageField;

				const updatedStorage = await updateStorageByIdService({
					_id: documentId,
					fields,
					updateOperator,
				});

				return updatedStorage;
			}),
		);

		// filter out any storages that were not updated
		const successfullyUpdatedStorages = updatedStorages.filter(
			removeUndefinedAndNullValues,
		);

		// check if any storages were updated
		if (successfullyUpdatedStorages.length === storageFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedStorages.length} storages`,
				resourceData: successfullyUpdatedStorages,
			});
			return;
		}

		if (successfullyUpdatedStorages.length === 0) {
			response.status(400).json({
				message: "Could not update any storages",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				storageFields.length - successfullyUpdatedStorages.length
			} storages`,
			resourceData: successfullyUpdatedStorages,
		});
		return;
	},
);

// @desc   Get all storages
// @route  GET /api/v1/product-category/storage
// @access Private/Admin/Manager
const getQueriedStoragesHandler = expressAsyncHandler(
	async (
		request: GetQueriedStoragesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				StorageDocument & {
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
			totalDocuments = await getQueriedTotalStoragesService({
				filter: filter as FilterQuery<StorageDocument> | undefined,
			});
		}

		// get all storages
		const storages = await getQueriedStoragesService({
			filter: filter as FilterQuery<StorageDocument> | undefined,
			projection: projection as QueryOptions<StorageDocument>,
			options: options as QueryOptions<StorageDocument>,
		});
		if (storages.length === 0) {
			response.status(200).json({
				message: "No storages that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the storages
		const fileUploadsArrArr = await Promise.all(
			storages.map(async (storage) => {
				const fileUploadPromises = storage.uploadedFilesIds.map(
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

		// find all reviews associated with the storages
		const reviewsArrArr = await Promise.all(
			storages.map(async (storage) => {
				const reviewPromises = storage.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create storageServerResponse array
		const storageServerResponseArray = storages.map((storage, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...storage,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved storages",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: storageServerResponseArray,
		});
	},
);

// @desc   Get storage by id
// @route  GET /api/v1/product-category/storage/:storageId
// @access Private/Admin/Manager
const getStorageByIdHandler = expressAsyncHandler(
	async (
		request: GetStorageByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				StorageDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const storageId = request.params.storageId;

		// get storage by id
		const storage = await getStorageByIdService(storageId);
		if (!storage) {
			response
				.status(404)
				.json({ message: "Storage not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the storage
		const fileUploads = await Promise.all(
			storage.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the storage
		const productReviews = await Promise.all(
			storage.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create storageServerResponse
		const storageServerResponse = {
			...storage,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved storage",
			resourceData: [storageServerResponse],
		});
	},
);

// @desc   Update a storage by id
// @route  PUT /api/v1/product-category/storage/:storageId
// @access Private/Admin/Manager
const updateStorageByIdHandler = expressAsyncHandler(
	async (
		request: UpdateStorageByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				StorageDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { storageId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update storage
		const updatedStorage = await updateStorageByIdService({
			_id: storageId,
			fields,
			updateOperator,
		});

		if (!updatedStorage) {
			response.status(400).json({
				message: "Storage could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the storage
		const fileUploads = await Promise.all(
			updatedStorage.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the storage
		const productReviews = await Promise.all(
			updatedStorage.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create storageServerResponse
		const storageServerResponse = {
			...updatedStorage,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Storage updated successfully",
			resourceData: [storageServerResponse],
		});
	},
);

// @desc   Delete all storages
// @route  DELETE /api/v1/product-category/storage
// @access Private/Admin/Manager
const deleteAllStoragesHandler = expressAsyncHandler(
	async (
		_request: DeleteAllStoragesRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		// grab all storages file upload ids
		const uploadedFilesIds = await returnAllStoragesUploadedFileIdsService();

		// delete all file uploads associated with all storages
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

		// delete all reviews associated with all storages
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

		// delete all storages
		const deleteStoragesResult: DeleteResult = await deleteAllStoragesService();

		if (deleteStoragesResult.deletedCount === 0) {
			response.status(400).json({
				message: "All storages could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All storages deleted", resourceData: [] });
	},
);

// @desc   Delete a storage by id
// @route  DELETE /api/v1/product-category/storage/:storageId
// @access Private/Admin/Manager
const deleteAStorageHandler = expressAsyncHandler(
	async (
		request: DeleteAStorageRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		const storageId = request.params.storageId;

		// check if storage exists
		const storageExists = await getStorageByIdService(storageId);
		if (!storageExists) {
			response
				.status(404)
				.json({ message: "Storage does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this storage
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...storageExists.uploadedFilesIds];

		// delete all file uploads associated with all storages
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

		// delete all reviews associated with all storages
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

		// delete storage by id
		const deleteStorageResult: DeleteResult =
			await deleteAStorageService(storageId);

		if (deleteStorageResult.deletedCount === 0) {
			response.status(400).json({
				message: "Storage could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Storage deleted", resourceData: [] });
	},
);

export {
	createNewStorageBulkHandler,
	createNewStorageHandler,
	deleteAStorageHandler,
	deleteAllStoragesHandler,
	getStorageByIdHandler,
	getQueriedStoragesHandler,
	updateStorageByIdHandler,
	updateStoragesBulkHandler,
};
