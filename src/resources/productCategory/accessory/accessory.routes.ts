import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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

accessoryRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedAccessoriesHandler,
	)
	.post(createNewAccessoryHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
accessoryRouter.route("/delete-all").delete(deleteAllAccessoriesHandler);

// DEV ROUTE
accessoryRouter
	.route("/dev")
	.post(createNewAccessoryBulkHandler)
	.patch(updateAccessoriesBulkHandler);

// single document routes
accessoryRouter
	.route("/:accessoryId")
	.get(getAccessoryByIdHandler)
	.delete(deleteAAccessoryHandler)
	.patch(updateAccessoryByIdHandler);

export { accessoryRouter };
