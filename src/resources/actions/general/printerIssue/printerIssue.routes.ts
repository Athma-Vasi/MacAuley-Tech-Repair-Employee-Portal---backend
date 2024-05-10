import { Router } from "express";
import {
  createNewPrinterIssueController,
  getQueriedPrinterIssuesController,
  getPrinterIssuesByUserController,
  getPrinterIssueByIdController,
  deletePrinterIssueController,
  deleteAllPrinterIssuesController,
  updatePrinterIssueByIdController,
  createNewPrinterIssuesBulkController,
  updatePrinterIssuesBulkController,
} from "./printerIssue.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createPrinterIssueJoiSchema,
  updatePrinterIssueJoiSchema,
} from "./printerIssue.validation";

const printerIssueRouter = Router();

printerIssueRouter
  .route("/")
  .get(getQueriedPrinterIssuesController)
  .post(
    validateSchemaMiddleware(createPrinterIssueJoiSchema, "printerIssueSchema"),
    createNewPrinterIssueController
  );

printerIssueRouter.route("/delete-all").delete(deleteAllPrinterIssuesController);

printerIssueRouter.route("/user").get(getPrinterIssuesByUserController);

// DEV ROUTES
printerIssueRouter
  .route("/dev")
  .post(createNewPrinterIssuesBulkController)
  .patch(updatePrinterIssuesBulkController);

printerIssueRouter
  .route("/:printerIssueId")
  .get(getPrinterIssueByIdController)
  .delete(deletePrinterIssueController)
  .patch(
    validateSchemaMiddleware(updatePrinterIssueJoiSchema),
    updatePrinterIssueByIdController
  );

export { printerIssueRouter };
