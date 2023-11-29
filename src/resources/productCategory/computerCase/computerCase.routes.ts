import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
import {
	createNewComputerCaseBulkHandler,
	createNewComputerCaseHandler,
	deleteAComputerCaseHandler,
	deleteAllComputerCasesHandler,
	getComputerCaseByIdHandler,
	getQueriedComputerCasesHandler,
	updateComputerCaseByIdHandler,
	updateComputerCasesBulkHandler,
} from "./computerCase.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const computerCaseRouter = Router();

computerCaseRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedComputerCasesHandler,
	)
	.post(createNewComputerCaseHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
computerCaseRouter.route("/delete-all").delete(deleteAllComputerCasesHandler);

// DEV ROUTE
computerCaseRouter
	.route("/dev")
	.post(createNewComputerCaseBulkHandler)
	.patch(updateComputerCasesBulkHandler);

// single document routes
computerCaseRouter
	.route("/:computerCaseId")
	.get(getComputerCaseByIdHandler)
	.delete(deleteAComputerCaseHandler)
	.patch(updateComputerCaseByIdHandler);

export { computerCaseRouter };
