/**
 * this index file is used to import and export announcement resources
 */

/**
 * import all announcement resources
 */
import { AnnouncementModel } from './announcement.model';
import { announcementRouter } from './announcement.routes';
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

import type {
  AnnouncementDocument,
  AnnouncementSchema,
  RatingFeel,
  ArticleSections,
} from './announcement.model';
import type {
  CreateNewAnnouncementRequest,
  DeleteAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsFromUserIdRequest,
  GetAllAnnouncementsReturn,
} from './announcement.types';

/**
 * export all announcement resources
 */
export {
  AnnouncementModel,
  announcementRouter,
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
  ArticleSections,
  CreateNewAnnouncementRequest,
  DeleteAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsFromUserIdRequest,
  GetAllAnnouncementsReturn,
};
