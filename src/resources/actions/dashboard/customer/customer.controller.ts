import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  UpdateCustomerRequest,
  UpdateCustomerPasswordRequest,
  GetCustomersDirectoryRequest,
  GetCustomerByIdRequest,
  GetAllCustomersRequest,
  DeleteCustomerRequest,
  CreateNewCustomerRequest,
  AddFieldsToCustomersBulkRequest,
} from './customer.types';

import {
  addFieldsToCustomersService,
  checkCustomerExistsService,
  checkCustomerPasswordService,
  createNewCustomerService,
  deleteCustomerService,
  getQueriedTotalCustomersService,
  getQueriedCustomersService,
  getCustomerByIdService,
  updateCustomerByIdService,
  updateCustomerPasswordService,
} from './customer.service';
import { CustomerDocument, CustomerSchema } from './customer.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';
import { removeUndefinedAndNullValues } from '../../../../utils';

// @desc   Create new user
// @route  POST /api/v1/actions/dashboard/customer
// @access Private
const createNewCustomerHandler = expressAsyncHandler(
  async (
    request: CreateNewCustomerRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const { customerSchema } = request.body;
    const { email, address, username } = customerSchema;
    const { province, state } = address;

    // both state and province cannot be undefined (one is required)
    if (!state && !province) {
      response.status(400).json({
        message: 'State or Province is required',
        resourceData: [],
      });
      return;
    }

    // check for duplicate email
    const isDuplicateEmail = await checkCustomerExistsService({ email });
    if (isDuplicateEmail) {
      response.status(409).json({ message: 'Email already exists', resourceData: [] });
      return;
    }

    // check for duplicate username
    const isDuplicateCustomer = await checkCustomerExistsService({ username });
    if (isDuplicateCustomer) {
      response.status(409).json({ message: 'Customername already exists', resourceData: [] });
      return;
    }

    // create new user if all checks pass successfully
    const customerDocument: CustomerDocument = await createNewCustomerService(customerSchema);
    if (!customerDocument) {
      response.status(400).json({ message: 'Customer creation failed', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: `Customer ${username} created successfully`,
      resourceData: [customerDocument],
    });
  }
);

// DEV ROUTE
// @desc   Add field to all customers
// @route  PATCH /api/v1/actions/dashboard/customer/dev/add-field
// @access Private
const addFieldToCustomersBulkHandler = expressAsyncHandler(
  async (
    request: AddFieldsToCustomersBulkRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const { customerFields } = request.body;

    const updatedCustomers = await Promise.all(
      customerFields.map(async ({ customerId, fields }) => {
        const updatedCustomer = await addFieldsToCustomersService({
          fields,
          userId: customerId,
        });

        return updatedCustomer;
      })
    );

    // filter out undefined values
    const updatedCustomersFiltered = updatedCustomers.filter(removeUndefinedAndNullValues);

    // check if any customers were updated
    if (updatedCustomersFiltered.length === customerFields.length) {
      response.status(201).json({
        message: `Successfully updated ${updatedCustomersFiltered.length} customers`,
        resourceData: updatedCustomersFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully updated ${
          updatedCustomersFiltered.length
        } customer(s), but failed to update ${
          customerFields.length - updatedCustomersFiltered.length
        } customer(s)`,
        resourceData: updatedCustomersFiltered,
      });
    }
  }
);

// @desc   Get all customers
// @route  GET /api/v1/actions/dashboard/customer
// @access Private
const getQueriedCustomersHandler = expressAsyncHandler(
  async (
    request: GetAllCustomersRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CustomerDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCustomersService({
        filter: filter as FilterQuery<CustomerDocument> | undefined,
      });
    }

    // get all customers
    const customers = await getQueriedCustomersService({
      filter: filter as FilterQuery<CustomerDocument> | undefined,
      projection: projection as QueryOptions<CustomerDocument>,
      options: options as QueryOptions<CustomerDocument>,
    });
    if (!customers.length) {
      response.status(200).json({
        message: 'No customers that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found customers',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: customers,
    });
  }
);

// @desc   Get a customer by id
// @route  GET /api/v1/actions/dashboard/customer/:id
// @access Private
const getCustomerByIdHandler = expressAsyncHandler(
  async (
    request: GetCustomerByIdRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const { customerId } = request.params;

    const customer = await getCustomerByIdService(customerId);

    if (!customer) {
      response.status(404).json({ message: 'Customer not found.', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Successfully found customer data!', resourceData: [customer] });
  }
);

// @desc   Delete a customer
// @route  DELETE /api/v1/actions/dashboard/customer
// @access Private
const deleteCustomerHandler = expressAsyncHandler(
  async (
    request: DeleteCustomerRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    // only managers/admin are allowed to delete customers
    const { customerToBeDeletedId } = request.body;

    if (!customerToBeDeletedId) {
      response.status(400).json({ message: 'customerToBeDeletedId is required', resourceData: [] });
      return;
    }

    // delete customer if all checks pass successfully
    const deletedCustomer = await deleteCustomerService(customerToBeDeletedId);

    if (!deletedCustomer.acknowledged) {
      response
        .status(400)
        .json({ message: 'Failed to delete customer. Please try again!', resourceData: [] });
      return;
    }

    response.status(200).json({ message: 'Successfully deleted customer!', resourceData: [] });
  }
);

// @desc   Update a customer
// @route  PATCH /api/v1/actions/dashboard/customer
// @access Private
const updateCustomerByIdHandler = expressAsyncHandler(
  async (
    request: UpdateCustomerRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const {
      userInfo: { userId },
      customerFields,
    } = request.body;

    // update user if all checks pass successfully
    const updatedCustomer = await updateCustomerByIdService({
      userId,
      customerFields,
    });

    if (!updatedCustomer) {
      response.status(400).json({ message: 'Customer update failed', resourceData: [] });
      return;
    }

    response.status(200).json({
      message: `Customer ${updatedCustomer.username} updated successfully`,
      resourceData: [updatedCustomer],
    });
  }
);

// @desc   update customer password
// @route  PATCH /api/v1/actions/dashboard/customer/password
// @access Private
const updateCustomerPasswordHandler = expressAsyncHandler(
  async (
    request: UpdateCustomerPasswordRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const {
      userInfo: { userId },
      currentPassword,
      newPassword,
    } = request.body;

    // check if current password is correct
    const isCurrentPasswordCorrect = await checkCustomerPasswordService({
      userId,
      password: currentPassword,
    });
    if (!isCurrentPasswordCorrect) {
      response.status(400).json({ message: 'Current password is incorrect', resourceData: [] });
      return;
    }

    // check if new password is the same as current password
    if (currentPassword === newPassword) {
      response
        .status(400)
        .json({ message: 'New password cannot be the same as current password', resourceData: [] });
      return;
    }

    // update user password if all checks pass successfully
    const updatedCustomer = await updateCustomerPasswordService({ userId, newPassword });

    if (!updatedCustomer) {
      response.status(400).json({ message: 'Password update failed', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Password updated successfully', resourceData: [updatedCustomer] });
  }
);

export {
  addFieldToCustomersBulkHandler,
  createNewCustomerHandler,
  deleteCustomerHandler,
  getQueriedCustomersHandler,
  getCustomerByIdHandler,
  updateCustomerByIdHandler,
  updateCustomerPasswordHandler,
};
