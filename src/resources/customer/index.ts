/**
 * This barrel file is used to import/export customer model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CustomerModel } from './customer.model';
import { customerRouter } from './customer.routes';
import {
  createNewCustomerHandler,
  deleteCustomerHandler,
  getQueriedCustomersHandler,
  addFieldToCustomersBulkHandler,
  updateCustomerByIdHandler,
  updateCustomerPasswordHandler,
  getCustomerByIdHandler,
} from './customer.controller';
import {
  addFieldsToCustomersService,
  checkCustomerExistsService,
  checkCustomerIsActiveService,
  checkCustomerPasswordService,
  createNewCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  getCustomerByUsernameService,
  getCustomerWithPasswordService,
  getQueriedCustomersService,
  getQueriedTotalCustomersService,
  updateCustomerByIdService,
  updateCustomerPasswordService,
} from './customer.service';

import type { CustomerDocument, CustomerSchema } from './customer.model';
import type {
  AddFieldsToCustomersBulkRequest,
  CreateNewCustomerRequest,
  DeleteCustomerRequest,
  GetAllCustomersRequest,
  GetCustomerByIdRequest,
  GetCustomersDirectoryRequest,
  UpdateCustomerPasswordRequest,
  UpdateCustomerRequest,
} from './customer.types';

/**
 * Exports
 */

export {
  CustomerModel,
  customerRouter,
  createNewCustomerHandler,
  deleteCustomerHandler,
  getQueriedCustomersHandler,
  addFieldToCustomersBulkHandler,
  updateCustomerByIdHandler,
  updateCustomerPasswordHandler,
  getCustomerByIdHandler,
  addFieldsToCustomersService,
  checkCustomerExistsService,
  checkCustomerIsActiveService,
  checkCustomerPasswordService,
  createNewCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  getCustomerByUsernameService,
  getCustomerWithPasswordService,
  getQueriedCustomersService,
  getQueriedTotalCustomersService,
  updateCustomerByIdService,
  updateCustomerPasswordService,
};

export type {
  AddFieldsToCustomersBulkRequest,
  CreateNewCustomerRequest,
  DeleteCustomerRequest,
  GetAllCustomersRequest,
  GetCustomerByIdRequest,
  GetCustomersDirectoryRequest,
  UpdateCustomerPasswordRequest,
  UpdateCustomerRequest,
  CustomerDocument,
  CustomerSchema,
};
