import { Router } from "express";
import {
  createNewRepairNoteHandler,
  getQueriedRepairNotesHandler,
  getRepairNotesByUserHandler,
  getRepairNoteByIdHandler,
  deleteRepairNoteHandler,
  deleteAllRepairNotesHandler,
  updateRepairNoteStatusByIdHandler,
  createNewRepairNotesBulkHandler,
  updateRepairNotesBulkHandler,
} from "./repairNote.controller";
import { assignQueryDefaults } from "../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const repairNoteRouter = Router();

repairNoteRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRepairNotesHandler)
  .post(createNewRepairNoteHandler);

repairNoteRouter.route("/delete-all").delete(deleteAllRepairNotesHandler);

repairNoteRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getRepairNotesByUserHandler);

// DEV ROUTES
repairNoteRouter
  .route("/dev")
  .post(createNewRepairNotesBulkHandler)
  .patch(updateRepairNotesBulkHandler);

repairNoteRouter
  .route("/:repairNoteId")
  .get(getRepairNoteByIdHandler)
  .delete(deleteRepairNoteHandler)
  .patch(updateRepairNoteStatusByIdHandler);

export { repairNoteRouter };
