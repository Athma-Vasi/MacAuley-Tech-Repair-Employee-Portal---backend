/**
 * This barrel file is used to import/export addressChange model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AddressChangeModel } from './addressChange.model';
import { addressChangeRouter } from './addressChange.routes';
import {
  createNewAddressChangeHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  getQueriedAddressChangeHandler,
} from './addressChange.controller';
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getQueriedAddressChangesService,
  getAddressChangeByIdService,
  getAddressChangesByUserService,
} from './addressChange.service';

import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';
import type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  QueriedAddressChangesServerResponse,
  GetAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  DeleteAllAddressChangesRequest,
  AddressChangeServerResponse,
} from './addressChange.types';

/**
 * Exports
 */
export {
  AddressChangeModel,
  addressChangeRouter,
  createNewAddressChangeHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
  getAddressChangesByUserHandler,
  getQueriedAddressChangeHandler,
  getAddressChangeByIdHandler,
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getAddressChangesByUserService,
  getQueriedAddressChangesService,
};

export type {
  AddressChangeDocument,
  AddressChangeSchema,
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  QueriedAddressChangesServerResponse,
  GetAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  DeleteAllAddressChangesRequest,
  AddressChangeServerResponse,
};
