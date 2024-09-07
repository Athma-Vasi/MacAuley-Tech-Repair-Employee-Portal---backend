/**
 * This barrel file is used to import/export motherboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { motherboardRouter } from "./motherboard.routes";
import { MotherboardModel } from "./motherboard.model";

import type {
  MotherboardDocument,
  MotherboardSchema,
} from "./motherboard.model";

/**
 * Exports
 */

export { MotherboardModel, motherboardRouter };

export type { MotherboardDocument, MotherboardSchema };
