import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewComputerCaseBulkHandler,
	createNewComputerCaseHandler,
	deleteAComputerCaseHandler,
	deleteAllComputerCasesHandler,
	getComputerCaseByIdHandler,
	getQueriedComputerCasesHandler,
	returnAllFileUploadsForComputerCasesHandler,
	updateComputerCaseByIdHandler,
} from "./computerCase.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const computerCaseRouter = Router();

computerCaseRouter.use(verifyRoles());

computerCaseRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedComputerCasesHandler,
	)
	.post(createNewComputerCaseHandler)
	.delete(deleteAllComputerCasesHandler);

// DEV ROUTE
computerCaseRouter.route("/dev").post(createNewComputerCaseBulkHandler);

computerCaseRouter
	.route("/fileUploads")
	.post(returnAllFileUploadsForComputerCasesHandler);

computerCaseRouter
	.route("/:computerCaseId")
	.get(getComputerCaseByIdHandler)
	.delete(deleteAComputerCaseHandler)
	.put(updateComputerCaseByIdHandler);

export { computerCaseRouter };
