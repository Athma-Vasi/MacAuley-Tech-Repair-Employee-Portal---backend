import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
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

computerCaseRouter.use(verifyRoles());

computerCaseRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedComputerCasesHandler,
	)
	.post(createNewComputerCaseHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
computerCaseRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllComputerCasesHandler);

// DEV ROUTE
computerCaseRouter
	.route("/dev")
	.post(createNewComputerCaseBulkHandler)
	.patch(updateComputerCasesBulkHandler);

// single document routes
computerCaseRouter
	.route("/:caseId")
	.get(verifyJWTMiddleware, verifyRoles(), getComputerCaseByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAComputerCaseHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateComputerCaseByIdHandler);

export { computerCaseRouter };
