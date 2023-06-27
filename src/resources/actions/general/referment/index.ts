/**
 * This index file is used to import/export referment model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RefermentModel } from './referment.model';
import { refermentRouter } from './referment.routes';

import type { RefermentDocument, RefermentSchema } from './referment.model';
import type {
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetARefermentRequest,
  GetAllRefermentsRequest,
  GetRefermentsByUserRequest,
  RefermentsServerResponse,
  UpdateRefermentRequest,
} from './referment.types';

/**
 * Exports
 */
export { RefermentModel, refermentRouter };
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
  UpdateRefermentRequest,
};
