import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewHeadphoneBulkHandler,
	createNewHeadphoneHandler,
	deleteAHeadphoneHandler,
	deleteAllHeadphonesHandler,
	getHeadphoneByIdHandler,
	getQueriedHeadphonesHandler,
	updateHeadphoneByIdHandler,
	updateHeadphonesBulkHandler,
} from "./headphone.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const headphoneRouter = Router();

headphoneRouter.use(verifyRoles());

headphoneRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedHeadphonesHandler,
	)
	.post(createNewHeadphoneHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
headphoneRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllHeadphonesHandler);

// DEV ROUTE
headphoneRouter
	.route("/dev")
	.post(createNewHeadphoneBulkHandler)
	.patch(updateHeadphonesBulkHandler);

// single document routes
headphoneRouter
	.route("/:headphoneId")
	.get(verifyJWTMiddleware, verifyRoles(), getHeadphoneByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAHeadphoneHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateHeadphoneByIdHandler);

export { headphoneRouter };
