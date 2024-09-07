/**
 * This barrel file is used to import/export psu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { psuRouter } from "./psu.routes";
import { PsuModel } from "./psu.model";

import type { PsuDocument, PsuSchema } from "./psu.model";

/**
 * Exports
 */

export { PsuModel, psuRouter };

export type { PsuDocument, PsuSchema };
