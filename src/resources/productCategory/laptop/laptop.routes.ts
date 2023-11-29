import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
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

laptopRouter.use(verifyRoles());

laptopRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedLaptopsHandler,
	)
	.post(createNewLaptopHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
laptopRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllLaptopsHandler);

// DEV ROUTE
laptopRouter
	.route("/dev")
	.post(createNewLaptopBulkHandler)
	.patch(updateLaptopsBulkHandler);

// single document routes
laptopRouter
	.route("/:laptopId")
	.get(verifyJWTMiddleware, verifyRoles(), getLaptopByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteALaptopHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateLaptopByIdHandler);

export { laptopRouter };
