/**
 * This barrel file is used to import/export printerIssue model, router, types, handlers and services
 */

/**
 * Imports
 */
import { PrinterIssueModel } from "./printerIssue.model";
import { printerIssueRouter } from "./printerIssue.routes";
import {
  createNewPrinterIssueController,
  createNewPrinterIssuesBulkController,
  deleteAllPrinterIssuesController,
  deletePrinterIssueController,
  getPrinterIssueByIdController,
  getPrinterIssuesByUserController,
  getQueriedPrinterIssuesController,
  updatePrinterIssueByIdController,
  updatePrinterIssuesBulkController,
} from "./printerIssue.controller";
import {
  createNewPrinterIssueService,
  deleteAllPrinterIssuesService,
  deletePrinterIssueByIdService,
  getPrinterIssueByIdService,
  getQueriedPrinterIssuesByUserService,
  getQueriedPrinterIssuesService,
  getQueriedTotalPrinterIssuesService,
  updatePrinterIssueByIdService,
} from "./printerIssue.service";

import type {
  PrinterIssueDocument,
  PrinterIssueSchema,
  Urgency,
} from "./printerIssue.model";
import type {
  CreateNewPrinterIssueRequest,
  CreateNewPrinterIssuesBulkRequest,
  DeleteAllPrinterIssuesRequest,
  DeletePrinterIssueRequest,
  GetPrinterIssueByIdRequest,
  GetQueriedPrinterIssuesByUserRequest,
  GetQueriedPrinterIssuesRequest,
  UpdatePrinterIssueByIdRequest,
  UpdatePrinterIssuesBulkRequest,
} from "./printerIssue.types";

/**
 * Exports
 */
export {
  PrinterIssueModel,
  printerIssueRouter,
  createNewPrinterIssueController,
  createNewPrinterIssueService,
  createNewPrinterIssuesBulkController,
  deleteAllPrinterIssuesController,
  deleteAllPrinterIssuesService,
  deletePrinterIssueByIdService,
  deletePrinterIssueController,
  getPrinterIssueByIdController,
  getPrinterIssueByIdService,
  getPrinterIssuesByUserController,
  getQueriedPrinterIssuesByUserService,
  getQueriedPrinterIssuesController,
  getQueriedPrinterIssuesService,
  getQueriedTotalPrinterIssuesService,
  updatePrinterIssueByIdService,
  updatePrinterIssueByIdController,
  updatePrinterIssuesBulkController,
};

export type {
  CreateNewPrinterIssueRequest,
  CreateNewPrinterIssuesBulkRequest,
  DeleteAllPrinterIssuesRequest,
  DeletePrinterIssueRequest,
  GetPrinterIssueByIdRequest,
  GetQueriedPrinterIssuesByUserRequest,
  GetQueriedPrinterIssuesRequest,
  UpdatePrinterIssueByIdRequest,
  UpdatePrinterIssuesBulkRequest,
  PrinterIssueDocument,
  PrinterIssueSchema,
  Urgency,
};
