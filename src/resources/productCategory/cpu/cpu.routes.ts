import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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

cpuRouter
	.route("/")
	.get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedCpusHandler)
	.post(createNewCpuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
cpuRouter.route("/delete-all").delete(deleteAllCpusHandler);

// DEV ROUTE
cpuRouter
	.route("/dev")
	.post(createNewCpuBulkHandler)
	.patch(updateCpusBulkHandler);

// single document routes
cpuRouter
	.route("/:cpuId")
	.get(getCpuByIdHandler)
	.delete(deleteACpuHandler)
	.patch(updateCpuByIdHandler);

export { cpuRouter };
