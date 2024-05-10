import expressAsyncController from "express-async-handler";

import type { NextFunction, Response } from "express";
import type {
  UpdateCustomerRequest,
  UpdateCustomerPasswordRequest,
  GetCustomerByIdRequest,
  GetAllCustomersRequest,
  DeleteCustomerRequest,
  CreateNewCustomerRequest,
  UpdateCustomerFieldsBulkRequest,
  CreateNewCustomersBulkRequest,
  GetAllCustomersBulkRequest,
} from "./customer.types";

import {
  checkCustomerPasswordService,
  createNewCustomerService,
  deleteCustomerService,
  getQueriedTotalCustomersService,
  getQueriedCustomersService,
  getCustomerByIdService,
  updateCustomerPasswordService,
  getAllCustomersService,
  updateCustomerByIdService,
  getCustomerDocWithPaymentInfoService,
  deleteAllCustomersService,
} from "./customer.service";
import { CustomerDocument, CustomerSchema } from "./customer.model";
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../types";
import { FilterQuery, QueryOptions } from "mongoose";
import { filterFieldsFromObject, removeUndefinedAndNullValues } from "../../utils";

import {
  checkEmailExistsService,
  checkUsernameExistsService,
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
} from "../usernameEmailSet";
import createHttpError from "http-errors";

// @desc   Create new user
// @route  POST /api/v1/customer
// @access Private
const createNewCustomerController = expressAsyncController(
  async (
    request: CreateNewCustomerRequest,
    response: Response<
      ResourceRequestServerResponse<
        CustomerDocument,
        "password" | "paymentInformation" | "__v"
      >
    >,
    next: NextFunction
  ) => {
    const { customerSchema } = request.body;
    const { email, address, username } = customerSchema;
    const { province, state } = address;

    if (!state && !province) {
      return next(new createHttpError.BadRequest("State or Province is required"));
    }

    const isDuplicateEmail = await checkEmailExistsService({ email: { $in: [email] } });
    if (isDuplicateEmail) {
      return next(new createHttpError.Conflict("Email already exists"));
    }

    const isDuplicateUser = await checkUsernameExistsService({
      username: {
        $in: [username],
      },
    });
    if (isDuplicateUser) {
      return next(new createHttpError.Conflict("Username already exists"));
    }

    const customerDocument: CustomerDocument = await createNewCustomerService(
      customerSchema
    );
    if (!customerDocument) {
      return next(new createHttpError.InternalServerError("Customer creation failed"));
    }

    const updatedUsernameEmailSet = await Promise.all([
      updateUsernameEmailSetWithUsernameService(username),
      updateUsernameEmailSetWithEmailService(email),
    ]);
    if (updatedUsernameEmailSet.some((value) => !value)) {
      return next(new createHttpError.InternalServerError("Customer creation failed"));
    }

    const filteredCustomerDocument = filterFieldsFromObject<
      CustomerDocument,
      "password" | "paymentInformation" | "__v"
    >({
      object: customerDocument,
      fieldsToFilter: ["password", "paymentInformation", "__v"],
    });

    response.status(201).json({
      message: `Customer ${username} created successfully`,
      resourceData: [filteredCustomerDocument],
    });
  }
);

// DEV ROUTE
// @desc   create new customers in bulk
// @route  POST /api/v1/customer/dev
// @access Private
const createNewCustomersBulkController = expressAsyncController(
  async (
    request: CreateNewCustomersBulkRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const { customerSchemas } = request.body;

    const customerDocuments = await Promise.all(
      customerSchemas.map(async (customerSchema) => {
        const { email, address, username } = customerSchema;
        const { province, state } = address;

        if (!state && !province) {
          response.status(400).json({
            message: "State or Province is required",
            resourceData: [],
          });
          return;
        }

        const isDuplicateEmail = await checkEmailExistsService({
          email: { $in: [email] },
        });
        if (isDuplicateEmail) {
          response
            .status(409)
            .json({ message: "Email already exists", resourceData: [] });
          return;
        }

        const isDuplicateUser = await checkUsernameExistsService({
          username: {
            $in: [username],
          },
        });
        if (isDuplicateUser) {
          response
            .status(409)
            .json({ message: "Username already exists", resourceData: [] });
          return;
        }

        const customerDocument: CustomerDocument = await createNewCustomerService(
          customerSchema
        );

        const updatedUsernameEmailSet = await Promise.all([
          updateUsernameEmailSetWithUsernameService(username),
          updateUsernameEmailSetWithEmailService(email),
        ]);
        if (updatedUsernameEmailSet.some((value) => !value)) {
          response
            .status(400)
            .json({ message: "Customer creation failed", resourceData: [] });
          return;
        }

        return customerDocument;
      })
    );

    const customerDocumentsFiltered = customerDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (customerDocumentsFiltered.length === customerSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${customerDocumentsFiltered.length} customers`,
        resourceData: customerDocumentsFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully created ${
          customerDocumentsFiltered.length
        } customer(s), but failed to create ${
          customerSchemas.length - customerDocumentsFiltered.length
        } customer(s)`,
        resourceData: customerDocumentsFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   Update customer fields in bulk
// @route  PATCH /api/v1/customer/dev
// @access Private
const updateCustomerFieldsBulkController = expressAsyncController(
  async (
    request: UpdateCustomerFieldsBulkRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const { customerFields } = request.body;

    const updatedCustomers = await Promise.all(
      customerFields.map(async (customerField) => {
        const {
          customerId,
          documentUpdate: { fields, updateOperator },
        } = customerField;

        const updatedCustomer = await updateCustomerByIdService({
          fields,
          updateOperator,
          _id: customerId,
        });

        return updatedCustomer;
      })
    );

    const updatedCustomersFiltered = updatedCustomers.filter(
      removeUndefinedAndNullValues
    );

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

// DEV ROUTE
// @desc   get all customers bulk (no filter, projection or options)
// @route  GET /api/v1/customer/dev
// @access Private
const getAllCustomersBulkController = expressAsyncController(
  async (
    _request: GetAllCustomersBulkRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const customers = await getAllCustomersService(["-password"]);

    if (!customers.length) {
      response.status(200).json({
        message: "Unable to find any customers",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found customers!",
      resourceData: customers,
    });
  }
);

// @desc   Get all customers
// @route  GET /api/v1/customer
// @access Private
const getQueriedCustomersController = expressAsyncController(
  async (
    request: GetAllCustomersRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<
        CustomerDocument,
        "password" | "paymentInformation"
      >
    >
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCustomersService({
        filter: filter as FilterQuery<CustomerDocument> | undefined,
      });
    }

    const customers = await getQueriedCustomersService({
      filter: filter as FilterQuery<CustomerDocument> | undefined,
      projection: projection as QueryOptions<CustomerDocument>,
      options: options as QueryOptions<CustomerDocument>,
    });
    if (!customers.length) {
      response.status(200).json({
        message: "No customers that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found customers",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: customers,
    });
  }
);

// @desc   Get a customer by id
// @route  GET /api/v1/customer/:id
// @access Private
const getCustomerByIdController = expressAsyncController(
  async (
    request: GetCustomerByIdRequest,
    response: Response<
      ResourceRequestServerResponse<CustomerDocument, "password" | "paymentInformation">
    >,
    next: NextFunction
  ) => {
    const { customerId } = request.params;

    const customer = await getCustomerByIdService(customerId);
    if (!customer) {
      return next(new createHttpError.NotFound("Customer not found"));
    }

    response.status(200).json({
      message: "Successfully found customer data!",
      resourceData: [customer],
    });
  }
);

// @desc   Delete a customer
// @route  DELETE /api/v1/customer/:id
// @access Private
const deleteCustomerController = expressAsyncController(
  async (
    request: DeleteCustomerRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>,
    next: NextFunction
  ) => {
    const { customerId } = request.params;

    const deletedCustomer = await deleteCustomerService(customerId);
    if (!deletedCustomer.acknowledged) {
      return next(new createHttpError.InternalServerError("Failed to delete customer"));
    }

    response
      .status(200)
      .json({ message: "Successfully deleted customer!", resourceData: [] });
  }
);

// @desc   Delete all customers
// @route  DELETE /api/v1/customer/delete-all
// @access Private
const deleteAllCustomersController = expressAsyncController(
  async (
    _request: DeleteCustomerRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>,
    next: NextFunction
  ) => {
    const deletedCustomer = await deleteAllCustomersService();
    if (!deletedCustomer.acknowledged) {
      return next(new createHttpError.InternalServerError("Failed to delete customers"));
    }

    response
      .status(200)
      .json({ message: "Successfully deleted customer!", resourceData: [] });
  }
);

// @desc   Update a customer
// @route  PATCH /api/v1/customer/:id
// @access Private
const updateCustomerByIdController = expressAsyncController(
  async (
    request: UpdateCustomerRequest,
    response: Response<
      ResourceRequestServerResponse<CustomerDocument, "password" | "paymentInformation">
    >,
    next: NextFunction
  ) => {
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;
    const { customerId } = request.params;

    const updatedCustomer = await updateCustomerByIdService({
      fields,
      updateOperator,
      _id: customerId,
    });
    if (!updatedCustomer) {
      return next(new createHttpError.InternalServerError("Failed to update customer"));
    }

    response.status(200).json({
      message: `Customer ${updatedCustomer.username} updated successfully`,
      resourceData: [updatedCustomer],
    });
  }
);

// @desc Retrieve customer document with payment information
// @route GET /api/v1/customer/payment-info
// @access Private
const getCustomerDocWithPaymentInfoController = expressAsyncController(
  async (
    request: GetCustomerByIdRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument, "password">>,
    next: NextFunction
  ) => {
    const { customerId } = request.params;

    const customerDocument = await getCustomerDocWithPaymentInfoService(customerId);
    if (!customerDocument) {
      return next(new createHttpError.NotFound("Customer not found"));
    }

    response.status(200).json({
      message: "Successfully found customer payment information data!",
      resourceData: [customerDocument],
    });
  }
);

// @desc   update customer password
// @route  PATCH /api/v1/customer/password
// @access Private
const updateCustomerPasswordController = expressAsyncController(
  async (
    request: UpdateCustomerPasswordRequest,
    response: Response<
      ResourceRequestServerResponse<CustomerDocument, "password" | "paymentInformation">
    >,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId },
      currentPassword,
      newPassword,
    } = request.body;

    const isCurrentPasswordCorrect = await checkCustomerPasswordService({
      userId,
      password: currentPassword,
    });
    if (!isCurrentPasswordCorrect) {
      return next(new createHttpError.Unauthorized("Incorrect current password"));
    }

    if (currentPassword === newPassword) {
      return next(
        new createHttpError.BadRequest(
          "New password cannot be the same as current password"
        )
      );
    }

    const updatedCustomer = await updateCustomerPasswordService({
      userId,
      newPassword,
    });
    if (!updatedCustomer) {
      return next(new createHttpError.InternalServerError("Failed to update password"));
    }

    response.status(200).json({
      message: "Password updated successfully",
      resourceData: [updatedCustomer],
    });
  }
);

export {
  createNewCustomerController,
  createNewCustomersBulkController,
  deleteAllCustomersController,
  deleteCustomerController,
  getAllCustomersBulkController,
  getCustomerByIdController,
  getCustomerDocWithPaymentInfoController,
  getQueriedCustomersController,
  updateCustomerByIdController,
  updateCustomerFieldsBulkController,
  updateCustomerPasswordController,
};
