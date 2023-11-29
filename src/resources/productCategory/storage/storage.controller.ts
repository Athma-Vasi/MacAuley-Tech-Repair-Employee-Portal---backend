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
import { ProductServerResponse } from "../product.types";

// @desc   Create new storage
// @route  POST /api/v1/actions/dashboard/product-category/storage
// @access Private/Admin/Manager
const createNewStorageHandler = expressAsyncHandler(
	async (
		request: CreateNewStorageRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			storageFields,
		} = request.body;

		const storageSchema: StorageSchema = {
			userId,
			username,
			...storageFields,
		};

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
// @route  POST /api/v1/actions/dashboard/product-category/storage/dev
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
		} else if (successfullyCreatedStorages.length === 0) {
			response.status(400).json({
				message: "Could not create any storages",
				resourceData: [],
			});
			return;
		} else {
			response.status(201).json({
				message: `Successfully created ${
					storageSchemas.length - successfullyCreatedStorages.length
				} storages`,
				resourceData: successfullyCreatedStorages,
			});
			return;
		}
	},
);

// @desc   Get all storages
// @route  GET /api/v1/actions/dashboard/product-category/storage
// @access Private/Admin/Manager
const getQueriedStoragesHandler = expressAsyncHandler(
	async (
		request: GetQueriedStoragesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<StorageDocument>
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

		// find all fileUploads associated with the storages (in parallel)
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
				return fileUploads.filter((fileUpload) => fileUpload);
			}),
		);

		// create storageServerResponse array
		const storageServerResponseArray = storages
			.map((storage, index) => {
				const fileUploads = fileUploadsArrArr[index];
				return {
					...storage,
					fileUploads,
				};
			})
			.filter((storage) => storage);

		response.status(200).json({
			message: "Successfully retrieved storages",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: storageServerResponseArray as StorageDocument[],
		});
	},
);

// @desc   Get storage by id
// @route  GET /api/v1/actions/dashboard/product-category/storage/:storageId
// @access Private/Admin/Manager
const getStorageByIdHandler = expressAsyncHandler(
	async (
		request: GetStorageByIdRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
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
		const fileUploadsArr = await Promise.all(
			storage.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload as FileUploadDocument;
			}),
		);

		// create storageServerResponse
		const storageServerResponse: ProductServerResponse<StorageDocument> = {
			...storage,
			fileUploads: fileUploadsArr.filter(
				(fileUpload) => fileUpload,
			) as FileUploadDocument[],
		};

		response.status(200).json({
			message: "Successfully retrieved storage",
			resourceData: [storageServerResponse],
		});
	},
);

// @desc   Update a storage by id
// @route  PUT /api/v1/actions/dashboard/product-category/storage/:storageId
// @access Private/Admin/Manager
const updateStorageByIdHandler = expressAsyncHandler(
	async (
		request: UpdateStorageByIdRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		const { storageId } = request.params;
		const { storageFields } = request.body;

		// check if storage exists
		const storageExists = await getStorageByIdService(storageId);
		if (!storageExists) {
			response
				.status(404)
				.json({ message: "Storage does not exist", resourceData: [] });
			return;
		}

		const newStorage = {
			...storageExists,
			...storageFields,
		};

		// update storage
		const updatedStorage = await updateStorageByIdService({
			storageId,
			fieldsToUpdate: newStorage,
		});

		if (!updatedStorage) {
			response.status(400).json({
				message: "Storage could not be updated",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Storage updated successfully",
			resourceData: [updatedStorage],
		});
	},
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/storage/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForStoragesHandler = expressAsyncHandler(
	async (
		_request: GetStorageByIdRequest,
		response: Response<ResourceRequestServerResponse<FileUploadDocument>>,
	) => {
		const fileUploadsIds = await returnAllStoragesUploadedFileIdsService();

		if (fileUploadsIds.length === 0) {
			response
				.status(404)
				.json({ message: "No file uploads found", resourceData: [] });
			return;
		}

		const fileUploads = (await Promise.all(
			fileUploadsIds.map(async (fileUploadId) => {
				const fileUpload = await getFileUploadByIdService(fileUploadId);

				return fileUpload;
			}),
		)) as FileUploadDocument[];

		// filter out any undefined values (in case fileUpload was not found)
		const filteredFileUploads = fileUploads.filter((fileUpload) => fileUpload);

		if (filteredFileUploads.length !== fileUploadsIds.length) {
			response.status(404).json({
				message: "Some file uploads could not be found.",
				resourceData: filteredFileUploads,
			});
			return;
		}

		response.status(200).json({
			message: "Successfully retrieved file uploads",
			resourceData: filteredFileUploads,
		});
	},
);

// @desc   Delete all storages
// @route  DELETE /api/v1/actions/dashboard/product-category/storage
// @access Private/Admin/Manager
const deleteAllStoragesHandler = expressAsyncHandler(
	async (
		_request: DeleteAllStoragesRequest,
		response: Response<ResourceRequestServerResponse<StorageDocument>>,
	) => {
		// grab all storages file upload ids
		const fileUploadsIds = await returnAllStoragesUploadedFileIdsService();

		// delete all file uploads associated with all storages
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			fileUploadsIds.map(async (fileUploadId) =>
				deleteFileUploadByIdService(fileUploadId),
			),
		);
		if (!deleteFileUploadsResult.every((result) => result.deletedCount !== 0)) {
			response.status(400).json({
				message: "Some file uploads could not be deleted. Please try again.",
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
// @route  DELETE /api/v1/actions/dashboard/product-category/storage/:storageId
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

		// delete all file uploads associated with this storage
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			uploadedFilesIds.map(async (uploadedFileId) =>
				deleteFileUploadByIdService(uploadedFileId),
			),
		);

		if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
			response.status(400).json({
				message:
					"Some file uploads associated with this storage could not be deleted. Storage not deleted. Please try again.",
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
	returnAllFileUploadsForStoragesHandler,
	updateStorageByIdHandler,
};
