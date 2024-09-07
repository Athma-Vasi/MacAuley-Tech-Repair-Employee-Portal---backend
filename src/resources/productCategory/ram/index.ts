/**
 * This barrel file is used to import/export ram router, model, types, controllers and services
 */

/**
 * Imports
 */
import { ramRouter } from "./ram.routes";
import { RamModel } from "./ram.model";

import type { RamDocument, RamSchema } from "./ram.model";

/**
 * Exports
 */

export { RamModel, ramRouter };

export type { RamDocument, RamSchema };
