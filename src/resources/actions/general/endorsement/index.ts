/**
 * this index file is used to import/export endorsement model, router, types, handlers and services
 */

/**
 * imports
 */
import { endorsementRouter } from "./endorsement.routes";
import { EndorsementModel } from "./endorsement.model";
import {
  createNewEndorsementController,
  createNewEndorsementsBulkController,
  deleteAllEndorsementsController,
  deleteEndorsementController,
  getEndorsementByIdController,
  getEndorsementsByUserController,
  getQueriedEndorsementsController,
  updateEndorsementByIdController,
  updateEndorsementsBulkController,
} from "./endorsement.controller";
import {
  createNewEndorsementService,
  deleteAllEndorsementsService,
  deleteEndorsementByIdService,
  getEndorsementByIdService,
  getQueriedEndorsementsByUserService,
  getQueriedEndorsementsService,
  getQueriedTotalEndorsementsService,
  updateEndorsementByIdService,
} from "./endorsement.service";

import type {
  EndorsementDocument,
  EndorsementSchema,
  EmployeeAttributes,
} from "./endorsement.model";
import type {
  CreateNewEndorsementRequest,
  CreateNewEndorsementsBulkRequest,
  DeleteAllEndorsementsRequest,
  DeleteEndorsementRequest,
  GetEndorsementByIdRequest,
  GetQueriedEndorsementsByUserRequest,
  GetQueriedEndorsementsRequest,
  UpdateEndorsementByIdRequest,
  UpdateEndorsementsBulkRequest,
} from "./endorsement.types";

/**
 * exports
 */
export {
  EndorsementModel,
  endorsementRouter,
  createNewEndorsementController,
  createNewEndorsementService,
  createNewEndorsementsBulkController,
  deleteAllEndorsementsController,
  deleteAllEndorsementsService,
  deleteEndorsementByIdService,
  deleteEndorsementController,
  getEndorsementByIdController,
  getEndorsementByIdService,
  getEndorsementsByUserController,
  getQueriedEndorsementsByUserService,
  getQueriedEndorsementsController,
  getQueriedEndorsementsService,
  getQueriedTotalEndorsementsService,
  updateEndorsementByIdService,
  updateEndorsementByIdController,
  updateEndorsementsBulkController,
};
export type {
  EndorsementDocument,
  EndorsementSchema,
  CreateNewEndorsementRequest,
  CreateNewEndorsementsBulkRequest,
  DeleteAllEndorsementsRequest,
  DeleteEndorsementRequest,
  GetEndorsementByIdRequest,
  GetQueriedEndorsementsByUserRequest,
  GetQueriedEndorsementsRequest,
  UpdateEndorsementByIdRequest,
  UpdateEndorsementsBulkRequest,
  EmployeeAttributes,
};
