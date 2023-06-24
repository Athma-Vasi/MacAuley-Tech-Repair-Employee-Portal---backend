/**
 * this index file is used to import and export announcement resource
 */

/**
 * import all announcement resource
 */
import { AnnouncementModel } from './announcement.model';
import {
  getAllAnnouncementsHandler,
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  updateAnnouncementHandler,
  getAnnouncementsFromUserIdHandler,
} from './announcement.controller';

import { AnnouncementDocument, AnnouncementSchema, RatingFeel } from './announcement.model';
import type {
  CreateNewAnnouncementRequest,
  DeleteAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsFromUserIdRequest,
  GetAllAnnouncementsReturn,
} from './announcement.types';

/**
 * export all announcement resource
 */
export {
  AnnouncementModel,
  getAllAnnouncementsHandler,
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  updateAnnouncementHandler,
  getAnnouncementsFromUserIdHandler,
};

export type {
  AnnouncementDocument,
  AnnouncementSchema,
  RatingFeel,
  CreateNewAnnouncementRequest,
  DeleteAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsFromUserIdRequest,
  GetAllAnnouncementsReturn,
};
