/**
 * This barrel index file is used to import/export repairNote model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RepairNoteModel } from "./repairNote.model";
import { repairNoteRouter } from "./repairNote.routes";
import {
  createNewRepairNoteHandler,
  createNewRepairNotesBulkHandler,
  deleteAllRepairNotesHandler,
  deleteRepairNoteHandler,
  getQueriedRepairNotesHandler,
  getRepairNoteByIdHandler,
  getRepairNotesByUserHandler,
  updateRepairNoteStatusByIdHandler,
  updateRepairNotesBulkHandler,
} from "./repairNote.controller";
import {
  createNewRepairNoteService,
  deleteAllRepairNotesService,
  deleteRepairNoteByIdService,
  getQueriedRepairNotesByUserService,
  getQueriedRepairNotesService,
  getQueriedTotalRepairNotesService,
  getRepairNoteByIdService,
  updateRepairNoteByIdService,
} from "./repairNote.service";

import type {
  RepairNoteDocument,
  RepairNoteSchema,
  RepairStatus,
  RequiredRepairs,
  PartsNeeded,
  RepairNoteInitialSchema,
  RepairNoteFinalSchema,
} from "./repairNote.model";

import type {
  CreateNewRepairNoteRequest,
  CreateNewRepairNotesBulkRequest,
  DeleteAllRepairNotesRequest,
  DeleteRepairNoteRequest,
  GetQueriedRepairNotesByParentResourceIdRequest,
  GetQueriedRepairNotesByUserRequest,
  GetQueriedRepairNotesRequest,
  GetRepairNoteByIdRequest,
  UpdateRepairNoteByIdRequest,
  UpdateRepairNotesBulkRequest,
} from "./repairNote.types";

/**
 * Exports
 */

export {
  RepairNoteModel,
  repairNoteRouter,
  createNewRepairNoteHandler,
  createNewRepairNotesBulkHandler,
  deleteAllRepairNotesHandler,
  deleteRepairNoteHandler,
  getQueriedRepairNotesHandler,
  getRepairNoteByIdHandler,
  getRepairNotesByUserHandler,
  updateRepairNoteStatusByIdHandler,
  updateRepairNotesBulkHandler,
  createNewRepairNoteService,
  deleteAllRepairNotesService,
  deleteRepairNoteByIdService,
  getQueriedRepairNotesByUserService,
  getQueriedRepairNotesService,
  getQueriedTotalRepairNotesService,
  getRepairNoteByIdService,
  updateRepairNoteByIdService,
};

export type {
  RepairNoteDocument,
  RepairNoteSchema,
  RepairStatus,
  RequiredRepairs,
  PartsNeeded,
  RepairNoteInitialSchema,
  RepairNoteFinalSchema,
  CreateNewRepairNoteRequest,
  CreateNewRepairNotesBulkRequest,
  DeleteAllRepairNotesRequest,
  DeleteRepairNoteRequest,
  GetQueriedRepairNotesByParentResourceIdRequest,
  GetQueriedRepairNotesByUserRequest,
  GetQueriedRepairNotesRequest,
  GetRepairNoteByIdRequest,
  UpdateRepairNoteByIdRequest,
  UpdateRepairNotesBulkRequest,
};
