import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";

import {
	addFieldToPurchaseOnlinesBulkHandler,
	createNewPurchaseOnlineHandler,
	createNewPurchaseOnlinesBulkHandler,
	deletePurchaseOnlineHandler,
	getAllPurchaseOnlinesBulkHandler,
	getPurchaseOnlineByIdHandler,
	getQueriedPurchaseOnlinesHandler,
	getQueriedPurchasesOnlineByUserHandler,
	updatePurchaseOnlineByIdHandler,
} from "./purchaseOnline.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const purchaseOnlineRouter = Router();

purchaseOnlineRouter.use(verifyRoles());

purchaseOnlineRouter
	.route("/")
	.post(createNewPurchaseOnlineHandler)
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedPurchaseOnlinesHandler,
	);

purchaseOnlineRouter
	.route("/user")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedPurchasesOnlineByUserHandler,
	);

// DEV ROUTES
purchaseOnlineRouter
	.route("/dev")
	.post(createNewPurchaseOnlinesBulkHandler)
	.get(getAllPurchaseOnlinesBulkHandler)
	.patch(addFieldToPurchaseOnlinesBulkHandler);

purchaseOnlineRouter
	.route("/:purchaseOnlineId")
	.get(verifyJWTMiddleware, verifyRoles(), getPurchaseOnlineByIdHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updatePurchaseOnlineByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deletePurchaseOnlineHandler);

export { purchaseOnlineRouter };
