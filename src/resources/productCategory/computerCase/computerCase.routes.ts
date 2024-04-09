import { Router } from "express";
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
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createComputerCaseJoiSchema,
  updateComputerCaseJoiSchema,
} from "./computerCase.validation";

const computerCaseRouter = Router();

computerCaseRouter
  .route("/")
  .get(getQueriedComputerCasesHandler)
  .post(
    validateSchemaMiddleware(createComputerCaseJoiSchema, "computerCaseSchema"),
    createNewComputerCaseHandler
  );

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
  .patch(
    validateSchemaMiddleware(updateComputerCaseJoiSchema),
    updateComputerCaseByIdHandler
  );

export { computerCaseRouter };
