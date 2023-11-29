import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";

import {
	updatePurchaseInStoresBulkHandler,
	createNewPurchaseInStoreHandler,
	createNewPurchaseInStoresBulkHandler,
	deleteAllPurchaseInStoresHandler,
	deletePurchaseInStoreHandler,
	getAllPurchaseInStoresBulkHandler,
	getPurchaseInStoreByIdHandler,
	getQueriedPurchaseInStoresHandler,
	getQueriedPurchasesOnlineByUserHandler,
	updatePurchaseInStoreByIdHandler,
} from "./purchaseInStore.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const purchaseInStoreRouter = Router();

purchaseInStoreRouter.use(verifyJWTMiddleware, verifyRoles());

purchaseInStoreRouter
	.route("/")
	.post(createNewPurchaseInStoreHandler)
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedPurchaseInStoresHandler,
	);

purchaseInStoreRouter
	.route("/user")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedPurchasesOnlineByUserHandler,
	);

purchaseInStoreRouter
	.route("/delete-all")
	.delete(deleteAllPurchaseInStoresHandler);

// DEV ROUTES
purchaseInStoreRouter
	.route("/dev")
	.post(createNewPurchaseInStoresBulkHandler)
	.get(getAllPurchaseInStoresBulkHandler)
	.patch(updatePurchaseInStoresBulkHandler);

purchaseInStoreRouter
	.route("/:purchaseInStoreId")
	.get(getPurchaseInStoreByIdHandler)
	.patch(updatePurchaseInStoreByIdHandler)
	.delete(deletePurchaseInStoreHandler);

export { purchaseInStoreRouter };
