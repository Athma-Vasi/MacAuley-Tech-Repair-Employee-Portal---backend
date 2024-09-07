/**
 * This barrel file is used to import/export display router, model, types, controllers and services
 */

/**
 * Imports
 */
import { displayRouter } from "./display.routes";
import { DisplayModel } from "./display.model";

import type { DisplayDocument, DisplaySchema } from "./display.model";

/**
 * Exports
 */

export { DisplayModel, displayRouter };

export type { DisplayDocument, DisplaySchema };
