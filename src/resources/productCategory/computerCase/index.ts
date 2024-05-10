/**
 * This barrel file is used to import/export case router, model, types, controllers and services
 */

/**
 * Imports
 */
import { computerCaseRouter } from "./computerCase.routes";
import { ComputerCaseModel } from "./computerCase.model";

import {
  createNewComputerCaseBulkController,
  createNewComputerCaseController,
  deleteAComputerCaseController,
  deleteAllComputerCasesController,
  getComputerCaseByIdController,
  getQueriedComputerCasesController,
  updateComputerCaseByIdController,
  updateComputerCasesBulkController,
} from "./computerCase.controller";

import {
  createNewComputerCaseService,
  deleteAComputerCaseService,
  deleteAllComputerCasesService,
  getComputerCaseByIdService,
  getQueriedComputerCasesService,
  getQueriedTotalComputerCasesService,
  returnAllComputerCasesUploadedFileIdsService,
  updateComputerCaseByIdService,
} from "./computerCase.service";

import type { ComputerCaseDocument, ComputerCaseSchema } from "./computerCase.model";
import type {
  CreateNewComputerCaseBulkRequest,
  CreateNewComputerCaseRequest,
  DeleteAComputerCaseRequest,
  DeleteAllComputerCasesRequest,
  GetComputerCaseByIdRequest,
  GetQueriedComputerCasesRequest,
  UpdateComputerCaseByIdRequest,
  UpdateComputerCasesBulkRequest,
} from "./computerCase.types";

/**
 * Exports
 */

export {
  ComputerCaseModel,
  computerCaseRouter,
  createNewComputerCaseBulkController,
  createNewComputerCaseController,
  createNewComputerCaseService,
  deleteAComputerCaseController,
  deleteAComputerCaseService,
  deleteAllComputerCasesController,
  deleteAllComputerCasesService,
  getComputerCaseByIdController,
  getComputerCaseByIdService,
  getQueriedComputerCasesController,
  getQueriedComputerCasesService,
  getQueriedTotalComputerCasesService,
  returnAllComputerCasesUploadedFileIdsService,
  updateComputerCaseByIdController,
  updateComputerCaseByIdService,
  updateComputerCasesBulkController,
};

export type {
  ComputerCaseDocument,
  ComputerCaseSchema,
  CreateNewComputerCaseBulkRequest,
  CreateNewComputerCaseRequest,
  DeleteAComputerCaseRequest,
  DeleteAllComputerCasesRequest,
  GetComputerCaseByIdRequest,
  GetQueriedComputerCasesRequest,
  UpdateComputerCaseByIdRequest,
  UpdateComputerCasesBulkRequest,
};
