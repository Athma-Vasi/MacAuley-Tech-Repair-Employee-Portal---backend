/**
 * This barrel file is used to import/export desktopComputer router, model, types, controllers and services
 */

/**
 * Imports
 */
import { desktopComputerRouter } from "./desktopComputer.routes";
import { DesktopComputerModel } from "./desktopComputer.model";

import {
  createNewDesktopComputerBulkController,
  createNewDesktopComputerController,
  deleteADesktopComputerController,
  deleteAllDesktopComputersController,
  getDesktopComputerByIdController,
  getQueriedDesktopComputersController,
  updateDesktopComputerByIdController,
  updateDesktopComputersBulkController,
} from "./desktopComputer.controller";

import {
  createNewDesktopComputerService,
  deleteADesktopComputerService,
  deleteAllDesktopComputersService,
  getDesktopComputerByIdService,
  getQueriedDesktopComputersService,
  getQueriedTotalDesktopComputersService,
  returnAllDesktopComputersUploadedFileIdsService,
  updateDesktopComputerByIdService,
} from "./desktopComputer.service";

import type {
  DesktopComputerDocument,
  DesktopComputerSchema,
} from "./desktopComputer.model";
import type {
  CreateNewDesktopComputerBulkRequest,
  CreateNewDesktopComputerRequest,
  DeleteADesktopComputerRequest,
  DeleteAllDesktopComputersRequest,
  GetDesktopComputerByIdRequest,
  GetQueriedDesktopComputersRequest,
  UpdateDesktopComputerByIdRequest,
  UpdateDesktopComputersBulkRequest,
} from "./desktopComputer.types";

/**
 * Exports
 */

export {
  DesktopComputerModel,
  desktopComputerRouter,
  createNewDesktopComputerBulkController,
  createNewDesktopComputerController,
  createNewDesktopComputerService,
  deleteADesktopComputerController,
  deleteADesktopComputerService,
  deleteAllDesktopComputersController,
  deleteAllDesktopComputersService,
  getDesktopComputerByIdController,
  getDesktopComputerByIdService,
  getQueriedDesktopComputersController,
  getQueriedDesktopComputersService,
  getQueriedTotalDesktopComputersService,
  returnAllDesktopComputersUploadedFileIdsService,
  updateDesktopComputerByIdController,
  updateDesktopComputerByIdService,
  updateDesktopComputersBulkController,
};

export type {
  DesktopComputerDocument,
  DesktopComputerSchema,
  CreateNewDesktopComputerBulkRequest,
  CreateNewDesktopComputerRequest,
  DeleteADesktopComputerRequest,
  DeleteAllDesktopComputersRequest,
  GetDesktopComputerByIdRequest,
  GetQueriedDesktopComputersRequest,
  UpdateDesktopComputerByIdRequest,
  UpdateDesktopComputersBulkRequest,
};
