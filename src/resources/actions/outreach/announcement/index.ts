/**
 * This barrel file is used to import/export announcement model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AnnouncementModel } from './announcement.model';
import { announcementRouter } from './announcement.routes';
import {
  getQueriedAnnouncementsHandler,
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  updateAnnouncementHandler,
  getQueriedAnouncementsByUserHandler,
} from './announcement.controller';
import {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAnnouncementService,
  getQueriedAnnouncementsService,
  getQueriedAnouncementsByUserService,
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
  DeleteAnAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
} from './announcement.types';

/**
 * Exports
 */
export {
  AnnouncementModel,
  announcementRouter,
  getQueriedAnnouncementsHandler,
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  updateAnnouncementHandler,
  getQueriedAnouncementsByUserHandler,
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAnnouncementService,
  getQueriedAnnouncementsService,
  getQueriedAnouncementsByUserService,
  updateAnnouncementService,
};

export type {
  AnnouncementDocument,
  AnnouncementSchema,
  RatingFeel,
  ArticleSections,
  CreateNewAnnouncementRequest,
  DeleteAnAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
};
