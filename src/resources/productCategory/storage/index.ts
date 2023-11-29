/**
 * This barrel file is used to import/export storage router, model, types, controllers and services
 */

/**
 * Imports
 */
import { storageRouter } from './storage.routes';
import { StorageModel } from './storage.model';

import {
  createNewStorageBulkHandler,
  createNewStorageHandler,
  deleteAStorageHandler,
  deleteAllStoragesHandler,
  getStorageByIdHandler,
  getQueriedStoragesHandler,
  returnAllFileUploadsForStoragesHandler,
  updateStorageByIdHandler,
} from './storage.controller';

import {
  createNewStorageService,
  deleteAllStoragesService,
  deleteAStorageService,
  getStorageByIdService,
  getQueriedStoragesService,
  getQueriedTotalStoragesService,
  returnAllStoragesUploadedFileIdsService,
  updateStorageByIdService,
} from './storage.service';

import type { StorageDocument, StorageSchema } from './storage.model';
import type {
  CreateNewStorageBulkRequest,
  CreateNewStorageRequest,
  DeleteAStorageRequest,
  DeleteAllStoragesRequest,
  GetStorageByIdRequest,
  GetQueriedStoragesRequest,
  UpdateStorageByIdRequest,
} from './storage.types';

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
  deleteAllStoragesHandler,
  deleteAllStoragesService,
  deleteAStorageService,
  getStorageByIdHandler,
  getStorageByIdService,
  getQueriedStoragesHandler,
  getQueriedStoragesService,
  getQueriedTotalStoragesService,
  returnAllStoragesUploadedFileIdsService,
  returnAllFileUploadsForStoragesHandler,
  updateStorageByIdHandler,
  updateStorageByIdService,
};

export type {
  CreateNewStorageBulkRequest,
  CreateNewStorageRequest,
  DeleteAStorageRequest,
  DeleteAllStoragesRequest,
  GetStorageByIdRequest,
  GetQueriedStoragesRequest,
  StorageDocument,
  StorageSchema,
  UpdateStorageByIdRequest,
};
