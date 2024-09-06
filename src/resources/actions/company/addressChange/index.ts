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
  deleteAllAddressChangesController,
  deleteAnAddressChangeController,
  getAddressChangeByIdController,
  getAddressChangesByUserController,
  getQueriedAddressChangesController,
  updateAddressChangeByIdController,
} from "./addressChange.controller";

import type {
  AddressChangeDocument,
  AddressChangeSchema,
} from "./addressChange.model";

/**
 * Exports
 */
export {
  AddressChangeModel,
  addressChangeRouter,
  createNewAddressChangeController,
  deleteAllAddressChangesController,
  deleteAnAddressChangeController,
  getAddressChangeByIdController,
  getAddressChangesByUserController,
  getQueriedAddressChangesController,
  updateAddressChangeByIdController,
};

export type { AddressChangeDocument, AddressChangeSchema };
