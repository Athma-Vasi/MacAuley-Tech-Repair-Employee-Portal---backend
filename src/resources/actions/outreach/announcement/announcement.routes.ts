import { Router } from "express";
import {
  createNewAnnouncementHandler,
  getQueriedAnnouncementsHandler,
  getAnnouncementsByUserHandler,
  getAnnouncementByIdHandler,
  deleteAnnouncementHandler,
  deleteAllAnnouncementsHandler,
  updateAnnouncementByIdHandler,
  createNewAnnouncementsBulkHandler,
  updateAnnouncementsBulkHandler,
} from "./announcement.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAnnouncementJoiSchema,
  updateAnnouncementJoiSchema,
} from "./announcement.validation";

const announcementRouter = Router();

announcementRouter
  .route("/")
  .get(getQueriedAnnouncementsHandler)
  .post(
    validateSchemaMiddleware(createAnnouncementJoiSchema, "announcementSchema"),
    createNewAnnouncementHandler
  );

announcementRouter.route("/delete-all").delete(deleteAllAnnouncementsHandler);

announcementRouter.route("/user").get(getAnnouncementsByUserHandler);

// DEV ROUTES
announcementRouter
  .route("/dev")
  .post(createNewAnnouncementsBulkHandler)
  .patch(updateAnnouncementsBulkHandler);

announcementRouter
  .route("/:announcementId")
  .get(getAnnouncementByIdHandler)
  .delete(deleteAnnouncementHandler)
  .patch(
    validateSchemaMiddleware(updateAnnouncementJoiSchema),
    updateAnnouncementByIdHandler
  );

export { announcementRouter };
