/**
 * This barrel file is used to import/export errorLog model, router, types, handlers and services
 */

/**
 * Imports
 */
import { ErrorLogModel } from "./errorLog.model";
import { errorLogRouter } from "./errorLog.routes";
import {
  createNewErrorLogHandler,
  createNewErrorLogsBulkHandler,
  deleteAllErrorLogsHandler,
  deleteAnErrorLogHandler,
  getErrorLogByIdHandler,
  getErrorLogsByUserHandler,
  getQueriedErrorLogsHandler,
  updateErrorLogByIdHandler,
  updateErrorLogsBulkHandler,
} from "./errorLog.controller";
import {
  createNewErrorLogService,
  deleteErrorLogByIdService,
  deleteAllErrorLogsService,
  getErrorLogByIdService,
  getQueriedErrorLogsByUserService,
  getQueriedErrorLogsService,
  getQueriedTotalErrorLogsService,
  updateErrorLogByIdService,
} from "./errorLog.service";

import type { ErrorLogDocument, ErrorLogSchema } from "./errorLog.model";
import type {
  CreateNewErrorLogRequest,
  CreateNewErrorLogsBulkRequest,
  DeleteAllErrorLogsRequest,
  DeleteAnErrorLogRequest,
  GetErrorLogByIdRequest,
  GetQueriedErrorLogsByUserRequest,
  GetQueriedErrorLogsRequest,
  UpdateErrorLogByIdRequest,
  UpdateErrorLogsBulkRequest,
} from "./errorLog.types";

/**
 * Exports
 */
export {
  ErrorLogModel,
  errorLogRouter,
  createNewErrorLogHandler,
  createNewErrorLogService,
  createNewErrorLogsBulkHandler,
  deleteErrorLogByIdService,
  deleteAllErrorLogsHandler,
  deleteAllErrorLogsService,
  deleteAnErrorLogHandler,
  getErrorLogByIdHandler,
  getErrorLogByIdService,
  getErrorLogsByUserHandler,
  getQueriedErrorLogsByUserService,
  getQueriedErrorLogsHandler,
  getQueriedErrorLogsService,
  getQueriedTotalErrorLogsService,
  updateErrorLogByIdService,
  updateErrorLogByIdHandler,
  updateErrorLogsBulkHandler,
};

export type {
  ErrorLogDocument,
  ErrorLogSchema,
  CreateNewErrorLogRequest,
  CreateNewErrorLogsBulkRequest,
  DeleteAllErrorLogsRequest,
  DeleteAnErrorLogRequest,
  GetErrorLogByIdRequest,
  GetQueriedErrorLogsByUserRequest,
  GetQueriedErrorLogsRequest,
  UpdateErrorLogByIdRequest,
  UpdateErrorLogsBulkRequest,
};
