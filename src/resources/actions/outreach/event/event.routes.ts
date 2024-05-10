import { Router } from "express";
import {
  createNewEventController,
  getQueriedEventsController,
  getEventsByUserController,
  getEventByIdController,
  deleteEventController,
  deleteAllEventsController,
  updateEventByIdController,
  createNewEventsBulkController,
  updateEventsBulkController,
} from "./event.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import { createEventJoiSchema, updateEventJoiSchema } from "./event.validation";

const eventRouter = Router();

eventRouter
  .route("/")
  .get(getQueriedEventsController)
  .post(
    validateSchemaMiddleware(createEventJoiSchema, "eventSchema"),
    createNewEventController
  );

eventRouter.route("/delete-all").delete(deleteAllEventsController);

eventRouter.route("/user").get(getEventsByUserController);

// DEV ROUTES
eventRouter
  .route("/dev")
  .post(createNewEventsBulkController)
  .patch(updateEventsBulkController);

eventRouter
  .route("/:eventId")
  .get(getEventByIdController)
  .delete(deleteEventController)
  .patch(validateSchemaMiddleware(updateEventJoiSchema), updateEventByIdController);

export { eventRouter };
