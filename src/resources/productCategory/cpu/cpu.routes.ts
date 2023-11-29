import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewCpuBulkHandler,
	createNewCpuHandler,
	deleteACpuHandler,
	deleteAllCpusHandler,
	getCpuByIdHandler,
	getQueriedCpusHandler,
	updateCpuByIdHandler,
	updateCpusBulkHandler,
} from "./cpu.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const cpuRouter = Router();

cpuRouter.use(verifyRoles());

cpuRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedCpusHandler,
	)
	.post(createNewCpuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
cpuRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllCpusHandler);

// DEV ROUTE
cpuRouter
	.route("/dev")
	.post(createNewCpuBulkHandler)
	.patch(updateCpusBulkHandler);

// single document routes
cpuRouter
	.route("/:cpuId")
	.get(verifyJWTMiddleware, verifyRoles(), getCpuByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteACpuHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateCpuByIdHandler);

export { cpuRouter };
