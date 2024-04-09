import { Router } from "express";
import {
  createNewEventHandler,
  getQueriedEventsHandler,
  getEventsByUserHandler,
  getEventByIdHandler,
  deleteEventHandler,
  deleteAllEventsHandler,
  updateEventByIdHandler,
  createNewEventsBulkHandler,
  updateEventsBulkHandler,
} from "./event.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import { createEventJoiSchema, updateEventJoiSchema } from "./event.validation";

const eventRouter = Router();

eventRouter
  .route("/")
  .get(getQueriedEventsHandler)
  .post(
    validateSchemaMiddleware(createEventJoiSchema, "eventSchema"),
    createNewEventHandler
  );

eventRouter.route("/delete-all").delete(deleteAllEventsHandler);

eventRouter.route("/user").get(getEventsByUserHandler);

// DEV ROUTES
eventRouter.route("/dev").post(createNewEventsBulkHandler).patch(updateEventsBulkHandler);

eventRouter
  .route("/:eventId")
  .get(getEventByIdHandler)
  .delete(deleteEventHandler)
  .patch(validateSchemaMiddleware(updateEventJoiSchema), updateEventByIdHandler);

export { eventRouter };
