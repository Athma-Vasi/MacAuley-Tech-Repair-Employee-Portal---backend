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
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  createRepairTicketJoiSchema,
  updateRepairTicketJoiSchema,
} from "./repairTicket.validation";

const repairTicketRouter = Router();
repairTicketRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

repairTicketRouter
  .route("/")
  .get(getQueriedRepairTicketsHandler)
  .post(
    validateSchemaMiddleware(createRepairTicketJoiSchema, "repairTicketSchema"),
    createNewRepairTicketHandler
  );

repairTicketRouter.route("/delete-all").delete(deleteAllRepairTicketsHandler);

repairTicketRouter.route("/user").get(getRepairTicketsByUserHandler);

// DEV ROUTES
repairTicketRouter
  .route("/dev")
  .post(createNewRepairTicketsBulkHandler)
  .patch(updateRepairTicketsBulkHandler);

// regular routes
repairTicketRouter
  .route("/:repairTicketId")
  .get(getRepairTicketByIdHandler)
  .delete(deleteRepairTicketHandler)
  .patch(
    validateSchemaMiddleware(updateRepairTicketJoiSchema),
    updateRepairTicketByIdHandler
  );

export { repairTicketRouter };
