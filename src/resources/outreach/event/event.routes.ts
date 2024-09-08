import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createEventJoiSchema, updateEventJoiSchema } from "./event.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { EventModel } from "./event.model";

const eventRouter = Router();

eventRouter
  .route("/")
  // @desc   Get all events
  // @route  GET api/v1/outreach/event
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(EventModel))
  // @desc   Create a new event
  // @route  POST api/v1/outreach/event
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createEventJoiSchema, "schema"),
    createNewResourceHandler(EventModel),
  );

// @desc   Delete many events
// @route  DELETE api/v1/outreach/event/delete-many
// @access Private/Admin/Manager
eventRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(EventModel),
);

// @desc   Get all events by user
// @route  GET api/v1/outreach/event/user
// @access Private/Admin/Manager
eventRouter.route("/user").get(
  getQueriedResourcesByUserHandler(EventModel),
);

eventRouter
  .route("/:resourceId")
  // @desc   Get an event by its ID
  // @route  GET api/v1/outreach/event/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(EventModel))
  // @desc   Delete an event by its ID
  // @route  DELETE api/v1/outreach/event/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(EventModel))
  // @desc   Update an event by its ID
  // @route  PATCH api/v1/outreach/event/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateEventJoiSchema),
    updateResourceByIdHandler(EventModel),
  );

export { eventRouter };
