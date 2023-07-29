/**
 * This barrel file is used to import/export printerIssue model, router, types, handlers and services
 */

/**
 * Imports
 */
import { PrinterIssueModel } from './printerIssue.model';
import { printerIssueRouter } from './printerIssue.routes';
import {
  createNewPrinterIssueHandler,
  deletePrinterIssueHandler,
  getAPrinterIssueHandler,
  getQueriedPrinterIssuesHandler,
  getQueriedPrinterIssuesByUserHandler,
  updatePrinterIssueByIdHandler,
  deleteAllPrinterIssuesHandler,
} from './printerIssue.controller';
import {
  createNewPrinterIssueService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getQueriedPrinterIssuesService,
  getQueriedPrinterIssuesByUserService,
  deleteAllPrinterIssuesService,
  updatePrinterIssueByIdService,
} from './printerIssue.service';

import type { PrinterIssueDocument, PrinterIssueSchema, Urgency } from './printerIssue.model';
import type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  GetAPrinterIssueRequest,
  GetQueriedPrinterIssuesRequest,
  GetQueriedPrinterIssuesByUserRequest,
  DeleteAllPrinterIssuesRequest,
  UpdatePrinterIssueStatusByIdRequest,
} from './printerIssue.types';

/**
 * Exports
 */
export {
  createNewPrinterIssueHandler,
  deletePrinterIssueHandler,
  getAPrinterIssueHandler,
  getQueriedPrinterIssuesHandler,
  getQueriedPrinterIssuesByUserHandler,
  createNewPrinterIssueService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getQueriedPrinterIssuesService,
  getQueriedPrinterIssuesByUserService,
  PrinterIssueModel,
  printerIssueRouter,
  deleteAllPrinterIssuesHandler,
  deleteAllPrinterIssuesService,
  updatePrinterIssueByIdHandler,
  updatePrinterIssueByIdService,
};

export type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  DeleteAllPrinterIssuesRequest,
  GetAPrinterIssueRequest,
  GetQueriedPrinterIssuesRequest,
  GetQueriedPrinterIssuesByUserRequest,
  PrinterIssueDocument,
  PrinterIssueSchema,
  Urgency,
  UpdatePrinterIssueStatusByIdRequest,
};
