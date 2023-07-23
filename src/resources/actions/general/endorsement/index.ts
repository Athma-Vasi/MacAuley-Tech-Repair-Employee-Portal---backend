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
  getQueriedEndorsementsHandler,
  getAnEndorsementHandler,
  getQueriedEndorsementsByUserHandler,
  updateAnEndorsementHandler,
} from './endorsement.controller';
import {
  createNewEndorsementService,
  deleteEndorsementService,
  deleteAllEndorsementsService,
  getQueriedEndorsementsService,
  getAnEndorsementService,
  getQueriedEndorsementsByUserService,
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
  GetQueriedEndorsementsRequest,
  GetAnEndorsementRequest,
  GetQueriedEndorsementsByUserRequest,
  DeleteAllEndorsementsRequest,
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
  getQueriedEndorsementsHandler,
  getAnEndorsementHandler,
  getQueriedEndorsementsByUserHandler,
  updateAnEndorsementHandler,
  createNewEndorsementService,
  deleteEndorsementService,
  deleteAllEndorsementsService,
  getQueriedEndorsementsService,
  getAnEndorsementService,
  getQueriedEndorsementsByUserService,
  updateAnEndorsementService,
};
export type {
  EndorsementDocument,
  EndorsementSchema,
  EmployeeAttributes,
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  DeleteAllEndorsementsRequest,
  GetQueriedEndorsementsRequest,
  GetAnEndorsementRequest,
  GetQueriedEndorsementsByUserRequest,
  UpdateAnEndorsementRequest,
};
