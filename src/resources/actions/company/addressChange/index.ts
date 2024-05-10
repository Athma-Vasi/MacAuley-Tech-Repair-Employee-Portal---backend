/**
 * This barrel file is used to import/export addressChange model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AddressChangeModel } from "./addressChange.model";
import { addressChangeRouter } from "./addressChange.routes";
import {
  createNewAddressChangeController,
  createNewAddressChangesBulkController,
  deleteAllAddressChangesController,
  deleteAnAddressChangeController,
  getAddressChangeByIdController,
  getAddressChangesByUserController,
  getQueriedAddressChangesController,
  updateAddressChangeByIdController,
  updateAddressChangesBulkController,
} from "./addressChange.controller";
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  updateAddressChangeByIdService,
} from "./addressChange.service";

import type { AddressChangeDocument, AddressChangeSchema } from "./addressChange.model";
import type {
  CreateNewAddressChangeRequest,
  CreateNewAddressChangesBulkRequest,
  DeleteAllAddressChangesRequest,
  DeleteAnAddressChangeRequest,
  GetAddressChangeByIdRequest,
  GetQueriedAddressChangesByUserRequest,
  GetQueriedAddressChangesRequest,
  UpdateAddressChangeByIdRequest,
  UpdateAddressChangesBulkRequest,
} from "./addressChange.types";

/**
 * Exports
 */
export {
  AddressChangeModel,
  addressChangeRouter,
  createNewAddressChangeController,
  createNewAddressChangeService,
  createNewAddressChangesBulkController,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesController,
  deleteAllAddressChangesService,
  deleteAnAddressChangeController,
  getAddressChangeByIdController,
  getAddressChangeByIdService,
  getAddressChangesByUserController,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesController,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  updateAddressChangeByIdService,
  updateAddressChangeByIdController,
  updateAddressChangesBulkController,
};

export type {
  AddressChangeDocument,
  AddressChangeSchema,
  CreateNewAddressChangeRequest,
  CreateNewAddressChangesBulkRequest,
  DeleteAllAddressChangesRequest,
  DeleteAnAddressChangeRequest,
  GetAddressChangeByIdRequest,
  GetQueriedAddressChangesByUserRequest,
  GetQueriedAddressChangesRequest,
  UpdateAddressChangeByIdRequest,
  UpdateAddressChangesBulkRequest,
};
