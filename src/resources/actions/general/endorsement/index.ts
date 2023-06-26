/**
 * this index file is used to import/export endorsement model, router, types, handlers and services
 */

/**
 * imports
 */
import { endorsementRouter } from './endorsement.routes';
import { EndorsementModel } from './endorsement.model';

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
} from './endorsement.types';

/**
 * exports
 */
export { endorsementRouter, EndorsementModel };
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
};
