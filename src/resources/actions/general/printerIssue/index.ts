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
  updatePrinterIssueHandler,
  deleteAllPrinterIssuesHandler,
} from './printerIssue.controller';
import {
  createNewPrinterIssueService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getQueriedPrinterIssuesService,
  getQueriedPrinterIssuesByUserService,
  deleteAllPrinterIssuesService,
  updatePrinterIssueService,
} from './printerIssue.service';

import type { PrinterIssueDocument, PrinterIssueSchema, Urgency } from './printerIssue.model';
import type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  GetAPrinterIssueRequest,
  GetQueriedPrinterIssuesRequest,
  GetQueriedPrinterIssuesByUserRequest,
  DeleteAllPrinterIssuesRequest,
  UpdatePrinterIssueRequest,
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
  updatePrinterIssueHandler,
  updatePrinterIssueService,
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
  UpdatePrinterIssueRequest,
};
