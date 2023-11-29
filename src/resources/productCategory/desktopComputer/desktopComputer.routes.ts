import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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

desktopComputerRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedDesktopComputersHandler,
	)
	.post(createNewDesktopComputerHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
desktopComputerRouter
	.route("/delete-all")
	.delete(deleteAllDesktopComputersHandler);

// DEV ROUTE
desktopComputerRouter
	.route("/dev")
	.post(createNewDesktopComputerBulkHandler)
	.patch(updateDesktopComputersBulkHandler);

// single document routes
desktopComputerRouter
	.route("/:desktopComputerId")
	.get(getDesktopComputerByIdHandler)
	.delete(deleteADesktopComputerHandler)
	.patch(updateDesktopComputerByIdHandler);

export { desktopComputerRouter };
