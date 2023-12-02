/**
 * This barrel file is used to import/export purchase online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { PurchaseModel } from "./purchase.model";
import { purchaseRouter } from "./purchase.routes";
import {
  updatePurchasesBulkHandler,
  createNewPurchaseHandler,
  createNewPurchasesBulkHandler,
  deleteAllPurchasesHandler,
  deletePurchaseHandler,
  getAllPurchasesBulkHandler,
  getPurchaseByIdHandler,
  getQueriedPurchasesHandler,
  getQueriedPurchasesByUserHandler,
  updatePurchaseByIdHandler,
} from "./purchase.controller";
import {
  createNewPurchaseService,
  deleteAPurchaseService,
  deleteAllPurchasesService,
  getAllPurchasesService,
  getPurchaseByIdService,
  getQueriedPurchasesByUserService,
  getQueriedPurchasesService,
  getQueriedTotalPurchasesService,
  updatePurchaseByIdService,
} from "./purchase.service";

import type { PurchaseDocument, PurchaseSchema } from "./purchase.model";
import type {
  CreateNewPurchaseRequest,
  CreateNewPurchasesBulkRequest,
  DeleteAPurchaseRequest,
  DeleteAllPurchasesRequest,
  GetAllPurchasesBulkRequest,
  GetPurchaseByIdRequest,
  GetQueriedPurchasesByUserRequest,
  GetQueriedPurchasesRequest,
  UpdatePurchaseByIdRequest,
  UpdatePurchasesBulkRequest,
} from "./purchase.types";

/**
 * Exports
 */

export {
  PurchaseModel,
  updatePurchasesBulkHandler,
  createNewPurchaseHandler,
  createNewPurchaseService,
  createNewPurchasesBulkHandler,
  deleteAPurchaseService,
  deleteAllPurchasesHandler,
  deleteAllPurchasesService,
  deletePurchaseHandler,
  getAllPurchasesBulkHandler,
  getAllPurchasesService,
  getPurchaseByIdHandler,
  getPurchaseByIdService,
  getQueriedPurchasesByUserService,
  getQueriedPurchasesHandler,
  getQueriedPurchasesService,
  getQueriedPurchasesByUserHandler,
  getQueriedTotalPurchasesService,
  purchaseRouter,
  updatePurchaseByIdHandler,
  updatePurchaseByIdService,
};

export type {
  CreateNewPurchaseRequest,
  CreateNewPurchasesBulkRequest,
  DeleteAPurchaseRequest,
  DeleteAllPurchasesRequest,
  GetAllPurchasesBulkRequest,
  GetPurchaseByIdRequest,
  GetQueriedPurchasesByUserRequest,
  GetQueriedPurchasesRequest,
  PurchaseDocument,
  PurchaseSchema,
  UpdatePurchaseByIdRequest,
  UpdatePurchasesBulkRequest,
};
