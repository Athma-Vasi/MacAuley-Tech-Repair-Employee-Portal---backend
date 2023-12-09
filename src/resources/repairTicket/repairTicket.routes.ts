import { Router } from "express";
import {
  createNewRepairTicketHandler,
  getQueriedRepairTicketsHandler,
  getRepairTicketsByUserHandler,
  getRepairTicketByIdHandler,
  deleteRepairTicketHandler,
  deleteAllRepairTicketsHandler,
  updateRepairTicketByIdHandler,
  createNewRepairTicketsBulkHandler,
  updateRepairTicketsBulkHandler,
} from "./repairTicket.controller";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const repairTicketRouter = Router();
repairTicketRouter.use(
  verifyJWTMiddleware,
  verifyRoles(),
  assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS)
);

repairTicketRouter
  .route("/")
  .get(getQueriedRepairTicketsHandler)
  .post(createNewRepairTicketHandler);

repairTicketRouter.route("/delete-all").delete(deleteAllRepairTicketsHandler);

repairTicketRouter.route("/user").get(getRepairTicketsByUserHandler);

// DEV ROUTES
repairTicketRouter
  .route("/dev")
  .post(createNewRepairTicketsBulkHandler)
  .patch(updateRepairTicketsBulkHandler);

repairTicketRouter
  .route("/:repairTicketId")
  .get(getRepairTicketByIdHandler)
  .delete(deleteRepairTicketHandler)
  .patch(updateRepairTicketByIdHandler);

export { repairTicketRouter };
