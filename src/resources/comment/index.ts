/**
 * This barrel index file is used to import/export comment model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CommentModel } from "./comment.model";
import { commentRouter } from "./comment.routes";

import type { CommentDocument, CommentSchema } from "./comment.model";

/**
 * Exports
 */

export { CommentModel, commentRouter };

export type { CommentDocument, CommentSchema };
