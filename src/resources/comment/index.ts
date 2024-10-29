/**
 * This barrel index file is used to import/export comment model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CommentModel } from "./model";
import { commentRouter } from "./routes";

import type { CommentDocument, CommentSchema } from "./model";

/**
 * Exports
 */

export { CommentModel, commentRouter };

export type { CommentDocument, CommentSchema };
