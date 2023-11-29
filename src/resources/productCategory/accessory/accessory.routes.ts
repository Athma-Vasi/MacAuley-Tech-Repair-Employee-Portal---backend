import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewAccessoryBulkHandler,
	createNewAccessoryHandler,
	deleteAAccessoryHandler,
	deleteAllAccessoriesHandler,
	getAccessoryByIdHandler,
	getQueriedAccessoriesHandler,
	updateAccessoriesBulkHandler,
	updateAccessoryByIdHandler,
} from "./accessory.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const accessoryRouter = Router();

accessoryRouter.use(verifyRoles());

accessoryRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedAccessoriesHandler,
	)
	.post(createNewAccessoryHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
accessoryRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllAccessoriesHandler);

// DEV ROUTE
accessoryRouter
	.route("/dev")
	.post(createNewAccessoryBulkHandler)
	.patch(updateAccessoriesBulkHandler);

// single document routes
accessoryRouter
	.route("/:accessoryId")
	.get(verifyJWTMiddleware, verifyRoles(), getAccessoryByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAAccessoryHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateAccessoryByIdHandler);

export { accessoryRouter };
