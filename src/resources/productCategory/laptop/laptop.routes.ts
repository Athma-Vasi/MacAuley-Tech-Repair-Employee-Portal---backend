import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
import {
	createNewLaptopBulkHandler,
	createNewLaptopHandler,
	deleteALaptopHandler,
	deleteAllLaptopsHandler,
	getLaptopByIdHandler,
	getQueriedLaptopsHandler,
	updateLaptopByIdHandler,
	updateLaptopsBulkHandler,
} from "./laptop.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const laptopRouter = Router();

laptopRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedLaptopsHandler,
	)
	.post(createNewLaptopHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
laptopRouter.route("/delete-all").delete(deleteAllLaptopsHandler);

// DEV ROUTE
laptopRouter
	.route("/dev")
	.post(createNewLaptopBulkHandler)
	.patch(updateLaptopsBulkHandler);

// single document routes
laptopRouter
	.route("/:laptopId")
	.get(getLaptopByIdHandler)
	.delete(deleteALaptopHandler)
	.patch(updateLaptopByIdHandler);

export { laptopRouter };
