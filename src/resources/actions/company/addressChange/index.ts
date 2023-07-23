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
  getQueriedAddressChangesHandler,
} from './addressChange.controller';
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  getAddressChangeByIdService,
  getQueriedAddressChangesByUserService,
} from './addressChange.service';

import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';
import type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  GetQueriedAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  DeleteAllAddressChangesRequest,
  GetQueriedAddressChangesRequest,
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
  getQueriedAddressChangesHandler,
  getAddressChangeByIdHandler,
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
};

export type {
  AddressChangeDocument,
  AddressChangeSchema,
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  GetQueriedAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  DeleteAllAddressChangesRequest,
  GetQueriedAddressChangesRequest,
};
