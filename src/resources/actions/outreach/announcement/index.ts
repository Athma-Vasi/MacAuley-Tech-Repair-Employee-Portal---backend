/**
 * This barrel file is used to import/export announcement model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AnnouncementModel } from "./announcement.model";
import { announcementRouter } from "./announcement.routes";
import {
  createNewAnnouncementController,
  createNewAnnouncementsBulkController,
  deleteAllAnnouncementsController,
  deleteAnnouncementController,
  getAnnouncementByIdController,
  getAnnouncementsByUserController,
  getQueriedAnnouncementsController,
  updateAnnouncementByIdController,
  updateAnnouncementsBulkController,
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
  createNewAnnouncementController,
  createNewAnnouncementService,
  createNewAnnouncementsBulkController,
  deleteAllAnnouncementsController,
  deleteAllAnnouncementsService,
  deleteAnnouncementByIdService,
  deleteAnnouncementController,
  getAnnouncementByIdController,
  getAnnouncementByIdService,
  getAnnouncementsByUserController,
  getQueriedAnnouncementsByUserService,
  getQueriedAnnouncementsController,
  getQueriedAnnouncementsService,
  getQueriedTotalAnnouncementsService,
  updateAnnouncementByIdService,
  updateAnnouncementByIdController,
  updateAnnouncementsBulkController,
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
