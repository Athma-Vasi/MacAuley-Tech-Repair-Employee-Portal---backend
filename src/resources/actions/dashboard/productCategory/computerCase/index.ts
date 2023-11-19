/**
 * This barrel file is used to import/export computerCase router, model, types, controllers and services
 */

/**
 * Imports
 */
import { computerCaseRouter } from './computerCase.routes';
import { ComputerCaseModel } from './computerCase.model';

import {
  createNewComputerCaseBulkHandler,
  createNewComputerCaseHandler,
  deleteAComputerCaseHandler,
  deleteAllComputerCasesHandler,
  getComputerCaseByIdHandler,
  getQueriedComputerCasesHandler,
  returnAllFileUploadsForComputerCasesHandler,
  updateComputerCaseByIdHandler,
} from './computerCase.controller';

import {
  createNewComputerCaseService,
  deleteAllComputerCasesService,
  deleteAComputerCaseService,
  getComputerCaseByIdService,
  getQueriedComputerCasesService,
  getQueriedTotalComputerCasesService,
  returnAllComputerCasesUploadedFileIdsService,
  updateComputerCaseByIdService,
} from './computerCase.service';

import type { ComputerCaseDocument, ComputerCaseSchema } from './computerCase.model';
import type {
  CreateNewComputerCaseBulkRequest,
  CreateNewComputerCaseRequest,
  DeleteAComputerCaseRequest,
  DeleteAllComputerCasesRequest,
  GetComputerCaseByIdRequest,
  GetQueriedComputerCasesRequest,
  UpdateComputerCaseByIdRequest,
} from './computerCase.types';

/**
 * Exports
 */

export {
  ComputerCaseModel,
  computerCaseRouter,
  createNewComputerCaseBulkHandler,
  createNewComputerCaseHandler,
  createNewComputerCaseService,
  deleteAComputerCaseHandler,
  deleteAllComputerCasesHandler,
  deleteAllComputerCasesService,
  deleteAComputerCaseService,
  getComputerCaseByIdHandler,
  getComputerCaseByIdService,
  getQueriedComputerCasesHandler,
  getQueriedComputerCasesService,
  getQueriedTotalComputerCasesService,
  returnAllComputerCasesUploadedFileIdsService,
  returnAllFileUploadsForComputerCasesHandler,
  updateComputerCaseByIdHandler,
  updateComputerCaseByIdService,
};

export type {
  CreateNewComputerCaseBulkRequest,
  CreateNewComputerCaseRequest,
  DeleteAComputerCaseRequest,
  DeleteAllComputerCasesRequest,
  GetComputerCaseByIdRequest,
  GetQueriedComputerCasesRequest,
  ComputerCaseDocument,
  ComputerCaseSchema,
  UpdateComputerCaseByIdRequest,
};
