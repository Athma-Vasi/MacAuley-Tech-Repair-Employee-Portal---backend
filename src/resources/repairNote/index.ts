/**
 * This barrel index file is used to import/export repairNote model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RepairNoteModel } from './repairNote.model';
import { repairNoteRouter } from './repairNote.routes';
import {
  createNewRepairNoteHandler,
  deleteRepairNoteByIdHandler,
  deleteAllRepairNotesHandler,
  getQueriedRepairNotesHandler,
  getRepairNoteByIdHandler,
  getQueriedRepairNotesByUserHandler,
  updateRepairNoteByIdHandler,
} from './repairNote.controller';
import {
  createNewRepairNoteService,
  getRepairNoteByIdService,
  deleteRepairNoteByIdService,
  deleteAllRepairNotesService,
  getQueriedRepairNotesService,
  getQueriedRepairNotesByUserService,
  updateRepairNoteByIdService,
  getQueriedTotalRepairNotesService,
} from './repairNote.service';

import type {
  RepairNoteDocument,
  RepairNoteSchema,
  RepairStatus,
  RequiredRepairs,
  PartsNeeded,
  RepairNoteInitialSchema,
  RepairNoteFinalSchema,
} from './repairNote.model';

import type {
  CreateNewRepairNoteRequest,
  DeleteARepairNoteRequest,
  DeleteAllRepairNotesRequest,
  GetRepairNoteByIdRequest,
  GetQueriedRepairNotesByUserRequest,
  UpdateRepairNoteByIdRequest,
  GetQueriedRepairNotesRequest,
} from './repairNote.types';

/**
 * Exports
 */

export {
  RepairNoteModel,
  repairNoteRouter,
  createNewRepairNoteHandler,
  deleteRepairNoteByIdHandler,
  deleteAllRepairNotesHandler,
  getQueriedRepairNotesHandler,
  getRepairNoteByIdHandler,
  getQueriedRepairNotesByUserHandler,
  updateRepairNoteByIdHandler,
  createNewRepairNoteService,
  getRepairNoteByIdService,
  deleteRepairNoteByIdService,
  deleteAllRepairNotesService,
  getQueriedRepairNotesService,
  getQueriedRepairNotesByUserService,
  updateRepairNoteByIdService,
  getQueriedTotalRepairNotesService,
};

export type {
  RepairNoteSchema,
  RepairNoteDocument,
  RequiredRepairs,
  PartsNeeded,
  RepairStatus,
  RepairNoteInitialSchema,
  RepairNoteFinalSchema,
  CreateNewRepairNoteRequest,
  DeleteARepairNoteRequest,
  DeleteAllRepairNotesRequest,
  GetRepairNoteByIdRequest,
  GetQueriedRepairNotesByUserRequest,
  UpdateRepairNoteByIdRequest,
  GetQueriedRepairNotesRequest,
};
