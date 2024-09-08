import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createPrinterIssueJoiSchema,
  updatePrinterIssueJoiSchema,
} from "./printerIssue.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { PrinterIssueModel } from "./printerIssue.model";

const printerIssueRouter = Router();

printerIssueRouter
  .route("/")
  // @desc   Get all printerIssues
  // @route  GET api/v1/general/printer-issue
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(PrinterIssueModel))
  // @desc   Create a new printerIssue
  // @route  POST api/v1/general/printer-issue
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createPrinterIssueJoiSchema, "schema"),
    createNewResourceHandler(PrinterIssueModel),
  );

// @desc   Delete many printerIssues
// @route  DELETE api/v1/general/printer-issue/delete-many
// @access Private/Admin/Manager
printerIssueRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(PrinterIssueModel),
);

// @desc   Get all printerIssues by user
// @route  GET api/v1/general/printer-issue/user
// @access Private/Admin/Manager
printerIssueRouter.route("/user").get(
  getQueriedResourcesByUserHandler(PrinterIssueModel),
);

printerIssueRouter
  .route("/:resourceId")
  // @desc   Get a printerIssue by its ID
  // @route  GET api/v1/general/printer-issue/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(PrinterIssueModel))
  // @desc   Delete a printerIssue by its ID
  // @route  DELETE api/v1/general/printer-issue/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(PrinterIssueModel))
  // @desc   Update a printerIssue by its ID
  // @route  PATCH api/v1/general/printer-issue/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updatePrinterIssueJoiSchema),
    updateResourceByIdHandler(PrinterIssueModel),
  );

export { printerIssueRouter };
