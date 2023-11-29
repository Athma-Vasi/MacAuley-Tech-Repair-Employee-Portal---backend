import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";

import {
	updatePurchaseOnlinesBulkHandler,
	createNewPurchaseOnlineHandler,
	createNewPurchaseOnlinesBulkHandler,
	deleteAllPurchaseOnlinesHandler,
	deletePurchaseOnlineHandler,
	getAllPurchaseOnlinesBulkHandler,
	getPurchaseOnlineByIdHandler,
	getQueriedPurchaseOnlinesHandler,
	getQueriedPurchasesOnlineByUserHandler,
	updatePurchaseOnlineByIdHandler,
} from "./purchaseOnline.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const purchaseOnlineRouter = Router();

purchaseOnlineRouter.use(verifyJWTMiddleware, verifyRoles());

purchaseOnlineRouter
	.route("/")
	.post(createNewPurchaseOnlineHandler)
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedPurchaseOnlinesHandler,
	);

purchaseOnlineRouter
	.route("/user")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedPurchasesOnlineByUserHandler,
	);

purchaseOnlineRouter
	.route("/delete-all")
	.delete(deleteAllPurchaseOnlinesHandler);

// DEV ROUTES
purchaseOnlineRouter
	.route("/dev")
	.post(createNewPurchaseOnlinesBulkHandler)
	.get(getAllPurchaseOnlinesBulkHandler)
	.patch(updatePurchaseOnlinesBulkHandler);

purchaseOnlineRouter
	.route("/:purchaseOnlineId")
	.get(getPurchaseOnlineByIdHandler)
	.patch(updatePurchaseOnlineByIdHandler)
	.delete(deletePurchaseOnlineHandler);

export { purchaseOnlineRouter };
