/**
 * This barrel file is used to import/export case router, model, types, controllers and services
 */

/**
 * Imports
 */
import { computerCaseRouter } from "./computerCase.routes";
import { ComputerCaseModel } from "./computerCase.model";

import type {
  ComputerCaseDocument,
  ComputerCaseSchema,
} from "./computerCase.model";

/**
 * Exports
 */

export { ComputerCaseModel, computerCaseRouter };

export type { ComputerCaseDocument, ComputerCaseSchema };
