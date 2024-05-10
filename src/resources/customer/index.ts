/**
 * This barrel file is used to import/export customer model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CustomerModel } from "./customer.model";
import { customerRouter } from "./customer.routes";
import {
  createNewCustomerController,
  createNewCustomersBulkController,
  deleteCustomerController,
  getAllCustomersBulkController,
  getCustomerByIdController,
  getQueriedCustomersController,
  updateCustomerByIdController,
  updateCustomerFieldsBulkController,
  updateCustomerPasswordController,
} from "./customer.controller";
import {
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
} from "./customer.service";

import type { CustomerDocument, CustomerSchema } from "./customer.model";
import type {
  CreateNewCustomerRequest,
  CreateNewCustomersBulkRequest,
  DeleteCustomerRequest,
  GetAllCustomersBulkRequest,
  GetAllCustomersRequest,
  GetCustomerByIdRequest,
  UpdateCustomerFieldsBulkRequest,
  UpdateCustomerPasswordRequest,
  UpdateCustomerRequest,
} from "./customer.types";

/**
 * Exports
 */

export {
  CustomerModel,
  checkCustomerIsActiveService,
  checkCustomerPasswordService,
  createNewCustomerController,
  createNewCustomerService,
  createNewCustomersBulkController,
  customerRouter,
  deleteCustomerController,
  deleteCustomerService,
  getAllCustomersBulkController,
  getAllCustomersService,
  getCustomerByIdController,
  getCustomerByIdService,
  getCustomerByUsernameService,
  getCustomerWithPasswordService,
  getQueriedCustomersController,
  getQueriedCustomersService,
  getQueriedTotalCustomersService,
  updateCustomerByIdController,
  updateCustomerByIdService,
  updateCustomerFieldsBulkController,
  updateCustomerPasswordController,
  updateCustomerPasswordService,
};

export type {
  UpdateCustomerRequest,
  UpdateCustomerPasswordRequest,
  UpdateCustomerFieldsBulkRequest,
  GetCustomerByIdRequest,
  GetAllCustomersRequest,
  GetAllCustomersBulkRequest,
  DeleteCustomerRequest,
  CustomerSchema,
  CustomerDocument,
  CreateNewCustomersBulkRequest,
  CreateNewCustomerRequest,
};
