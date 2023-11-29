import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewDesktopComputerBulkHandler,
	createNewDesktopComputerHandler,
	deleteADesktopComputerHandler,
	deleteAllDesktopComputersHandler,
	getDesktopComputerByIdHandler,
	getQueriedDesktopComputersHandler,
	updateDesktopComputerByIdHandler,
	updateDesktopComputersBulkHandler,
} from "./desktopComputer.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const desktopComputerRouter = Router();

desktopComputerRouter.use(verifyRoles());

desktopComputerRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedDesktopComputersHandler,
	)
	.post(createNewDesktopComputerHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
desktopComputerRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllDesktopComputersHandler);

// DEV ROUTE
desktopComputerRouter
	.route("/dev")
	.post(createNewDesktopComputerBulkHandler)
	.patch(updateDesktopComputersBulkHandler);

// single document routes
desktopComputerRouter
	.route("/:caseId")
	.get(verifyJWTMiddleware, verifyRoles(), getDesktopComputerByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteADesktopComputerHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateDesktopComputerByIdHandler);

export { desktopComputerRouter };
