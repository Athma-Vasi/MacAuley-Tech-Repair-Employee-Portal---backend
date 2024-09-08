/**
 * This barrel file is used to import/export announcement model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AnnouncementModel } from "./announcement.model";
import { announcementRouter } from "./announcement.routes";

import type {
  AnnouncementDocument,
  AnnouncementSchema,
  RatingEmotion,
  RatingResponse,
} from "./announcement.model";

/**
 * Exports
 */
export { AnnouncementModel, announcementRouter };

export type {
  AnnouncementDocument,
  AnnouncementSchema,
  RatingEmotion,
  RatingResponse,
};
