import bcrypt from 'bcryptjs';

import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { CustomerDocument, CustomerSchema } from './customer.model';

import { CustomerModel } from './customer.model';
import {
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../types';

type CheckUserExistsServiceInput = {
  email?: string | undefined;
  username?: string | undefined;
  userId?: Types.ObjectId | undefined;
};

async function checkCustomerExistsService({
  email,
  username,
  userId,
}: CheckUserExistsServiceInput): Promise<boolean> {
  try {
    if (userId) {
      const userCount = await CustomerModel.countDocuments().lean().exec();
      return userCount ? true : false;
    }

    if (email) {
      const userCount = await CustomerModel.countDocuments({ email }).lean().exec();
      return userCount ? true : false;
    }

    if (username) {
      const userCount = await CustomerModel.countDocuments({ username }).lean().exec();
      return userCount ? true : false;
    }

    return false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkCustomerExistsService' });
  }
}

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
    throw new Error(error, { cause: 'checkCustomerExistsService' });
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
    const customerDocument: CustomerDocument = await CustomerModel.create(newCustomerSchema);
    return customerDocument;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewCustomerService' });
  }
}

async function deleteCustomerService(userId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deletedCustomer = await CustomerModel.deleteOne({ _id: userId }).lean().exec();
    return deletedCustomer;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteCustomerService' });
  }
}

async function getCustomerByIdService(
  userId: string | Types.ObjectId
): DatabaseResponseNullable<CustomerDocument> {
  try {
    const customer = await CustomerModel.findById(userId).select('-password').lean().exec();
    return customer;
  } catch (error: any) {
    throw new Error(error, { cause: 'getCustomerByIdService' });
  }
}

async function getCustomerByUsernameService(
  username: string
): DatabaseResponseNullable<CustomerDocument> {
  try {
    const customer = await CustomerModel.findOne({ username }).select('-password').lean().exec();
    return customer;
  } catch (error: any) {
    throw new Error(error, { cause: 'getCustomerByUsernameService' });
  }
}

async function getCustomerWithPasswordService(
  username: string
): DatabaseResponseNullable<CustomerDocument> {
  try {
    const customerWithPassword = await CustomerModel.findOne({ username }).lean().exec();
    return customerWithPassword;
  } catch (error: any) {
    throw new Error(error, { cause: 'getCustomerWithPasswordService' });
  }
}

async function getAllCustomersService() {
  try {
    const customer = await CustomerModel.find().select('-password -__v').lean().exec();
    return customer;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllCustomersService' });
  }
}

async function getQueriedCustomersService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<CustomerDocument>) {
  try {
    const customer = await CustomerModel.find(filter, projection, options)
      .select('-password')
      .lean()
      .exec();
    return customer;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedCustomersService' });
  }
}

async function getQueriedTotalCustomersService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<CustomerDocument>): Promise<number> {
  try {
    const totalCustomers = await CustomerModel.countDocuments(filter).lean().exec();
    return totalCustomers;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalCustomersService' });
  }
}

async function updateCustomerByIdService({
  userId,
  customerFields,
}: {
  userId: Types.ObjectId;
  customerFields: Partial<CustomerSchema>;
}): DatabaseResponseNullable<CustomerDocument> {
  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      userId,
      { ...customerFields },
      { new: true }
    )
      .select('-password -__v')
      .lean()
      .exec();
    return updatedCustomer;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateCustomerByIdService' });
  }
}

// DEV ROUTE
async function addFieldsToCustomersService({
  userId,
  fields,
}: {
  userId: Types.ObjectId;
  fields: Record<string, any>;
}) {
  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      userId,
      { ...fields },
      { new: true }
    )
      .select('-password -__v')
      .lean()
      .exec();
    return updatedCustomer;
  } catch (error: any) {
    throw new Error(error, { cause: 'addFieldsToCustomersService' });
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
    throw new Error(error, { cause: 'checkCustomerPasswordService' });
  }
}

type UpdateCustomerPasswordServiceInput = {
  userId: Types.ObjectId;
  newPassword: string;
};
async function updateCustomerPasswordService({
  userId,
  newPassword,
}: UpdateCustomerPasswordServiceInput) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    )
      .select('-password')
      .lean()
      .exec();
    return updatedCustomer;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateCustomerPasswordService' });
  }
}

export {
  addFieldsToCustomersService,
  createNewCustomerService,
  checkCustomerExistsService,
  checkCustomerIsActiveService,
  deleteCustomerService,
  getQueriedCustomersService,
  getCustomerByIdService,
  getCustomerByUsernameService,
  updateCustomerByIdService,
  getQueriedTotalCustomersService,
  checkCustomerPasswordService,
  updateCustomerPasswordService,
  getCustomerWithPasswordService,
  getAllCustomersService,
};