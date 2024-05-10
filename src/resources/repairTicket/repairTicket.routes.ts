import { Router } from "express";
import {
  createNewRepairTicketController,
  getQueriedRepairTicketsController,
  getRepairTicketsByUserController,
  getRepairTicketByIdController,
  deleteRepairTicketController,
  deleteAllRepairTicketsController,
  updateRepairTicketByIdController,
  createNewRepairTicketsBulkController,
  updateRepairTicketsBulkController,
} from "./repairTicket.controller";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  createRepairTicketJoiSchema,
  updateRepairTicketJoiSchema,
} from "./repairTicket.validation";

const repairTicketRouter = Router();
repairTicketRouter.use(verifyJWTMiddleware, verifyRoles, assignQueryDefaults);

repairTicketRouter
  .route("/")
  .get(getQueriedRepairTicketsController)
  .post(
    validateSchemaMiddleware(createRepairTicketJoiSchema, "repairTicketSchema"),
    createNewRepairTicketController
  );

repairTicketRouter.route("/delete-all").delete(deleteAllRepairTicketsController);

repairTicketRouter.route("/user").get(getRepairTicketsByUserController);

// DEV ROUTES
repairTicketRouter
  .route("/dev")
  .post(createNewRepairTicketsBulkController)
  .patch(updateRepairTicketsBulkController);

// regular routes
repairTicketRouter
  .route("/:repairTicketId")
  .get(getRepairTicketByIdController)
  .delete(deleteRepairTicketController)
  .patch(
    validateSchemaMiddleware(updateRepairTicketJoiSchema),
    updateRepairTicketByIdController
  );

export { repairTicketRouter };
