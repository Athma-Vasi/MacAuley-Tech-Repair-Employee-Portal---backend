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

import {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAnnouncementService,
  getAllAnnouncementsService,
  getAnnouncementsByUserService,
  updateAnnouncementService,
} from './announcement.service';

import type { AnnouncementDocument, AnnouncementSchema, RatingFeel } from './announcement.model';
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
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAnnouncementService,
  getAllAnnouncementsService,
  getAnnouncementsByUserService,
  updateAnnouncementService,
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
