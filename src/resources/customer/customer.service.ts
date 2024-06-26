import bcrypt from "bcryptjs";

import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { CustomerDocument, CustomerSchema } from "./customer.model";

import { CustomerModel } from "./customer.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";
import createHttpError from "http-errors";

type CheckCustomerIsActiveServiceInput = {
  username?: string | undefined;
  userId?: Types.ObjectId | undefined;
};

async function checkCustomerIsActiveService({
  username,
  userId,
}: CheckCustomerIsActiveServiceInput) {
  try {
    if (userId) {
      const user = await CustomerModel.findById(userId).lean().exec();
      return user?.isActive ?? false;
    }

    if (username) {
      const user = await CustomerModel.findOne({ username }).lean().exec();
      return user?.isActive ?? false;
    }

    return false;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("checkCustomerExistsService");
  }
}

async function createNewCustomerService(customerSchema: CustomerSchema) {
  const { password } = customerSchema;
  // salt rounds of 10
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newCustomerSchema = {
    ...customerSchema,
    password: hashedPassword,
  };

  try {
    const customerDocument: CustomerDocument = await CustomerModel.create(
      newCustomerSchema
    );
    return customerDocument;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewCustomerService");
  }
}

async function deleteCustomerService(
  userId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedCustomer = await CustomerModel.deleteOne({ _id: userId }).lean().exec();
    return deletedCustomer;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteCustomerService");
  }
}

async function deleteAllCustomersService(): Promise<DeleteResult> {
  try {
    const customers = await CustomerModel.deleteMany({}).lean().exec();
    return customers;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllCustomersService");
  }
}

async function getCustomerByIdService(
  userId: string | Types.ObjectId
): DatabaseResponseNullable<CustomerDocument> {
  try {
    const customer = await CustomerModel.findById(userId)
      .select("-password -paymentInformation")
      .lean()
      .exec();
    return customer;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getCustomerByIdService");
  }
}

async function getCustomerByUsernameService(
  username: string
): DatabaseResponseNullable<CustomerDocument> {
  try {
    const customer = await CustomerModel.findOne({ username })
      .select("-password -paymentInformation")
      .lean()
      .exec();
    return customer;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getCustomerByUsernameService");
  }
}

async function getCustomerWithPasswordService(
  username: string
): DatabaseResponseNullable<CustomerDocument> {
  try {
    const customerWithPassword = await CustomerModel.findOne({ username }).lean().exec();
    return customerWithPassword;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getCustomerWithPasswordService");
  }
}

async function getAllCustomersService(
  excludedFields?: string[]
): DatabaseResponse<CustomerDocument> {
  try {
    const customer = await CustomerModel.find()
      .select(excludedFields?.join(" ") ?? "-password -paymentInformation")
      .lean()
      .exec();
    return customer;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getAllCustomersService");
  }
}

async function getQueriedCustomersService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<CustomerDocument>): DatabaseResponse<CustomerDocument> {
  try {
    const customer = await CustomerModel.find(filter, projection, options)
      .select("-password -paymentInformation")
      .lean()
      .exec();
    return customer;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedCustomersService");
  }
}

async function getQueriedTotalCustomersService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<CustomerDocument>): Promise<number> {
  try {
    const totalCustomers = await CustomerModel.countDocuments(filter).lean().exec();
    return totalCustomers;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalCustomersService");
  }
}

async function updateCustomerByIdService({
  fields,
  updateOperator,
  _id,
}: UpdateDocumentByIdServiceInput<CustomerDocument>): DatabaseResponseNullable<CustomerDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .select("-password -paymentInformation")
      .lean()
      .exec();
    return updatedCustomer;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateCustomerByIdService");
  }
}

async function getCustomerDocWithPaymentInfoService(
  customerId: Types.ObjectId | string
): DatabaseResponseNullable<CustomerDocument> {
  try {
    const customerDocument = await CustomerModel.findById(customerId)
      .select("-password")
      .lean()
      .exec();
    return customerDocument;
  } catch (error: any) {
    throw new Error(error, {
      cause: "getCustomerDocWithPaymentInfoService",
    });
  }
}

type CheckCustomerPasswordServiceInput = {
  userId: Types.ObjectId;
  password: string;
};
async function checkCustomerPasswordService({
  userId,
  password,
}: CheckCustomerPasswordServiceInput): Promise<boolean> {
  try {
    const customer = await CustomerModel.findById(userId).lean().exec();
    if (!customer) {
      return false;
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password);
    return isPasswordMatch;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("checkCustomerPasswordService");
  }
}

type UpdateCustomerPasswordServiceInput = {
  userId: Types.ObjectId;
  newPassword: string;
};
async function updateCustomerPasswordService({
  userId,
  newPassword,
}: UpdateCustomerPasswordServiceInput): DatabaseResponseNullable<CustomerDocument> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    )
      .select("-password -paymentInformation")
      .lean()
      .exec();
    return updatedCustomer;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateCustomerPasswordService");
  }
}

export {
  checkCustomerIsActiveService,
  checkCustomerPasswordService,
  createNewCustomerService,
  deleteAllCustomersService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  getCustomerByUsernameService,
  getCustomerDocWithPaymentInfoService,
  getCustomerWithPasswordService,
  getQueriedCustomersService,
  getQueriedTotalCustomersService,
  updateCustomerByIdService,
  updateCustomerPasswordService,
};
