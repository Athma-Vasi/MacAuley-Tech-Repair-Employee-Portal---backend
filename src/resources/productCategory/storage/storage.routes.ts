import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewStorageBulkHandler,
	createNewStorageHandler,
	deleteAStorageHandler,
	deleteAllStoragesHandler,
	getStorageByIdHandler,
	getQueriedStoragesHandler,
	updateStorageByIdHandler,
	updateStoragesBulkHandler,
} from "./storage.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const storageRouter = Router();

storageRouter.use(verifyRoles());

storageRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedStoragesHandler,
	)
	.post(createNewStorageHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
storageRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllStoragesHandler);

// DEV ROUTE
storageRouter
	.route("/dev")
	.post(createNewStorageBulkHandler)
	.patch(updateStoragesBulkHandler);

// single document routes
storageRouter
	.route("/:storageId")
	.get(verifyJWTMiddleware, verifyRoles(), getStorageByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAStorageHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateStorageByIdHandler);

export { storageRouter };
