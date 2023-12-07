/**
 * This barrel file is used to import/export addressChange model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AddressChangeModel } from "./addressChange.model";
import { addressChangeRouter } from "./addressChange.routes";
import {
  createNewAddressChangeHandler,
  createNewAddressChangesBulkHandler,
  deleteAllAddressChangesHandler,
  deleteAnAddressChangeHandler,
  getAddressChangeByIdHandler,
  getAddressChangesByUserHandler,
  getQueriedAddressChangesHandler,
  updateAddressChangeByIdHandler,
  updateAddressChangesBulkHandler,
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
  createNewAddressChangeHandler,
  createNewAddressChangeService,
  createNewAddressChangesBulkHandler,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesHandler,
  deleteAllAddressChangesService,
  deleteAnAddressChangeHandler,
  getAddressChangeByIdHandler,
  getAddressChangeByIdService,
  getAddressChangesByUserHandler,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesHandler,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  updateAddressChangeByIdService,
  updateAddressChangeByIdHandler,
  updateAddressChangesBulkHandler,
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
