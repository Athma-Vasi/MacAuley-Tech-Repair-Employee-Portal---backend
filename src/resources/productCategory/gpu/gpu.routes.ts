import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
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

gpuRouter.use(verifyRoles());

gpuRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedGpusHandler,
	)
	.post(createNewGpuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
gpuRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllGpusHandler);

// DEV ROUTE
gpuRouter
	.route("/dev")
	.post(createNewGpuBulkHandler)
	.patch(updateGpusBulkHandler);

// single document routes
gpuRouter
	.route("/:gpuId")
	.get(verifyJWTMiddleware, verifyRoles(), getGpuByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAGpuHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateGpuByIdHandler);

export { gpuRouter };
