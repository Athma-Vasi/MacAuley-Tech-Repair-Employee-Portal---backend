/**
 * This barrel file is used to import/export printerIssue model, router, types, handlers and services
 */

/**
 * Imports
 */
import { PrinterIssueModel } from "./printerIssue.model";
import { printerIssueRouter } from "./printerIssue.routes";
import {
  createNewPrinterIssueHandler,
  createNewPrinterIssuesBulkHandler,
  deleteAllPrinterIssuesHandler,
  deletePrinterIssueHandler,
  getPrinterIssueByIdHandler,
  getPrinterIssuesByUserHandler,
  getQueriedPrinterIssuesHandler,
  updatePrinterIssueByIdHandler,
  updatePrinterIssuesBulkHandler,
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
  createNewPrinterIssueHandler,
  createNewPrinterIssueService,
  createNewPrinterIssuesBulkHandler,
  deleteAllPrinterIssuesHandler,
  deleteAllPrinterIssuesService,
  deletePrinterIssueByIdService,
  deletePrinterIssueHandler,
  getPrinterIssueByIdHandler,
  getPrinterIssueByIdService,
  getPrinterIssuesByUserHandler,
  getQueriedPrinterIssuesByUserService,
  getQueriedPrinterIssuesHandler,
  getQueriedPrinterIssuesService,
  getQueriedTotalPrinterIssuesService,
  updatePrinterIssueByIdService,
  updatePrinterIssueByIdHandler,
  updatePrinterIssuesBulkHandler,
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
