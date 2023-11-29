import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
import {
	createNewGpuBulkHandler,
	createNewGpuHandler,
	deleteAGpuHandler,
	deleteAllGpusHandler,
	getGpuByIdHandler,
	getQueriedGpusHandler,
	updateGpuByIdHandler,
	updateGpusBulkHandler,
} from "./gpu.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const gpuRouter = Router();

gpuRouter
	.route("/")
	.get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedGpusHandler)
	.post(createNewGpuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
gpuRouter.route("/delete-all").delete(deleteAllGpusHandler);

// DEV ROUTE
gpuRouter
	.route("/dev")
	.post(createNewGpuBulkHandler)
	.patch(updateGpusBulkHandler);

// single document routes
gpuRouter
	.route("/:gpuId")
	.get(getGpuByIdHandler)
	.delete(deleteAGpuHandler)
	.patch(updateGpuByIdHandler);

export { gpuRouter };
