/**
 * this index file is used to import/export endorsement model, router, types, handlers and services
 */

/**
 * imports
 */
import { endorsementRouter } from "./endorsement.routes";
import { EndorsementModel } from "./endorsement.model";

import type {
  EmployeeAttributes,
  EndorsementDocument,
  EndorsementSchema,
} from "./endorsement.model";

/**
 * exports
 */
export { EndorsementModel, endorsementRouter };

export type { EmployeeAttributes, EndorsementDocument, EndorsementSchema };
