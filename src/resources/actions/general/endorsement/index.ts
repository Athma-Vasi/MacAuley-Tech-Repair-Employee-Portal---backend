/**
 * this index file is used to import/export endorsement model, router, types, handlers and services
 */

/**
 * imports
 */
import { endorsementRouter } from './endorsement.routes';
import { EndorsementModel } from './endorsement.model';
import {
  createNewEndorsementHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  getAllEndorsementsHandler,
  getAnEndorsementHandler,
  getEndorsementsByUserHandler,
  updateAnEndorsementHandler,
} from './endorsement.controller';
import {
  createNewEndorsementService,
  deleteEndorsementService,
  deleteAllEndorsementsService,
  getAllEndorsementsService,
  getAnEndorsementService,
  getEndorsementsByUserService,
  updateAnEndorsementService,
} from './endorsement.service';

import type {
  EndorsementDocument,
  EndorsementSchema,
  EmployeeAttributes,
} from './endorsement.model';
import type {
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
  DeleteAllEndorsementsRequest,
  EndorsementsServerResponse,
  UpdateAnEndorsementRequest,
} from './endorsement.types';

/**
 * exports
 */
export {
  endorsementRouter,
  EndorsementModel,
  createNewEndorsementHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  getAllEndorsementsHandler,
  getAnEndorsementHandler,
  getEndorsementsByUserHandler,
  updateAnEndorsementHandler,
  createNewEndorsementService,
  deleteEndorsementService,
  deleteAllEndorsementsService,
  getAllEndorsementsService,
  getAnEndorsementService,
  getEndorsementsByUserService,
  updateAnEndorsementService,
};
export type {
  EndorsementDocument,
  EndorsementSchema,
  EmployeeAttributes,
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  DeleteAllEndorsementsRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
  EndorsementsServerResponse,
  UpdateAnEndorsementRequest,
};
