/**
 * This barrel file is used to import/export errorLog model, router, types, handlers and services
 */

/**
 * Imports
 */
import { ErrorLogModel } from "./errorLog.model";
import { errorLogRouter } from "./errorLog.routes";
import {
  createNewErrorLogController,
  createNewErrorLogsBulkController,
  deleteAllErrorLogsController,
  deleteAnErrorLogController,
  getErrorLogByIdController,
  getErrorLogsByUserController,
  getQueriedErrorLogsController,
  updateErrorLogByIdController,
  updateErrorLogsBulkController,
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
  createNewErrorLogController,
  createNewErrorLogService,
  createNewErrorLogsBulkController,
  deleteErrorLogByIdService,
  deleteAllErrorLogsController,
  deleteAllErrorLogsService,
  deleteAnErrorLogController,
  getErrorLogByIdController,
  getErrorLogByIdService,
  getErrorLogsByUserController,
  getQueriedErrorLogsByUserService,
  getQueriedErrorLogsController,
  getQueriedErrorLogsService,
  getQueriedTotalErrorLogsService,
  updateErrorLogByIdService,
  updateErrorLogByIdController,
  updateErrorLogsBulkController,
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
