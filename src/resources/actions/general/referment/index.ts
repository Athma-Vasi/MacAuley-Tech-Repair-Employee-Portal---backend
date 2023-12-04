/**
 * This barrel file is used to import/export referment model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RefermentModel } from "./referment.model";
import { refermentRouter } from "./referment.routes";
import {
  createNewRefermentHandler,
  createNewRefermentsBulkHandler,
  deleteAllRefermentsHandler,
  deleteRefermentHandler,
  getQueriedRefermentsHandler,
  getRefermentByIdHandler,
  getRefermentsByUserHandler,
  updateRefermentStatusByIdHandler,
  updateRefermentsBulkHandler,
} from "./referment.controller";
import {
  createNewRefermentService,
  deleteAllRefermentsService,
  deleteRefermentByIdService,
  getQueriedRefermentsByUserService,
  getQueriedRefermentsService,
  getQueriedTotalRefermentsService,
  getRefermentByIdService,
  updateRefermentByIdService,
} from "./referment.service";

import type { RefermentDocument, RefermentSchema } from "./referment.model";
import type {
  CreateNewRefermentRequest,
  CreateNewRefermentsBulkRequest,
  DeleteAllRefermentsRequest,
  DeleteRefermentRequest,
  GetQueriedRefermentsByUserRequest,
  GetQueriedRefermentsRequest,
  GetRefermentByIdRequest,
  UpdateRefermentByIdRequest,
  UpdateRefermentsBulkRequest,
} from "./referment.types";

/**
 * Exports
 */
export {
  RefermentModel,
  refermentRouter,
  createNewRefermentHandler,
  createNewRefermentService,
  createNewRefermentsBulkHandler,
  deleteAllRefermentsHandler,
  deleteAllRefermentsService,
  deleteRefermentHandler,
  deleteRefermentByIdService,
  getQueriedRefermentsByUserService,
  getQueriedRefermentsHandler,
  getQueriedRefermentsService,
  getQueriedTotalRefermentsService,
  getRefermentByIdHandler,
  getRefermentByIdService,
  getRefermentsByUserHandler,
  updateRefermentByIdService,
  updateRefermentStatusByIdHandler,
  updateRefermentsBulkHandler,
};
export type {
  RefermentSchema,
  RefermentDocument,
  CreateNewRefermentRequest,
  CreateNewRefermentsBulkRequest,
  DeleteAllRefermentsRequest,
  DeleteRefermentRequest,
  GetQueriedRefermentsByUserRequest,
  GetQueriedRefermentsRequest,
  GetRefermentByIdRequest,
  UpdateRefermentByIdRequest,
  UpdateRefermentsBulkRequest,
};
