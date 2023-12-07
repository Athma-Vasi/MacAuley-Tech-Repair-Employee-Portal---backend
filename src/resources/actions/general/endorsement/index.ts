/**
 * this index file is used to import/export endorsement model, router, types, handlers and services
 */

/**
 * imports
 */
import { endorsementRouter } from "./endorsement.routes";
import { EndorsementModel } from "./endorsement.model";
import {
  createNewEndorsementHandler,
  createNewEndorsementsBulkHandler,
  deleteAllEndorsementsHandler,
  deleteEndorsementHandler,
  getEndorsementByIdHandler,
  getEndorsementsByUserHandler,
  getQueriedEndorsementsHandler,
  updateEndorsementByIdHandler,
  updateEndorsementsBulkHandler,
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
  createNewEndorsementHandler,
  createNewEndorsementService,
  createNewEndorsementsBulkHandler,
  deleteAllEndorsementsHandler,
  deleteAllEndorsementsService,
  deleteEndorsementByIdService,
  deleteEndorsementHandler,
  getEndorsementByIdHandler,
  getEndorsementByIdService,
  getEndorsementsByUserHandler,
  getQueriedEndorsementsByUserService,
  getQueriedEndorsementsHandler,
  getQueriedEndorsementsService,
  getQueriedTotalEndorsementsService,
  updateEndorsementByIdService,
  updateEndorsementByIdHandler,
  updateEndorsementsBulkHandler,
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
