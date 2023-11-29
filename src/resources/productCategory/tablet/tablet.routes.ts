import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewTabletBulkHandler,
	createNewTabletHandler,
	deleteATabletHandler,
	deleteAllTabletsHandler,
	getTabletByIdHandler,
	getQueriedTabletsHandler,
	returnAllFileUploadsForTabletsHandler,
	updateTabletByIdHandler,
} from "./tablet.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const tabletRouter = Router();

tabletRouter.use(verifyRoles());

tabletRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedTabletsHandler,
	)
	.post(createNewTabletHandler)
	.delete(deleteAllTabletsHandler);

// DEV ROUTE
tabletRouter.route("/dev").post(createNewTabletBulkHandler);

tabletRouter.route("/fileUploads").post(returnAllFileUploadsForTabletsHandler);

tabletRouter
	.route("/:tabletId")
	.get(getTabletByIdHandler)
	.delete(deleteATabletHandler)
	.put(updateTabletByIdHandler);

export { tabletRouter };
