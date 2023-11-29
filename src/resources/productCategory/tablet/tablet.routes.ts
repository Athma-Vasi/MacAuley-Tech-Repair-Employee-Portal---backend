import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
import {
	createNewTabletBulkHandler,
	createNewTabletHandler,
	deleteATabletHandler,
	deleteAllTabletsHandler,
	getTabletByIdHandler,
	getQueriedTabletsHandler,
	updateTabletByIdHandler,
	updateTabletsBulkHandler,
} from "./tablet.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const tabletRouter = Router();

tabletRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedTabletsHandler,
	)
	.post(createNewTabletHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
tabletRouter.route("/delete-all").delete(deleteAllTabletsHandler);

// DEV ROUTE
tabletRouter
	.route("/dev")
	.post(createNewTabletBulkHandler)
	.patch(updateTabletsBulkHandler);

// single document routes
tabletRouter
	.route("/:tabletId")
	.get(getTabletByIdHandler)
	.delete(deleteATabletHandler)
	.patch(updateTabletByIdHandler);

export { tabletRouter };
