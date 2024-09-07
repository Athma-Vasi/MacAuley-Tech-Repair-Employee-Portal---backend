/**
 * This barrel file is used to import/export storage router, model, types, controllers and services
 */

/**
 * Imports
 */
import { storageRouter } from "./storage.routes";
import { StorageModel } from "./storage.model";

import type { StorageDocument, StorageSchema } from "./storage.model";

/**
 * Exports
 */

export { StorageModel, storageRouter };

export type { StorageDocument, StorageSchema };
