/**
 * This barrel file is used to import/export rma online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { RMAModel } from "./rma.model";
import { rmaRouter } from "./rma.routes";
import {
  updateRMAsBulkController,
  createNewRMAController,
  createNewRMAsBulkController,
  deleteAllRMAsController,
  deleteRMAController,
  getAllRMAsBulkController,
  getRMAByIdController,
  getQueriedRMAsController,
  getQueriedRMAsByUserController,
  updateRMAByIdController,
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
  updateRMAsBulkController,
  createNewRMAController,
  createNewRMAService,
  createNewRMAsBulkController,
  deleteARMAService,
  deleteAllRMAsController,
  deleteAllRMAsService,
  deleteRMAController,
  getAllRMAsBulkController,
  getAllRMAsService,
  getRMAByIdController,
  getRMAByIdService,
  getQueriedRMAsByUserService,
  getQueriedRMAsController,
  getQueriedRMAsService,
  getQueriedRMAsByUserController,
  getQueriedTotalRMAsService,
  rmaRouter,
  updateRMAByIdController,
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
