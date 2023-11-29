import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
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

tabletRouter.use(verifyRoles());

tabletRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedTabletsHandler,
	)
	.post(createNewTabletHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
tabletRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllTabletsHandler);

// DEV ROUTE
tabletRouter
	.route("/dev")
	.post(createNewTabletBulkHandler)
	.patch(updateTabletsBulkHandler);

// single document routes
tabletRouter
	.route("/:tabletId")
	.get(verifyJWTMiddleware, verifyRoles(), getTabletByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteATabletHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateTabletByIdHandler);

export { tabletRouter };
