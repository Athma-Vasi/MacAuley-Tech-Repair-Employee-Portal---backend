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
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createDesktopComputerJoiSchema,
  updateDesktopComputerJoiSchema,
} from "./desktopComputer.validation";

const desktopComputerRouter = Router();

desktopComputerRouter
  .route("/")
  .get(getQueriedDesktopComputersHandler)
  .post(
    validateSchemaMiddleware(createDesktopComputerJoiSchema, "desktopComputerSchema"),
    createNewDesktopComputerHandler
  );

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
  .patch(
    validateSchemaMiddleware(updateDesktopComputerJoiSchema),
    updateDesktopComputerByIdHandler
  );

export { desktopComputerRouter };
