import { Router } from "express";
import {
  createNewAnnouncementHandler,
  getQueriedAnnouncementsHandler,
  getAnnouncementsByUserHandler,
  getAnnouncementByIdHandler,
  deleteAnnouncementHandler,
  deleteAllAnnouncementsHandler,
  updateAnnouncementStatusByIdHandler,
  createNewAnnouncementsBulkHandler,
  updateAnnouncementsBulkHandler,
} from "./announcement.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const announcementRouter = Router();

announcementRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedAnnouncementsHandler)
  .post(createNewAnnouncementHandler);

announcementRouter.route("/delete-all").delete(deleteAllAnnouncementsHandler);

announcementRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAnnouncementsByUserHandler);

// DEV ROUTES
announcementRouter
  .route("/dev")
  .post(createNewAnnouncementsBulkHandler)
  .patch(updateAnnouncementsBulkHandler);

announcementRouter
  .route("/:announcementId")
  .get(getAnnouncementByIdHandler)
  .delete(deleteAnnouncementHandler)
  .patch(updateAnnouncementStatusByIdHandler);

export { announcementRouter };
