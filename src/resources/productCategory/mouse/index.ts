/**
 * This barrel file is used to import/export mouse router, model, types, controllers and services
 */

/**
 * Imports
 */
import { mouseRouter } from "./mouse.routes";
import { MouseModel } from "./mouse.model";

import type { MouseDocument, MouseSchema } from "./mouse.model";

/**
 * Exports
 */

export { MouseModel, mouseRouter };

export type { MouseDocument, MouseSchema };
