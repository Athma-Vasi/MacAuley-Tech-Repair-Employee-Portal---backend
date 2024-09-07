/**
 * This barrel file is used to import/export accessory router, model, types, controllers and services
 */

/**
 * Imports
 */
import { accessoryRouter } from "./accessory.routes";
import { AccessoryModel } from "./accessory.model";

import type { AccessoryDocument, AccessorySchema } from "./accessory.model";

/**
 * Exports
 */
export { AccessoryModel, accessoryRouter };

export type { AccessoryDocument, AccessorySchema };
