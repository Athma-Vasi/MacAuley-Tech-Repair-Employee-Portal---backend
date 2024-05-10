/**
 * This barrel file is used to import/export referment model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RefermentModel } from "./referment.model";
import { refermentRouter } from "./referment.routes";
import {
  createNewRefermentController,
  createNewRefermentsBulkController,
  deleteAllRefermentsController,
  deleteRefermentController,
  getQueriedRefermentsController,
  getRefermentByIdController,
  getRefermentsByUserController,
  updateRefermentByIdController,
  updateRefermentsBulkController,
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
  createNewRefermentController,
  createNewRefermentService,
  createNewRefermentsBulkController,
  deleteAllRefermentsController,
  deleteAllRefermentsService,
  deleteRefermentController,
  deleteRefermentByIdService,
  getQueriedRefermentsByUserService,
  getQueriedRefermentsController,
  getQueriedRefermentsService,
  getQueriedTotalRefermentsService,
  getRefermentByIdController,
  getRefermentByIdService,
  getRefermentsByUserController,
  updateRefermentByIdService,
  updateRefermentByIdController,
  updateRefermentsBulkController,
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
