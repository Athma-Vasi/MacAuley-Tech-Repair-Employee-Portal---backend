import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createAnnouncementJoiSchema,
  updateAnnouncementJoiSchema,
} from "./announcement.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { AnnouncementModel } from "./announcement.model";

const announcementRouter = Router();

announcementRouter
  .route("/")
  // @desc   Get all announcements
  // @route  GET api/v1/outreach/announcement
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(AnnouncementModel))
  // @desc   Create a new announcement
  // @route  POST api/v1/outreach/announcement
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createAnnouncementJoiSchema, "schema"),
    createNewResourceHandler(AnnouncementModel),
  );

// @desc   Delete many announcements
// @route  DELETE api/v1/outreach/announcement/delete-many
// @access Private/Admin/Manager
announcementRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(AnnouncementModel),
);

// @desc   Get all announcements by user
// @route  GET api/v1/outreach/announcement/user
// @access Private/Admin/Manager
announcementRouter.route("/user").get(
  getQueriedResourcesByUserHandler(AnnouncementModel),
);

announcementRouter
  .route("/:resourceId")
  // @desc   Get an announcement by its ID
  // @route  GET api/v1/outreach/announcement/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(AnnouncementModel))
  // @desc   Delete an announcement by its ID
  // @route  DELETE api/v1/outreach/announcement/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(AnnouncementModel))
  // @desc   Update an announcement by its ID
  // @route  PATCH api/v1/outreach/announcement/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateAnnouncementJoiSchema),
    updateResourceByIdHandler(AnnouncementModel),
  );

export { announcementRouter };
