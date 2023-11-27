/**
 * This barrel file is used to import/export purchase in-store: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { PurchaseInStoreModel } from './purchaseInStore.model';
import { purchaseInStoreRouter } from './purchaseInStore.routes';
import {
  addFieldToPurchaseInStoresBulkHandler,
  createNewPurchaseInStoreHandler,
  createNewPurchaseInStoresBulkHandler,
  deletePurchaseInStoreHandler,
  getAllPurchaseInStoresBulkHandler,
  getPurchaseInStoreByIdHandler,
  getQueriedPurchaseInStoresHandler,
  getQueriedPurchasesInStoreByUserHandler,
  updatePurchaseInStoreByIdHandler,
} from './purchaseInStore.controller';
import {
  createNewPurchaseInStoreService,
  deleteAPurchaseInStoreService,
  deleteAllPurchaseInStoresService,
  getAllPurchasesInStoreService,
  getPurchaseInStoreByIdService,
  getQueriedPurchaseInStoresByUserService,
  getQueriedPurchaseInStoresService,
  getQueriedTotalPurchaseInStoresService,
  updatePurchaseInStoreByIdService,
} from './purchaseInStore.service';

import type { PurchaseInStoreDocument, PurchaseInStoreSchema } from './purchaseInStore.model';
import type {
  AddFieldsToPurchaseInStoresBulkRequest,
  CreateNewPurchaseInStoreRequest,
  CreateNewPurchaseInStoresBulkRequest,
  DeletePurchaseInStoreRequest,
  GetAllPurchaseInStoresBulkRequest,
  GetAllPurchaseInStoresRequest,
  GetPurchaseInStoreByIdRequest,
  GetQueriedPurchasesInStoreByUserRequest,
  UpdatePurchaseInStoreRequest,
} from './purchaseInStore.types';

/**
 * Exports
 */

export {
  PurchaseInStoreModel,
  purchaseInStoreRouter,
  addFieldToPurchaseInStoresBulkHandler,
  createNewPurchaseInStoreHandler,
  createNewPurchaseInStoresBulkHandler,
  deletePurchaseInStoreHandler,
  getAllPurchaseInStoresBulkHandler,
  getPurchaseInStoreByIdHandler,
  getQueriedPurchaseInStoresHandler,
  getQueriedPurchasesInStoreByUserHandler,
  updatePurchaseInStoreByIdHandler,
  createNewPurchaseInStoreService,
  deleteAPurchaseInStoreService,
  deleteAllPurchaseInStoresService,
  getAllPurchasesInStoreService,
  getPurchaseInStoreByIdService,
  getQueriedPurchaseInStoresByUserService,
  getQueriedPurchaseInStoresService,
  getQueriedTotalPurchaseInStoresService,
  updatePurchaseInStoreByIdService,
};

export type {
  PurchaseInStoreDocument,
  PurchaseInStoreSchema,
  AddFieldsToPurchaseInStoresBulkRequest,
  CreateNewPurchaseInStoreRequest,
  CreateNewPurchaseInStoresBulkRequest,
  DeletePurchaseInStoreRequest,
  GetAllPurchaseInStoresBulkRequest,
  GetAllPurchaseInStoresRequest,
  GetPurchaseInStoreByIdRequest,
  GetQueriedPurchasesInStoreByUserRequest,
  UpdatePurchaseInStoreRequest,
};
