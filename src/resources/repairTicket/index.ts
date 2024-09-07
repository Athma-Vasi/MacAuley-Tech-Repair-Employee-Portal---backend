/**
 * This barrel index file is used to import/export repairTicket model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RepairTicketModel } from "./repairTicket.model";
import { repairTicketRouter } from "./repairTicket.routes";

import type {
  PartsNeeded,
  RepairStatus,
  RepairTicketDocument,
  RepairTicketFinalSchema,
  RepairTicketInitialSchema,
  RepairTicketSchema,
  RequiredRepairs,
} from "./repairTicket.model";

/**
 * Exports
 */

export { RepairTicketModel, repairTicketRouter };

export type {
  PartsNeeded,
  RepairStatus,
  RepairTicketDocument,
  RepairTicketFinalSchema,
  RepairTicketInitialSchema,
  RepairTicketSchema,
  RequiredRepairs,
};
