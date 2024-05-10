import { Router } from "express";
import {
  createNewComputerCaseBulkController,
  createNewComputerCaseController,
  deleteAComputerCaseController,
  deleteAllComputerCasesController,
  getComputerCaseByIdController,
  getQueriedComputerCasesController,
  updateComputerCaseByIdController,
  updateComputerCasesBulkController,
} from "./computerCase.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createComputerCaseJoiSchema,
  updateComputerCaseJoiSchema,
} from "./computerCase.validation";

const computerCaseRouter = Router();

computerCaseRouter
  .route("/")
  .get(getQueriedComputerCasesController)
  .post(
    validateSchemaMiddleware(createComputerCaseJoiSchema, "computerCaseSchema"),
    createNewComputerCaseController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
computerCaseRouter.route("/delete-all").delete(deleteAllComputerCasesController);

// DEV ROUTE
computerCaseRouter
  .route("/dev")
  .post(createNewComputerCaseBulkController)
  .patch(updateComputerCasesBulkController);

// single document routes
computerCaseRouter
  .route("/:computerCaseId")
  .get(getComputerCaseByIdController)
  .delete(deleteAComputerCaseController)
  .patch(
    validateSchemaMiddleware(updateComputerCaseJoiSchema),
    updateComputerCaseByIdController
  );

export { computerCaseRouter };
