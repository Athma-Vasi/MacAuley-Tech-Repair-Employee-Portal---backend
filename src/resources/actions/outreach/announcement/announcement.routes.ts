import { Router } from "express";
import {
  createNewAnnouncementController,
  getQueriedAnnouncementsController,
  getAnnouncementsByUserController,
  getAnnouncementByIdController,
  deleteAnnouncementController,
  deleteAllAnnouncementsController,
  updateAnnouncementByIdController,
  createNewAnnouncementsBulkController,
  updateAnnouncementsBulkController,
} from "./announcement.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAnnouncementJoiSchema,
  updateAnnouncementJoiSchema,
} from "./announcement.validation";

const announcementRouter = Router();

announcementRouter
  .route("/")
  .get(getQueriedAnnouncementsController)
  .post(
    validateSchemaMiddleware(createAnnouncementJoiSchema, "announcementSchema"),
    createNewAnnouncementController
  );

announcementRouter.route("/delete-all").delete(deleteAllAnnouncementsController);

announcementRouter.route("/user").get(getAnnouncementsByUserController);

// DEV ROUTES
announcementRouter
  .route("/dev")
  .post(createNewAnnouncementsBulkController)
  .patch(updateAnnouncementsBulkController);

announcementRouter
  .route("/:announcementId")
  .get(getAnnouncementByIdController)
  .delete(deleteAnnouncementController)
  .patch(
    validateSchemaMiddleware(updateAnnouncementJoiSchema),
    updateAnnouncementByIdController
  );

export { announcementRouter };
