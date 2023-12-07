/**
 * This barrel file is used to import/export announcement model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AnnouncementModel } from "./announcement.model";
import { announcementRouter } from "./announcement.routes";
import {
  createNewAnnouncementHandler,
  createNewAnnouncementsBulkHandler,
  deleteAllAnnouncementsHandler,
  deleteAnnouncementHandler,
  getAnnouncementByIdHandler,
  getAnnouncementsByUserHandler,
  getQueriedAnnouncementsHandler,
  updateAnnouncementByIdHandler,
  updateAnnouncementsBulkHandler,
} from "./announcement.controller";
import {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAllAnnouncementsService,
  deleteAnnouncementByIdService,
  getAnnouncementByIdService,
  getQueriedAnnouncementsByUserService,
  getQueriedAnnouncementsService,
  getQueriedTotalAnnouncementsService,
  updateAnnouncementByIdService,
} from "./announcement.service";

import type {
  AnnouncementDocument,
  AnnouncementSchema,
  RatingEmotion,
  RatingResponse,
} from "./announcement.model";
import type {
  CreateNewAnnouncementRequest,
  CreateNewAnnouncementsBulkRequest,
  DeleteAllAnnouncementsRequest,
  DeleteAnnouncementRequest,
  GetAnnouncementByIdRequest,
  GetQueriedAnnouncementsByUserRequest,
  GetQueriedAnnouncementsRequest,
  UpdateAnnouncementByIdRequest,
  UpdateAnnouncementsBulkRequest,
} from "./announcement.types";

/**
 * Exports
 */
export {
  AnnouncementModel,
  announcementRouter,
  checkAnnouncementExistsService,
  createNewAnnouncementHandler,
  createNewAnnouncementService,
  createNewAnnouncementsBulkHandler,
  deleteAllAnnouncementsHandler,
  deleteAllAnnouncementsService,
  deleteAnnouncementByIdService,
  deleteAnnouncementHandler,
  getAnnouncementByIdHandler,
  getAnnouncementByIdService,
  getAnnouncementsByUserHandler,
  getQueriedAnnouncementsByUserService,
  getQueriedAnnouncementsHandler,
  getQueriedAnnouncementsService,
  getQueriedTotalAnnouncementsService,
  updateAnnouncementByIdService,
  updateAnnouncementByIdHandler,
  updateAnnouncementsBulkHandler,
};

export type {
  AnnouncementSchema,
  AnnouncementDocument,
  RatingEmotion,
  RatingResponse,
  CreateNewAnnouncementRequest,
  CreateNewAnnouncementsBulkRequest,
  DeleteAllAnnouncementsRequest,
  DeleteAnnouncementRequest,
  GetAnnouncementByIdRequest,
  GetQueriedAnnouncementsByUserRequest,
  GetQueriedAnnouncementsRequest,
  UpdateAnnouncementByIdRequest,
  UpdateAnnouncementsBulkRequest,
};
