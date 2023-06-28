/**
 * This index file is used to import/export addressChange model, router, types, handlers and services
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
  getAllAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAnAddressChangeHandler,
} from './addressChange.controller';
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAllAddressChangesService,
  getAddressChangeByIdService,
  getAddressChangesByUserService,
} from './addressChange.service';

import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';
import type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  GetAllAddressChangesRequest,
  GetAddressChangesByUserRequest,
  GetAnAddressChangeRequest,
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
  getAllAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAnAddressChangeHandler,
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAllAddressChangesService,
  getAddressChangeByIdService,
  getAddressChangesByUserService,
};

export type {
  AddressChangeDocument,
  AddressChangeSchema,
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  GetAllAddressChangesRequest,
  GetAddressChangesByUserRequest,
  GetAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  AddressChangeServerResponse,
};
