/**
 * This barrel index file is used to import/export repairTicket model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RepairTicketModel } from "./repairTicket.model";
import { repairTicketRouter } from "./repairTicket.routes";
import {
  createNewRepairTicketController,
  createNewRepairTicketsBulkController,
  deleteAllRepairTicketsController,
  deleteRepairTicketController,
  getQueriedRepairTicketsController,
  getRepairTicketByIdController,
  getRepairTicketsByUserController,
  updateRepairTicketByIdController,
  updateRepairTicketsBulkController,
} from "./repairTicket.controller";
import {
  createNewRepairTicketService,
  deleteAllRepairTicketsService,
  deleteRepairTicketByIdService,
  getQueriedRepairTicketsByUserService,
  getQueriedRepairTicketsService,
  getQueriedTotalRepairTicketsService,
  getRepairTicketByIdService,
  updateRepairTicketByIdService,
} from "./repairTicket.service";

import type {
  RepairTicketDocument,
  RepairTicketSchema,
  RepairStatus,
  RequiredRepairs,
  PartsNeeded,
  RepairTicketInitialSchema,
  RepairTicketFinalSchema,
} from "./repairTicket.model";

import type {
  CreateNewRepairTicketRequest,
  CreateNewRepairTicketsBulkRequest,
  DeleteAllRepairTicketsRequest,
  DeleteRepairTicketRequest,
  GetQueriedRepairTicketsByParentResourceIdRequest,
  GetQueriedRepairTicketsByUserRequest,
  GetQueriedRepairTicketsRequest,
  GetRepairTicketByIdRequest,
  UpdateRepairTicketByIdRequest,
  UpdateRepairTicketsBulkRequest,
} from "./repairTicket.types";

/**
 * Exports
 */

export {
  RepairTicketModel,
  repairTicketRouter,
  createNewRepairTicketController,
  createNewRepairTicketsBulkController,
  deleteAllRepairTicketsController,
  deleteRepairTicketController,
  getQueriedRepairTicketsController,
  getRepairTicketByIdController,
  getRepairTicketsByUserController,
  updateRepairTicketByIdController,
  updateRepairTicketsBulkController,
  createNewRepairTicketService,
  deleteAllRepairTicketsService,
  deleteRepairTicketByIdService,
  getQueriedRepairTicketsByUserService,
  getQueriedRepairTicketsService,
  getQueriedTotalRepairTicketsService,
  getRepairTicketByIdService,
  updateRepairTicketByIdService,
};

export type {
  RepairTicketDocument,
  RepairTicketSchema,
  RepairStatus,
  RequiredRepairs,
  PartsNeeded,
  RepairTicketInitialSchema,
  RepairTicketFinalSchema,
  CreateNewRepairTicketRequest,
  CreateNewRepairTicketsBulkRequest,
  DeleteAllRepairTicketsRequest,
  DeleteRepairTicketRequest,
  GetQueriedRepairTicketsByParentResourceIdRequest,
  GetQueriedRepairTicketsByUserRequest,
  GetQueriedRepairTicketsRequest,
  GetRepairTicketByIdRequest,
  UpdateRepairTicketByIdRequest,
  UpdateRepairTicketsBulkRequest,
};
