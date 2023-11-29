import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewLaptopBulkHandler,
	createNewLaptopHandler,
	deleteALaptopHandler,
	deleteAllLaptopsHandler,
	getLaptopByIdHandler,
	getQueriedLaptopsHandler,
	returnAllFileUploadsForLaptopsHandler,
	updateLaptopByIdHandler,
} from "./laptop.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const laptopRouter = Router();

laptopRouter.use(verifyRoles());

laptopRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedLaptopsHandler,
	)
	.post(createNewLaptopHandler)
	.delete(deleteAllLaptopsHandler);

// DEV ROUTE
laptopRouter.route("/dev").post(createNewLaptopBulkHandler);

laptopRouter.route("/fileUploads").post(returnAllFileUploadsForLaptopsHandler);

laptopRouter
	.route("/:laptopId")
	.get(getLaptopByIdHandler)
	.delete(deleteALaptopHandler)
	.put(updateLaptopByIdHandler);

export { laptopRouter };
