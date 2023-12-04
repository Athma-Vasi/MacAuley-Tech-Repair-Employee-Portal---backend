import { Router } from "express";
import {
  createNewPrinterIssueHandler,
  getQueriedPrinterIssuesHandler,
  getPrinterIssuesByUserHandler,
  getPrinterIssueByIdHandler,
  deletePrinterIssueHandler,
  deleteAllPrinterIssuesHandler,
  updatePrinterIssueStatusByIdHandler,
  createNewPrinterIssuesBulkHandler,
  updatePrinterIssuesBulkHandler,
} from "./printerIssue.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const printerIssueRouter = Router();

printerIssueRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPrinterIssuesHandler)
  .post(createNewPrinterIssueHandler);

printerIssueRouter.route("/delete-all").delete(deleteAllPrinterIssuesHandler);

printerIssueRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getPrinterIssuesByUserHandler);

// DEV ROUTES
printerIssueRouter
  .route("/dev")
  .post(createNewPrinterIssuesBulkHandler)
  .patch(updatePrinterIssuesBulkHandler);

printerIssueRouter
  .route("/:printerIssueId")
  .get(getPrinterIssueByIdHandler)
  .delete(deletePrinterIssueHandler)
  .patch(updatePrinterIssueStatusByIdHandler);

export { printerIssueRouter };
