/**
 * This barrel file is used to import/export desktopComputer router, model, types, controllers and services
 */

/**
 * Imports
 */
import { desktopComputerRouter } from './desktopComputer.routes';
import { DesktopComputerModel } from './desktopComputer.model';

import {
  createNewDesktopComputerBulkHandler,
  createNewDesktopComputerHandler,
  deleteADesktopComputerHandler,
  deleteAllDesktopComputersHandler,
  getDesktopComputerByIdHandler,
  getQueriedDesktopComputersHandler,
  returnAllFileUploadsForDesktopComputersHandler,
  updateDesktopComputerByIdHandler,
} from './desktopComputer.controller';

import {
  createNewDesktopComputerService,
  deleteAllDesktopComputersService,
  deleteADesktopComputerService,
  getDesktopComputerByIdService,
  getQueriedDesktopComputersService,
  getQueriedTotalDesktopComputersService,
  returnAllDesktopComputersUploadedFileIdsService,
  updateDesktopComputerByIdService,
} from './desktopComputer.service';

import type { DesktopComputerDocument, DesktopComputerSchema } from './desktopComputer.model';
import type {
  CreateNewDesktopComputerBulkRequest,
  CreateNewDesktopComputerRequest,
  DeleteADesktopComputerRequest,
  DeleteAllDesktopComputersRequest,
  GetDesktopComputerByIdRequest,
  GetQueriedDesktopComputersRequest,
  UpdateDesktopComputerByIdRequest,
} from './desktopComputer.types';

/**
 * Exports
 */

export {
  DesktopComputerModel,
  desktopComputerRouter,
  createNewDesktopComputerBulkHandler,
  createNewDesktopComputerHandler,
  createNewDesktopComputerService,
  deleteADesktopComputerHandler,
  deleteAllDesktopComputersHandler,
  deleteAllDesktopComputersService,
  deleteADesktopComputerService,
  getDesktopComputerByIdHandler,
  getDesktopComputerByIdService,
  getQueriedDesktopComputersHandler,
  getQueriedDesktopComputersService,
  getQueriedTotalDesktopComputersService,
  returnAllDesktopComputersUploadedFileIdsService,
  returnAllFileUploadsForDesktopComputersHandler,
  updateDesktopComputerByIdHandler,
  updateDesktopComputerByIdService,
};

export type {
  CreateNewDesktopComputerBulkRequest,
  CreateNewDesktopComputerRequest,
  DeleteADesktopComputerRequest,
  DeleteAllDesktopComputersRequest,
  GetDesktopComputerByIdRequest,
  GetQueriedDesktopComputersRequest,
  DesktopComputerDocument,
  DesktopComputerSchema,
  UpdateDesktopComputerByIdRequest,
};
