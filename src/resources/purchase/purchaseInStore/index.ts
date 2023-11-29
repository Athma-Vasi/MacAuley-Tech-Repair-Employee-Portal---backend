/**
 * This barrel file is used to import/export purchase online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { PurchaseInStoreModel } from "./purchaseInStore.model";
import { purchaseInStoreRouter } from "./purchaseInStore.routes";
import {
	updatePurchaseInStoresBulkHandler,
	createNewPurchaseInStoreHandler,
	createNewPurchaseInStoresBulkHandler,
	deleteAllPurchaseInStoresHandler,
	deletePurchaseInStoreHandler,
	getAllPurchaseInStoresBulkHandler,
	getPurchaseInStoreByIdHandler,
	getQueriedPurchaseInStoresHandler,
	getQueriedPurchasesInStoreByUserHandler,
	updatePurchaseInStoreByIdHandler,
} from "./purchaseInStore.controller";
import {
	createNewPurchaseInStoreService,
	deleteAPurchaseInStoreService,
	deleteAllPurchaseInStoresService,
	getAllPurchaseInStoresService,
	getPurchaseInStoreByIdService,
	getQueriedPurchaseInStoresByUserService,
	getQueriedPurchaseInStoresService,
	getQueriedTotalPurchaseInStoresService,
	updatePurchaseInStoreByIdService,
} from "./purchaseInStore.service";

import type {
	PurchaseInStoreDocument,
	PurchaseInStoreSchema,
} from "./purchaseInStore.model";
import type {
	CreateNewPurchaseInStoreRequest,
	CreateNewPurchaseInStoresBulkRequest,
	DeleteAPurchaseInStoreRequest,
	DeleteAllPurchaseInStoresRequest,
	GetAllPurchaseInStoresBulkRequest,
	GetPurchaseInStoreByIdRequest,
	GetQueriedPurchaseInStoresByUserRequest,
	GetQueriedPurchaseInStoresRequest,
	UpdatePurchaseInStoreByIdRequest,
	UpdatePurchaseInStoresBulkRequest,
} from "./purchaseInStore.types";

/**
 * Exports
 */

export {
	PurchaseInStoreModel,
	updatePurchaseInStoresBulkHandler,
	createNewPurchaseInStoreHandler,
	createNewPurchaseInStoreService,
	createNewPurchaseInStoresBulkHandler,
	deleteAPurchaseInStoreService,
	deleteAllPurchaseInStoresHandler,
	deleteAllPurchaseInStoresService,
	deletePurchaseInStoreHandler,
	getAllPurchaseInStoresBulkHandler,
	getAllPurchaseInStoresService,
	getPurchaseInStoreByIdHandler,
	getPurchaseInStoreByIdService,
	getQueriedPurchaseInStoresByUserService,
	getQueriedPurchaseInStoresHandler,
	getQueriedPurchaseInStoresService,
	getQueriedPurchasesInStoreByUserHandler,
	getQueriedTotalPurchaseInStoresService,
	purchaseInStoreRouter,
	updatePurchaseInStoreByIdHandler,
	updatePurchaseInStoreByIdService,
};

export type {
	CreateNewPurchaseInStoreRequest,
	CreateNewPurchaseInStoresBulkRequest,
	DeleteAPurchaseInStoreRequest,
	DeleteAllPurchaseInStoresRequest,
	GetAllPurchaseInStoresBulkRequest,
	GetPurchaseInStoreByIdRequest,
	GetQueriedPurchaseInStoresByUserRequest,
	GetQueriedPurchaseInStoresRequest,
	PurchaseInStoreDocument,
	PurchaseInStoreSchema,
	UpdatePurchaseInStoreByIdRequest,
	UpdatePurchaseInStoresBulkRequest,
};
