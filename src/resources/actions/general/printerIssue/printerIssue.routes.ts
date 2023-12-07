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

const printerIssueRouter = Router();

printerIssueRouter
  .route("/")
  .get(getQueriedPrinterIssuesHandler)
  .post(createNewPrinterIssueHandler);

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
  .patch(updatePrinterIssueByIdHandler);

export { printerIssueRouter };
