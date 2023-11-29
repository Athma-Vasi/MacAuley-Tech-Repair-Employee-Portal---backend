/**
 * This barrel file is used to import/export storage router, model, types, controllers and services
 */

/**
 * Imports
 */
import { storageRouter } from "./storage.routes";
import { StorageModel } from "./storage.model";

import {
	createNewStorageBulkHandler,
	createNewStorageHandler,
	deleteAStorageHandler,
	deleteAllStoragesHandler,
	getStorageByIdHandler,
	getQueriedStoragesHandler,
	updateStorageByIdHandler,
	updateStoragesBulkHandler,
} from "./storage.controller";

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

import type { StorageDocument, StorageSchema } from "./storage.model";
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

/**
 * Exports
 */

export {
	StorageModel,
	storageRouter,
	createNewStorageBulkHandler,
	createNewStorageHandler,
	createNewStorageService,
	deleteAStorageHandler,
	deleteAStorageService,
	deleteAllStoragesHandler,
	deleteAllStoragesService,
	getStorageByIdHandler,
	getStorageByIdService,
	getQueriedStoragesHandler,
	getQueriedStoragesService,
	getQueriedTotalStoragesService,
	returnAllStoragesUploadedFileIdsService,
	updateStorageByIdHandler,
	updateStorageByIdService,
	updateStoragesBulkHandler,
};

export type {
	StorageDocument,
	StorageSchema,
	CreateNewStorageBulkRequest,
	CreateNewStorageRequest,
	DeleteAStorageRequest,
	DeleteAllStoragesRequest,
	GetStorageByIdRequest,
	GetQueriedStoragesRequest,
	UpdateStorageByIdRequest,
	UpdateStoragesBulkRequest,
};
