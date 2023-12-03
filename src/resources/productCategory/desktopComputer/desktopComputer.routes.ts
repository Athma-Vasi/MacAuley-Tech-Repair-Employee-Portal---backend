import { Router } from "express";
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

const desktopComputerRouter = Router();

desktopComputerRouter
  .route("/")
  .get(getQueriedDesktopComputersHandler)
  .post(createNewDesktopComputerHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
desktopComputerRouter.route("/delete-all").delete(deleteAllDesktopComputersHandler);

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
