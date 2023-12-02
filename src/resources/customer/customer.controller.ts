import expressAsyncHandler from "express-async-handler";

import type { Response } from "express";
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
  CustomerServerResponseDocument,
} from "./customer.types";

import {
  checkCustomerExistsService,
  checkCustomerPasswordService,
  createNewCustomerService,
  deleteCustomerService,
  getQueriedTotalCustomersService,
  getQueriedCustomersService,
  getCustomerByIdService,
  updateCustomerPasswordService,
  getAllCustomersService,
  updateCustomerDocumentByIdService,
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
import { getProductReviewByIdService } from "../productReview";
import { getSurveyByIdService } from "../actions/outreach/survey";
import { getPurchaseByIdService } from "../purchase";
import { getRMAByIdService } from "../rma";

// @desc   Create new user
// @route  POST /api/v1/customer
// @access Private
const createNewCustomerHandler = expressAsyncHandler(
  async (
    request: CreateNewCustomerRequest,
    response: Response<
      ResourceRequestServerResponse<
        CustomerDocument,
        "password" | "paymentInformation" | "__v"
      >
    >
  ) => {
    const { customerSchema } = request.body;
    const { email, address, username } = customerSchema;
    const { province, state } = address;

    // both state and province cannot be undefined (one is required)
    if (!state && !province) {
      response.status(400).json({
        message: "State or Province is required",
        resourceData: [],
      });
      return;
    }

    // check for duplicate email
    const isDuplicateEmail = await checkCustomerExistsService({ email });
    if (isDuplicateEmail) {
      response.status(409).json({ message: "Email already exists", resourceData: [] });
      return;
    }

    // check for duplicate username
    const isDuplicateCustomer = await checkCustomerExistsService({ username });
    if (isDuplicateCustomer) {
      response
        .status(409)
        .json({ message: "Customername already exists", resourceData: [] });
      return;
    }

    // create new user if all checks pass successfully
    const customerDocument: CustomerDocument = await createNewCustomerService(
      customerSchema
    );
    if (!customerDocument) {
      response
        .status(400)
        .json({ message: "Customer creation failed", resourceData: [] });
      return;
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
const createNewCustomersBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewCustomersBulkRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const { customerSchemas } = request.body;

    const customerDocuments = await Promise.all(
      customerSchemas.map(async (customerSchema) => {
        const { email, address, username } = customerSchema;
        const { province, state } = address;

        // both state and province cannot be undefined (one is required)
        if (!state && !province) {
          response.status(400).json({
            message: "State or Province is required",
            resourceData: [],
          });
          return;
        }

        // check for duplicate email
        const isDuplicateEmail = await checkCustomerExistsService({ email });
        if (isDuplicateEmail) {
          response
            .status(409)
            .json({ message: "Email already exists", resourceData: [] });
          return;
        }

        // check for duplicate username
        const isDuplicateCustomer = await checkCustomerExistsService({
          username,
        });
        if (isDuplicateCustomer) {
          response
            .status(409)
            .json({ message: "Customername already exists", resourceData: [] });
          return;
        }

        // create new user if all checks pass successfully
        const customerDocument: CustomerDocument = await createNewCustomerService(
          customerSchema
        );

        return customerDocument;
      })
    );

    // filter out undefined values
    const customerDocumentsFiltered = customerDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any customers were created
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
const updateCustomerFieldsBulkHandler = expressAsyncHandler(
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

        const updatedCustomer = await updateCustomerDocumentByIdService({
          fields,
          updateOperator,
          _id: customerId,
        });

        return updatedCustomer;
      })
    );

    // filter out undefined values
    const updatedCustomersFiltered = updatedCustomers.filter(
      removeUndefinedAndNullValues
    );

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

// DEV ROUTE
// @desc   get all customers bulk (no filter, projection or options)
// @route  GET /api/v1/customer/dev
// @access Private
const getAllCustomersBulkHandler = expressAsyncHandler(
  async (
    request: GetAllCustomersBulkRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const customers = await getAllCustomersService(["-password"]);

    if (!customers.length) {
      response.status(200).json({
        message: "Unable to find any customers. Please try again!",
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
const getQueriedCustomersHandler = expressAsyncHandler(
  async (
    request: GetAllCustomersRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<
        CustomerServerResponseDocument<"paymentInformation">
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

    // get all customers
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

    // find all productReview documents associated with the customers
    const reviewsArrArr = await Promise.all(
      customers.map(async (customer) => {
        const reviewPromises = customer.productReviewsIds.map(async (reviewId) => {
          const review = await getProductReviewByIdService(reviewId);

          return review;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const reviews = await Promise.all(reviewPromises);

        // Filter out any undefined values (in case review was not found)
        return reviews.filter(removeUndefinedAndNullValues);
      })
    );

    // find all purchaseHistory documents associated with the customers
    const purchaseHistoryArrArr = await Promise.all(
      customers.map(async (customer) => {
        const purchaseHistoryPromises = customer.purchaseHistoryIds.map(
          async (purchaseHistoryId) => {
            const purchaseHistory = await getPurchaseByIdService(purchaseHistoryId);

            return purchaseHistory;
          }
        );

        // Wait for all the promises to resolve before continuing to the next iteration
        const purchaseHistory = await Promise.all(purchaseHistoryPromises);

        // Filter out any undefined values (in case purchaseHistory was not found)
        return purchaseHistory.filter(removeUndefinedAndNullValues);
      })
    );

    // find all rmaHistory documents associated with the customers
    const rmaHistoryArrArr = await Promise.all(
      customers.map(async (customer) => {
        const rmaHistoryPromises = customer.rmaHistoryIds.map(async (rmaHistoryId) => {
          const rmaHistory = await getRMAByIdService(rmaHistoryId);

          return rmaHistory;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const rmaHistory = await Promise.all(rmaHistoryPromises);

        // Filter out any undefined values (in case rmaHistory was not found)
        return rmaHistory.filter(removeUndefinedAndNullValues);
      })
    );

    // find all completedSurveys documents associated with the customers
    const completedSurveysArrArr = await Promise.all(
      customers.map(async (customer) => {
        const completedSurveysPromises = customer.completedSurveys.map(
          async (completedSurveysId) => {
            const completedSurveys = await getSurveyByIdService(completedSurveysId);

            return completedSurveys;
          }
        );

        // Wait for all the promises to resolve before continuing to the next iteration
        const completedSurveys = await Promise.all(completedSurveysPromises);

        // Filter out any undefined values (in case completedSurveys was not found)
        return completedSurveys.filter(removeUndefinedAndNullValues);
      })
    );

    const customersWithAddedFields = customers.map((customer, index) => {
      return {
        ...customer,
        productReviews: reviewsArrArr[index],
        purchaseHistory: purchaseHistoryArrArr[index],
        rmaHistory: rmaHistoryArrArr[index],
        completedSurveys: completedSurveysArrArr[index],
      };
    });

    response.status(200).json({
      message: "Successfully found customers",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: customersWithAddedFields,
    });
  }
);

// @desc   Get a customer by id
// @route  GET /api/v1/customer/:id
// @access Private
const getCustomerByIdHandler = expressAsyncHandler(
  async (
    request: GetCustomerByIdRequest,
    response: Response<
      ResourceRequestServerResponse<CustomerServerResponseDocument<"paymentInformation">>
    >
  ) => {
    const { customerId } = request.params;

    const customer = await getCustomerByIdService(customerId);

    if (!customer) {
      response.status(404).json({ message: "Customer not found.", resourceData: [] });
      return;
    }

    const reviewsArr = await Promise.all(
      customer.productReviewsIds.map(async (reviewId) => {
        const review = await getProductReviewByIdService(reviewId);

        return review;
      })
    );

    const purchaseHistoryArr = await Promise.all(
      customer.purchaseHistoryIds.map(async (purchaseHistoryId) => {
        const purchaseHistory = await getPurchaseByIdService(purchaseHistoryId);

        return purchaseHistory;
      })
    );

    const rmaHistoryArr = await Promise.all(
      customer.rmaHistoryIds.map(async (rmaHistoryId) => {
        const rmaHistory = await getRMAByIdService(rmaHistoryId);

        return rmaHistory;
      })
    );

    const completedSurveysArr = await Promise.all(
      customer.completedSurveys.map(async (completedSurveysId) => {
        const completedSurveys = await getSurveyByIdService(completedSurveysId);

        return completedSurveys;
      })
    );

    const customerWithAddedFields = {
      ...customer,
      productReviews: reviewsArr,
      purchaseHistory: purchaseHistoryArr,
      rmaHistory: rmaHistoryArr,
      completedSurveys: completedSurveysArr,
    };

    response.status(200).json({
      message: "Successfully found customer data!",
      resourceData: [customerWithAddedFields],
    });
  }
);

// @desc   Delete a customer
// @route  DELETE /api/v1/customer/:id
// @access Private
const deleteCustomerHandler = expressAsyncHandler(
  async (
    request: DeleteCustomerRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    // only managers/admin are allowed to delete customers
    const { customerId } = request.params;

    const deletedCustomer = await deleteCustomerService(customerId);

    if (!deletedCustomer.acknowledged) {
      response.status(400).json({
        message: "Failed to delete customer. Please try again!",
        resourceData: [],
      });
      return;
    }

    response
      .status(200)
      .json({ message: "Successfully deleted customer!", resourceData: [] });
  }
);

// @desc   Delete all customers
// @route  DELETE /api/v1/customer/delete-all
// @access Private
const deleteAllCustomersHandler = expressAsyncHandler(
  async (
    request: DeleteCustomerRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const deletedCustomer = await deleteAllCustomersService();

    if (!deletedCustomer.acknowledged) {
      response.status(400).json({
        message: "Failed to delete customer. Please try again!",
        resourceData: [],
      });
      return;
    }

    response
      .status(200)
      .json({ message: "Successfully deleted customer!", resourceData: [] });
  }
);

// @desc   Update a customer
// @route  PATCH /api/v1/customer/:id
// @access Private
const updateCustomerByIdHandler = expressAsyncHandler(
  async (
    request: UpdateCustomerRequest,
    response: Response<
      ResourceRequestServerResponse<CustomerServerResponseDocument<"paymentInformation">>
    >
  ) => {
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;
    const { customerId } = request.params;

    const updatedCustomer = await updateCustomerDocumentByIdService({
      fields,
      updateOperator,
      _id: customerId,
    });

    if (!updatedCustomer) {
      response.status(400).json({ message: "Customer update failed", resourceData: [] });
      return;
    }

    const reviewsArr = await Promise.all(
      updatedCustomer.productReviewsIds.map(async (reviewId) => {
        const review = await getProductReviewByIdService(reviewId);

        return review;
      })
    );

    const purchaseHistoryArr = await Promise.all(
      updatedCustomer.purchaseHistoryIds.map(async (purchaseHistoryId) => {
        const purchaseHistory = await getPurchaseByIdService(purchaseHistoryId);

        return purchaseHistory;
      })
    );

    const rmaHistoryArr = await Promise.all(
      updatedCustomer.rmaHistoryIds.map(async (rmaHistoryId) => {
        const rmaHistory = await getRMAByIdService(rmaHistoryId);

        return rmaHistory;
      })
    );

    const completedSurveysArr = await Promise.all(
      updatedCustomer.completedSurveys.map(async (completedSurveysId) => {
        const completedSurveys = await getSurveyByIdService(completedSurveysId);

        return completedSurveys;
      })
    );

    const customerWithAddedFields = {
      ...updatedCustomer,
      productReviews: reviewsArr,
      purchaseHistory: purchaseHistoryArr,
      rmaHistory: rmaHistoryArr,
      completedSurveys: completedSurveysArr,
    };

    response.status(200).json({
      message: `Customer ${updatedCustomer.username} updated successfully`,
      resourceData: [customerWithAddedFields],
    });
  }
);

// @desc Retrieve customer document with payment information
// @route GET /api/v1/customer/payment-info
// @access Private
const getCustomerDocWithPaymentInfoHandler = expressAsyncHandler(
  async (
    request: GetCustomerByIdRequest,
    response: Response<ResourceRequestServerResponse<CustomerDocument>>
  ) => {
    const { customerId } = request.params;

    const customerDocument = await getCustomerDocWithPaymentInfoService(customerId);

    if (!customerDocument) {
      response.status(404).json({ message: "Customer not found.", resourceData: [] });
      return;
    }

    const reviewsArr = await Promise.all(
      customerDocument.productReviewsIds.map(async (reviewId) => {
        const review = await getProductReviewByIdService(reviewId);

        return review;
      })
    );

    const purchaseHistoryArr = await Promise.all(
      customerDocument.purchaseHistoryIds.map(async (purchaseHistoryId) => {
        const purchaseHistory = await getPurchaseByIdService(purchaseHistoryId);

        return purchaseHistory;
      })
    );

    const rmaHistoryArr = await Promise.all(
      customerDocument.rmaHistoryIds.map(async (rmaHistoryId) => {
        const rmaHistory = await getRMAByIdService(rmaHistoryId);

        return rmaHistory;
      })
    );

    const completedSurveysArr = await Promise.all(
      customerDocument.completedSurveys.map(async (completedSurveysId) => {
        const completedSurveys = await getSurveyByIdService(completedSurveysId);

        return completedSurveys;
      })
    );

    const customerWithAddedFields = {
      ...customerDocument,
      productReviews: reviewsArr,
      purchaseHistory: purchaseHistoryArr,
      rmaHistory: rmaHistoryArr,
      completedSurveys: completedSurveysArr,
    };

    response.status(200).json({
      message: "Successfully found customer payment information data!",
      resourceData: [customerWithAddedFields],
    });
  }
);

// @desc   update customer password
// @route  PATCH /api/v1/customer/password
// @access Private
const updateCustomerPasswordHandler = expressAsyncHandler(
  async (
    request: UpdateCustomerPasswordRequest,
    response: Response<
      ResourceRequestServerResponse<CustomerServerResponseDocument<"paymentInformation">>
    >
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
      response
        .status(400)
        .json({ message: "Current password is incorrect", resourceData: [] });
      return;
    }

    // check if new password is the same as current password
    if (currentPassword === newPassword) {
      response.status(400).json({
        message: "New password cannot be the same as current password",
        resourceData: [],
      });
      return;
    }

    // update user password if all checks pass successfully
    const updatedCustomer = await updateCustomerPasswordService({
      userId,
      newPassword,
    });

    if (!updatedCustomer) {
      response.status(400).json({ message: "Password update failed", resourceData: [] });
      return;
    }

    const reviewsArr = await Promise.all(
      updatedCustomer.productReviewsIds.map(async (reviewId) => {
        const review = await getProductReviewByIdService(reviewId);

        return review;
      })
    );

    const purchaseHistoryArr = await Promise.all(
      updatedCustomer.purchaseHistoryIds.map(async (purchaseHistoryId) => {
        const purchaseHistory = await getPurchaseByIdService(purchaseHistoryId);

        return purchaseHistory;
      })
    );

    const rmaHistoryArr = await Promise.all(
      updatedCustomer.rmaHistoryIds.map(async (rmaHistoryId) => {
        const rmaHistory = await getRMAByIdService(rmaHistoryId);

        return rmaHistory;
      })
    );

    const completedSurveysArr = await Promise.all(
      updatedCustomer.completedSurveys.map(async (completedSurveysId) => {
        const completedSurveys = await getSurveyByIdService(completedSurveysId);

        return completedSurveys;
      })
    );

    const customerWithAddedFields = {
      ...updatedCustomer,
      productReviews: reviewsArr,
      purchaseHistory: purchaseHistoryArr,
      rmaHistory: rmaHistoryArr,
      completedSurveys: completedSurveysArr,
    };

    response.status(200).json({
      message: "Password updated successfully",
      resourceData: [customerWithAddedFields],
    });
  }
);

export {
  createNewCustomerHandler,
  createNewCustomersBulkHandler,
  deleteAllCustomersHandler,
  deleteCustomerHandler,
  getAllCustomersBulkHandler,
  getCustomerByIdHandler,
  getCustomerDocWithPaymentInfoHandler,
  getQueriedCustomersHandler,
  updateCustomerByIdHandler,
  updateCustomerFieldsBulkHandler,
  updateCustomerPasswordHandler,
};
