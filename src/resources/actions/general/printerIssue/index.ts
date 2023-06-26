/**
 * This index file is used to import/export printerIssue model, router, types, handlers and services
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
  getAllPrinterIssuesHandler,
  getPrinterIssuesByUserHandler,
} from './printerIssue.controller';
import {
  createNewPrinterIssueService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getAllPrinterIssuesService,
  getPrinterIssuesFromUserService,
} from './printerIssue.service';

import type {
  PrinterIssueDocument,
  PrinterIssueSchema,
  PrinterIssueUrgency,
} from './printerIssue.model';
import type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  GetAPrinterIssueRequest,
  GetAllPrinterIssuesRequest,
  GetPrinterIssuesFromUserRequest,
  DeleteAllPrinterIssuesRequest,
  PrinterIssuesServerResponse,
} from './printerIssue.types';

/**
 * Exports
 */
export {
  createNewPrinterIssueHandler,
  deletePrinterIssueHandler,
  getAPrinterIssueHandler,
  getAllPrinterIssuesHandler,
  getPrinterIssuesByUserHandler,
  createNewPrinterIssueService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getAllPrinterIssuesService,
  getPrinterIssuesFromUserService,
  PrinterIssueModel,
  printerIssueRouter,
};

export type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  DeleteAllPrinterIssuesRequest,
  GetAPrinterIssueRequest,
  GetAllPrinterIssuesRequest,
  GetPrinterIssuesFromUserRequest,
  PrinterIssueDocument,
  PrinterIssueSchema,
  PrinterIssueUrgency,
  PrinterIssuesServerResponse,
};
