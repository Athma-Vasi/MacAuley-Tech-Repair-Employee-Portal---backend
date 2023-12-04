import { Router } from "express";
import {
  createNewEventHandler,
  getQueriedEventsHandler,
  getEventsByUserHandler,
  getEventByIdHandler,
  deleteEventHandler,
  deleteAllEventsHandler,
  updateEventStatusByIdHandler,
  createNewEventsBulkHandler,
  updateEventsBulkHandler,
} from "./event.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const eventRouter = Router();

eventRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedEventsHandler)
  .post(createNewEventHandler);

eventRouter.route("/delete-all").delete(deleteAllEventsHandler);

eventRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getEventsByUserHandler);

// DEV ROUTES
eventRouter.route("/dev").post(createNewEventsBulkHandler).patch(updateEventsBulkHandler);

eventRouter
  .route("/:eventId")
  .get(getEventByIdHandler)
  .delete(deleteEventHandler)
  .patch(updateEventStatusByIdHandler);

export { eventRouter };
