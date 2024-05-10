import { Router, NextFunction } from "express";
import {
  createNewDesktopComputerBulkController,
  createNewDesktopComputerController,
  deleteADesktopComputerController,
  deleteAllDesktopComputersController,
  getDesktopComputerByIdController,
  getQueriedDesktopComputersController,
  updateDesktopComputerByIdController,
  updateDesktopComputersBulkController,
} from "./desktopComputer.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createDesktopComputerJoiSchema,
  updateDesktopComputerJoiSchema,
} from "./desktopComputer.validation";

const desktopComputerRouter = Router();

desktopComputerRouter
  .route("/")
  .get(getQueriedDesktopComputersController)
  .post(
    validateSchemaMiddleware(createDesktopComputerJoiSchema, "desktopComputerSchema"),
    createNewDesktopComputerController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
desktopComputerRouter.route("/delete-all").delete(deleteAllDesktopComputersController);

// DEV ROUTE
desktopComputerRouter
  .route("/dev")
  .post(createNewDesktopComputerBulkController)
  .patch(updateDesktopComputersBulkController);

// single document routes
desktopComputerRouter
  .route("/:desktopComputerId")
  .get(getDesktopComputerByIdController)
  .delete(deleteADesktopComputerController)
  .patch(
    validateSchemaMiddleware(updateDesktopComputerJoiSchema),
    updateDesktopComputerByIdController
  );

export { desktopComputerRouter };
