/**
 * This barrel file is used to import/export accessory router, model, types, controllers and services
 */

/**
 * Imports
 */
import { accessoryRouter } from "./accessory.routes";
import { AccessoryModel } from "./accessory.model";

import {
  createNewAccessoryBulkController,
  createNewAccessoryController,
  deleteAAccessoryController,
  deleteAllAccessoriesController,
  getAccessoryByIdController,
  getQueriedAccessoriesController,
  updateAccessoryByIdController,
} from "./accessory.controller";

import {
  createNewAccessoryService,
  deleteAllAccessoriesService,
  deleteAnAccessoryService,
  getAccessoryByIdService,
  getQueriedAccessoriesService,
  getQueriedTotalAccessoriesService,
  returnAllAccessoriesUploadedFileIdsService,
  updateAccessoryByIdService,
} from "./accessory.service";

import type { AccessoryDocument, AccessorySchema } from "./accessory.model";
import type {
  CreateNewAccessoryBulkRequest,
  CreateNewAccessoryRequest,
  DeleteAllAccessoriesRequest,
  DeleteAnAccessoryRequest,
  GetAccessoryByIdRequest,
  GetQueriedAccessoriesRequest,
  UpdateAccessoryByIdRequest,
} from "./accessory.types";

/**
 * Exports
 */
export {
  AccessoryModel,
  accessoryRouter,
  createNewAccessoryBulkController,
  createNewAccessoryController,
  createNewAccessoryService,
  deleteAAccessoryController,
  deleteAllAccessoriesController,
  deleteAllAccessoriesService,
  deleteAnAccessoryService,
  getAccessoryByIdController,
  getAccessoryByIdService,
  getQueriedAccessoriesController,
  getQueriedAccessoriesService,
  getQueriedTotalAccessoriesService,
  returnAllAccessoriesUploadedFileIdsService,
  updateAccessoryByIdController,
  updateAccessoryByIdService,
};

export type {
  AccessoryDocument,
  AccessorySchema,
  CreateNewAccessoryBulkRequest,
  CreateNewAccessoryRequest,
  DeleteAllAccessoriesRequest,
  DeleteAnAccessoryRequest,
  GetAccessoryByIdRequest,
  GetQueriedAccessoriesRequest,
  UpdateAccessoryByIdRequest,
};
