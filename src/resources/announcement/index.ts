/**
 * This index file is used to import/export announcement model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AnnouncementModel } from './announcement.model';
import { announcementRouter } from './announcement.routes';
import {
  getAllAnnouncementsHandler,
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  updateAnnouncementHandler,
  getAnnouncementsByUserHandler,
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
  DeleteAnAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
  AnnouncementsServerResponse,
} from './announcement.types';

/**
 * Exports
 */
export {
  AnnouncementModel,
  announcementRouter,
  getAllAnnouncementsHandler,
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  updateAnnouncementHandler,
  getAnnouncementsByUserHandler,
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
  DeleteAnAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
  AnnouncementsServerResponse,
};
