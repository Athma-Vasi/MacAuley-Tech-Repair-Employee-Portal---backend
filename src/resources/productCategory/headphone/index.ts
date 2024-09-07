/**
 * This barrel file is used to import/export headphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { headphoneRouter } from "./headphone.routes";
import { HeadphoneModel } from "./headphone.model";

import type { HeadphoneDocument, HeadphoneSchema } from "./headphone.model";

/**
 * Exports
 */

export { HeadphoneModel, headphoneRouter };

export type { HeadphoneDocument, HeadphoneSchema };
