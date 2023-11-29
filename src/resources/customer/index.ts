/**
 * This barrel file is used to import/export customer model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CustomerModel } from "./customer.model";
import { customerRouter } from "./customer.routes";
import {
	createNewCustomerHandler,
	createNewCustomersBulkHandler,
	deleteCustomerHandler,
	getAllCustomersBulkHandler,
	getCustomerByIdHandler,
	getQueriedCustomersHandler,
	updateCustomerByIdHandler,
	updateCustomerFieldsBulkHandler,
	updateCustomerPasswordHandler,
} from "./customer.controller";
import {
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
	updateCustomerDocumentByIdService,
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
	checkCustomerExistsService,
	checkCustomerIsActiveService,
	checkCustomerPasswordService,
	createNewCustomerHandler,
	createNewCustomerService,
	createNewCustomersBulkHandler,
	customerRouter,
	deleteCustomerHandler,
	deleteCustomerService,
	getAllCustomersBulkHandler,
	getAllCustomersService,
	getCustomerByIdHandler,
	getCustomerByIdService,
	getCustomerByUsernameService,
	getCustomerWithPasswordService,
	getQueriedCustomersHandler,
	getQueriedCustomersService,
	getQueriedTotalCustomersService,
	updateCustomerByIdHandler,
	updateCustomerDocumentByIdService,
	updateCustomerFieldsBulkHandler,
	updateCustomerPasswordHandler,
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
