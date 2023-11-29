import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewGpuBulkHandler,
	createNewGpuHandler,
	deleteAGpuHandler,
	deleteAllGpusHandler,
	getGpuByIdHandler,
	getQueriedGpusHandler,
	returnAllFileUploadsForGpusHandler,
	updateGpuByIdHandler,
} from "./gpu.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const gpuRouter = Router();

gpuRouter.use(verifyRoles());

gpuRouter
	.route("/")
	.get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedGpusHandler)
	.post(createNewGpuHandler)
	.delete(deleteAllGpusHandler);

// DEV ROUTE
gpuRouter.route("/dev").post(createNewGpuBulkHandler);

gpuRouter.route("/fileUploads").post(returnAllFileUploadsForGpusHandler);

gpuRouter
	.route("/:gpuId")
	.get(getGpuByIdHandler)
	.delete(deleteAGpuHandler)
	.put(updateGpuByIdHandler);

export { gpuRouter };
