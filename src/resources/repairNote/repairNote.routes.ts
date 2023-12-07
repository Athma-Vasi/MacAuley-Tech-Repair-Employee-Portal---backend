import { Router } from "express";
import {
  createNewRepairNoteHandler,
  getQueriedRepairNotesHandler,
  getRepairNotesByUserHandler,
  getRepairNoteByIdHandler,
  deleteRepairNoteHandler,
  deleteAllRepairNotesHandler,
  updateRepairNoteByIdHandler,
  createNewRepairNotesBulkHandler,
  updateRepairNotesBulkHandler,
} from "./repairNote.controller";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const repairNoteRouter = Router();
repairNoteRouter.use(
  verifyJWTMiddleware,
  verifyRoles(),
  assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS)
);

repairNoteRouter
  .route("/")
  .get(getQueriedRepairNotesHandler)
  .post(createNewRepairNoteHandler);

repairNoteRouter.route("/delete-all").delete(deleteAllRepairNotesHandler);

repairNoteRouter.route("/user").get(getRepairNotesByUserHandler);

// DEV ROUTES
repairNoteRouter
  .route("/dev")
  .post(createNewRepairNotesBulkHandler)
  .patch(updateRepairNotesBulkHandler);

repairNoteRouter
  .route("/:repairNoteId")
  .get(getRepairNoteByIdHandler)
  .delete(deleteRepairNoteHandler)
  .patch(updateRepairNoteByIdHandler);

export { repairNoteRouter };
