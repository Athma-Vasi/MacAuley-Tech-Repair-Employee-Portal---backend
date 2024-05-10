/**
 * This barrel file is used to import/export purchase online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { PurchaseModel } from "./purchase.model";
import { purchaseRouter } from "./purchase.routes";
import {
  updatePurchasesBulkController,
  createNewPurchaseController,
  createNewPurchasesBulkController,
  deleteAllPurchasesController,
  deletePurchaseController,
  getAllPurchasesBulkController,
  getPurchaseByIdController,
  getQueriedPurchasesController,
  getQueriedPurchasesByUserController,
  updatePurchaseByIdController,
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
  updatePurchasesBulkController,
  createNewPurchaseController,
  createNewPurchaseService,
  createNewPurchasesBulkController,
  deleteAPurchaseService,
  deleteAllPurchasesController,
  deleteAllPurchasesService,
  deletePurchaseController,
  getAllPurchasesBulkController,
  getAllPurchasesService,
  getPurchaseByIdController,
  getPurchaseByIdService,
  getQueriedPurchasesByUserService,
  getQueriedPurchasesController,
  getQueriedPurchasesService,
  getQueriedPurchasesByUserController,
  getQueriedTotalPurchasesService,
  purchaseRouter,
  updatePurchaseByIdController,
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
