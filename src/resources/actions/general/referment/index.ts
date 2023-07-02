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
  getARefermentHandler,
  getAllRefermentsHandler,
  getRefermentsByUserHandler,
  updateARefermentHandler,
} from './referment.controller';
import {
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
  deleteAllRefermentsService,
  getARefermentService,
  getAllRefermentsService,
  getRefermentsByUserService,
  updateARefermentService,
} from './referment.service';

import type { RefermentDocument, RefermentSchema } from './referment.model';
import type {
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetARefermentRequest,
  GetAllRefermentsRequest,
  GetRefermentsByUserRequest,
  RefermentsServerResponse,
  UpdateARefermentRequest,
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
  getARefermentHandler,
  getAllRefermentsHandler,
  getRefermentsByUserHandler,
  updateARefermentHandler,
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
  deleteAllRefermentsService,
  getARefermentService,
  getAllRefermentsService,
  getRefermentsByUserService,
  updateARefermentService,
};
export type {
  RefermentDocument,
  RefermentSchema,
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetARefermentRequest,
  GetAllRefermentsRequest,
  GetRefermentsByUserRequest,
  RefermentsServerResponse,
  UpdateARefermentRequest,
};
