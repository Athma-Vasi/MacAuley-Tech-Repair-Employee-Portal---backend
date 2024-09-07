import { Router } from "express";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  createRepairTicketJoiSchema,
  updateRepairTicketJoiSchema,
} from "./repairTicket.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../handlers";
import { RepairTicketModel } from "./repairTicket.model";

const repairTicketRouter = Router();

repairTicketRouter
  .route("/")
  // @desc   Get all repairTickets
  // @route  GET api/v1/repair-ticket
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(RepairTicketModel))
  // @desc   Create a new repairTicket
  // @route  POST api/v1/repair-ticket
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createRepairTicketJoiSchema, "schema"),
    createNewResourceHandler(RepairTicketModel),
  );

// @desc   Delete all repairTickets
// @route  DELETE api/v1/repair-ticket/delete-all
// @access Private/Admin/Manager
repairTicketRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(RepairTicketModel),
);

// @desc   Get all repairTickets by user
// @route  GET api/v1/repair-ticket/user
// @access Private/Admin/Manager
repairTicketRouter.route("/user").get(
  getQueriedResourcesByUserHandler(RepairTicketModel),
);

repairTicketRouter
  .route("/:resourceId")
  // @desc   Get a repairTicket by its ID
  // @route  GET api/v1/repair-ticket/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(RepairTicketModel))
  // @desc   Delete a repairTicket by its ID
  // @route  DELETE api/v1/repair-ticket/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(RepairTicketModel))
  // @desc   Update a repairTicket by its ID
  // @route  PATCH api/v1/repair-ticket/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateRepairTicketJoiSchema),
    updateResourceByIdHandler(RepairTicketModel),
  );

export { repairTicketRouter };
