/**
 * This barrel file is used to import/export storage router, model, types, controllers and services
 */

/**
 * Imports
 */
import { storageRouter } from "./storage.routes";
import { StorageModel } from "./storage.model";

import {
  createNewStorageBulkController,
  createNewStorageController,
  deleteAStorageController,
  deleteAllStoragesController,
  getStorageByIdController,
  getQueriedStoragesController,
  updateStorageByIdController,
  updateStoragesBulkController,
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
  createNewStorageBulkController,
  createNewStorageController,
  createNewStorageService,
  deleteAStorageController,
  deleteAStorageService,
  deleteAllStoragesController,
  deleteAllStoragesService,
  getStorageByIdController,
  getStorageByIdService,
  getQueriedStoragesController,
  getQueriedStoragesService,
  getQueriedTotalStoragesService,
  returnAllStoragesUploadedFileIdsService,
  updateStorageByIdController,
  updateStorageByIdService,
  updateStoragesBulkController,
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
