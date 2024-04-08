import { Router } from "express";
import {
  createNewPrinterIssueHandler,
  getQueriedPrinterIssuesHandler,
  getPrinterIssuesByUserHandler,
  getPrinterIssueByIdHandler,
  deletePrinterIssueHandler,
  deleteAllPrinterIssuesHandler,
  updatePrinterIssueByIdHandler,
  createNewPrinterIssuesBulkHandler,
  updatePrinterIssuesBulkHandler,
} from "./printerIssue.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createPrinterIssueJoiSchema,
  updatePrinterIssueJoiSchema,
} from "./printerIssue.validation";

const printerIssueRouter = Router();

printerIssueRouter
  .route("/")
  .get(getQueriedPrinterIssuesHandler)
  .post(
    validateSchemaMiddleware(createPrinterIssueJoiSchema, "printerIssueSchema"),
    createNewPrinterIssueHandler
  );

printerIssueRouter.route("/delete-all").delete(deleteAllPrinterIssuesHandler);

printerIssueRouter.route("/user").get(getPrinterIssuesByUserHandler);

// DEV ROUTES
printerIssueRouter
  .route("/dev")
  .post(createNewPrinterIssuesBulkHandler)
  .patch(updatePrinterIssuesBulkHandler);

printerIssueRouter
  .route("/:printerIssueId")
  .get(getPrinterIssueByIdHandler)
  .delete(deletePrinterIssueHandler)
  .patch(
    validateSchemaMiddleware(updatePrinterIssueJoiSchema),
    updatePrinterIssueByIdHandler
  );

export { printerIssueRouter };
