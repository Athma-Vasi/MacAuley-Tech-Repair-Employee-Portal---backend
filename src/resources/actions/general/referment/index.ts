/**
 * This barrel file is used to import/export referment model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RefermentModel } from './referment.model';
import { refermentRouter } from './referment.routes';
import {
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
  getARefermentByIdHandler,
  getQueriedRefermentsHandler,
  getQueriedRefermentsByUserHandler,
  updateRefermentStatusByIdHandler,
} from './referment.controller';
import {
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
  deleteAllRefermentsService,
  getRefermentByIdService,
  getQueriedRefermentsService,
  getQueriedRefermentsByUserService,
  updateRefermentStatusByIdService,
} from './referment.service';

import type { RefermentDocument, RefermentSchema } from './referment.model';
import type {
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetRefermentRequestById,
  GetQueriedRefermentsRequest,
  GetQueriedRefermentsByUserRequest,
  UpdateRefermentStatusByIdRequest,
} from './referment.types';

/**
 * Exports
 */
export {
  RefermentModel,
  refermentRouter,
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
  getARefermentByIdHandler,
  getQueriedRefermentsHandler,
  getQueriedRefermentsByUserHandler,
  updateRefermentStatusByIdHandler,
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
  deleteAllRefermentsService,
  getRefermentByIdService,
  getQueriedRefermentsService,
  getQueriedRefermentsByUserService,
  updateRefermentStatusByIdService,
};
export type {
  RefermentDocument,
  RefermentSchema,
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetRefermentRequestById,
  GetQueriedRefermentsRequest,
  GetQueriedRefermentsByUserRequest,
  UpdateRefermentStatusByIdRequest,
};
