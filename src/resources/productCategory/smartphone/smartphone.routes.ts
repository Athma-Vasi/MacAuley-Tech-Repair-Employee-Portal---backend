import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewSmartphoneBulkHandler,
	createNewSmartphoneHandler,
	deleteASmartphoneHandler,
	deleteAllSmartphonesHandler,
	getSmartphoneByIdHandler,
	getQueriedSmartphonesHandler,
	updateSmartphoneByIdHandler,
	updateSmartphonesBulkHandler,
} from "./smartphone.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const smartphoneRouter = Router();

smartphoneRouter.use(verifyRoles());

smartphoneRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedSmartphonesHandler,
	)
	.post(createNewSmartphoneHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
smartphoneRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllSmartphonesHandler);

// DEV ROUTE
smartphoneRouter
	.route("/dev")
	.post(createNewSmartphoneBulkHandler)
	.patch(updateSmartphonesBulkHandler);

// single document routes
smartphoneRouter
	.route("/:smartphoneId")
	.get(verifyJWTMiddleware, verifyRoles(), getSmartphoneByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteASmartphoneHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateSmartphoneByIdHandler);

export { smartphoneRouter };
