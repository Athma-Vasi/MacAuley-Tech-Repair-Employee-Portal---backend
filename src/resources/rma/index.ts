/**
 * This barrel file is used to import/export rma online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { RMAModel } from "./rma.model";
import { rmaRouter } from "./rma.routes";
import {
  updateRMAsBulkHandler,
  createNewRMAHandler,
  createNewRMAsBulkHandler,
  deleteAllRMAsHandler,
  deleteRMAHandler,
  getAllRMAsBulkHandler,
  getRMAByIdHandler,
  getQueriedRMAsHandler,
  getQueriedRMAsByUserHandler,
  updateRMAByIdHandler,
} from "./rma.controller";
import {
  createNewRMAService,
  deleteARMAService,
  deleteAllRMAsService,
  getAllRMAsService,
  getRMAByIdService,
  getQueriedRMAsByUserService,
  getQueriedRMAsService,
  getQueriedTotalRMAsService,
  updateRMAByIdService,
} from "./rma.service";

import type { RMADocument, RMASchema } from "./rma.model";
import type {
  CreateNewRMARequest,
  CreateNewRMAsBulkRequest,
  DeleteARMARequest,
  DeleteAllRMAsRequest,
  GetAllRMAsBulkRequest,
  GetRMAByIdRequest,
  GetQueriedRMAsByUserRequest,
  GetQueriedRMAsRequest,
  UpdateRMAByIdRequest,
  UpdateRMAsBulkRequest,
} from "./rma.types";

/**
 * Exports
 */

export {
  RMAModel,
  updateRMAsBulkHandler,
  createNewRMAHandler,
  createNewRMAService,
  createNewRMAsBulkHandler,
  deleteARMAService,
  deleteAllRMAsHandler,
  deleteAllRMAsService,
  deleteRMAHandler,
  getAllRMAsBulkHandler,
  getAllRMAsService,
  getRMAByIdHandler,
  getRMAByIdService,
  getQueriedRMAsByUserService,
  getQueriedRMAsHandler,
  getQueriedRMAsService,
  getQueriedRMAsByUserHandler,
  getQueriedTotalRMAsService,
  rmaRouter,
  updateRMAByIdHandler,
  updateRMAByIdService,
};

export type {
  CreateNewRMARequest,
  CreateNewRMAsBulkRequest,
  DeleteARMARequest,
  DeleteAllRMAsRequest,
  GetAllRMAsBulkRequest,
  GetRMAByIdRequest,
  GetQueriedRMAsByUserRequest,
  GetQueriedRMAsRequest,
  RMADocument,
  RMASchema,
  UpdateRMAByIdRequest,
  UpdateRMAsBulkRequest,
};
