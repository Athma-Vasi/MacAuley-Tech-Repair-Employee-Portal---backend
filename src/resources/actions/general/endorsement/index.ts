/**
 * this index file is used to import/export endorsement resources
 */

/**
 * import endorsement resources
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
} from './endorsement.types';

/**
 * export endorsement resources
 */
export { endorsementRouter, EndorsementModel };
export type {
  EndorsementDocument,
  EndorsementSchema,
  EmployeeAttributes,
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
};
