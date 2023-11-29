import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewStorageBulkHandler,
	createNewStorageHandler,
	deleteAStorageHandler,
	deleteAllStoragesHandler,
	getStorageByIdHandler,
	getQueriedStoragesHandler,
	returnAllFileUploadsForStoragesHandler,
	updateStorageByIdHandler,
} from "./storage.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const storageRouter = Router();

storageRouter.use(verifyRoles());

storageRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedStoragesHandler,
	)
	.post(createNewStorageHandler)
	.delete(deleteAllStoragesHandler);

// DEV ROUTE
storageRouter.route("/dev").post(createNewStorageBulkHandler);

storageRouter
	.route("/fileUploads")
	.post(returnAllFileUploadsForStoragesHandler);

storageRouter
	.route("/:storageId")
	.get(getStorageByIdHandler)
	.delete(deleteAStorageHandler)
	.put(updateStorageByIdHandler);

export { storageRouter };
