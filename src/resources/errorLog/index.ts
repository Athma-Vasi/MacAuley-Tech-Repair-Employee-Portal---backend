/**
 * This barrel file is used to import/export errorLog model, router, types, handlers and services
 */

/**
 * Imports
 */
import { ErrorLogModel } from "./errorLog.model";
import { errorLogRouter } from "./errorLog.routes";

import type { ErrorLogDocument, ErrorLogSchema } from "./errorLog.model";

/**
 * Exports
 */
export { ErrorLogModel, errorLogRouter };

export type { ErrorLogDocument, ErrorLogSchema };
