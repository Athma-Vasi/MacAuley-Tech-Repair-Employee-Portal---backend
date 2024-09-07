import { Router } from "express";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createPrinterIssueJoiSchema,
  updatePrinterIssueJoiSchema,
} from "./printerIssue.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../../handlers";
import { PrinterIssueModel } from "./printerIssue.model";

const printerIssueRouter = Router();

printerIssueRouter
  .route("/")
  // @desc   Get all printerIssues plans
  // @route  GET api/v1/actions/general/printer-issue
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(PrinterIssueModel))
  // @desc   Create a new printerIssue plan
  // @route  POST api/v1/actions/general/printer-issue
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createPrinterIssueJoiSchema, "schema"),
    createNewResourceHandler(PrinterIssueModel),
  );

// @desc   Delete all printerIssues plans
// @route  DELETE api/v1/actions/general/printer-issue/delete-all
// @access Private/Admin/Manager
printerIssueRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(PrinterIssueModel),
);

// @desc   Get all printerIssues plans by user
// @route  GET api/v1/actions/general/printer-issue/user
// @access Private/Admin/Manager
printerIssueRouter.route("/user").get(
  getQueriedResourcesByUserHandler(PrinterIssueModel),
);

printerIssueRouter
  .route("/:resourceId")
  // @desc   Get a printerIssue plan by ID
  // @route  GET api/v1/actions/general/printer-issue/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(PrinterIssueModel))
  // @desc   Delete a printerIssue plan by ID
  // @route  DELETE api/v1/actions/general/printer-issue/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(PrinterIssueModel))
  // @desc   Update a printerIssues plan by ID
  // @route  PATCH api/v1/actions/general/printer-issue/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updatePrinterIssueJoiSchema),
    updateResourceByIdHandler(PrinterIssueModel),
  );

export { printerIssueRouter };
