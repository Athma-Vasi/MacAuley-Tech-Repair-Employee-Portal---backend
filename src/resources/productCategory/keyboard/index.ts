/**
 * This barrel file is used to import/export keyboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { keyboardRouter } from "./keyboard.routes";
import { KeyboardModel } from "./keyboard.model";

import type { KeyboardDocument, KeyboardSchema } from "./keyboard.model";

/**
 * Exports
 */

export { KeyboardModel, keyboardRouter };

export type { KeyboardDocument, KeyboardSchema };
