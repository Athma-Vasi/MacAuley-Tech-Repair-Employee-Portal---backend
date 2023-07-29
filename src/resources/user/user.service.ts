import bcrypt from 'bcryptjs';

import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  PreferredPronouns,
  Province,
  StatesUS,
  UserDocument,
  UserRoles,
  UserSchema,
} from './user.model';

import { UserModel } from './user.model';
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

async function checkUserExistsService({
  email,
  username,
  userId,
}: CheckUserExistsServiceInput): Promise<boolean> {
  try {
    // lean is used to return a plain javascript object instead of a mongoose document
    // exec is used when passing an argument and returning a promise and also provides better error handling

    if (userId) {
      const duplicateId = await UserModel.findById(userId).lean().exec();
      return duplicateId ? true : false;
    }

    if (email) {
      const duplicateEmail = await UserModel.findOne({ email }).lean().exec();
      return duplicateEmail ? true : false;
    }

    if (username) {
      const duplicateUsername = await UserModel.findOne({ username }).lean().exec();
      return duplicateUsername ? true : false;
    }

    return false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkUserExistsService' });
  }
}

type CheckUserIsActiveServiceInput = {
  username?: string | undefined;
  userId?: Types.ObjectId | undefined;
};

async function checkUserIsActiveService({ username, userId }: CheckUserIsActiveServiceInput) {
  try {
    if (userId) {
      const user = await UserModel.findById(userId).lean().exec();
      return user?.active ?? false;
    }

    if (username) {
      const user = await UserModel.findOne({ username }).lean().exec();
      return user?.active ?? false;
    }

    return false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkUserExistsService' });
  }
}

async function createNewUserService(inputObj: UserSchema) {
  const { password } = inputObj;
  // salt rounds of 10
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUserObj = {
    ...inputObj,
    password: hashedPassword,
  };

  try {
    const newUser = await UserModel.create(newUserObj);
    return newUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewUserService' });
  }
}

async function deleteUserService(userId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deletedUser = await UserModel.deleteOne({ _id: userId }).lean().exec();
    return deletedUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteUserService' });
  }
}

async function getUserByIdService(
  userId: string | Types.ObjectId
): DatabaseResponseNullable<UserDocument> {
  try {
    const user = await UserModel.findById(userId).select('-password').lean().exec();
    return user;
  } catch (error: any) {
    throw new Error(error, { cause: 'getUserByIdService' });
  }
}

async function getUserByUsernameService(username: string): DatabaseResponseNullable<UserDocument> {
  try {
    const user = await UserModel.findOne({ username }).select('-password').lean().exec();
    return user;
  } catch (error: any) {
    throw new Error(error, { cause: 'getUserByUsernameService' });
  }
}

async function getUserWithPasswordService(
  username: string
): DatabaseResponseNullable<UserDocument> {
  try {
    const userWithPassword = await UserModel.findOne({ username }).lean().exec();
    return userWithPassword;
  } catch (error: any) {
    throw new Error(error, { cause: 'getUserWithPasswordService' });
  }
}

async function getQueriedUsersService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<UserDocument>) {
  try {
    // do not return the password field
    const users = await UserModel.find({ filter, projection, options })
      .select('-password')
      .lean()
      .exec();
    return users;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedUsersService' });
  }
}

async function getQueriedTotalUsersService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<UserDocument>): Promise<number> {
  try {
    const totalUsers = await UserModel.countDocuments(filter).lean().exec();
    return totalUsers;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalUsersService' });
  }
}

type UpdateUserServiceInput = {
  username: string;
  userId: Types.ObjectId;
  roles: UserRoles;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  preferredPronouns: PreferredPronouns;
  profilePictureUrl: string;
  dateOfBirth: NativeDate;

  contactNumber: PhoneNumber;
  address: {
    addressLine: string;
    city: string;
    province: Province | '';
    state: StatesUS | '';
    postalCode: PostalCode;
    country: Country;
  };
  jobPosition: JobPosition;
  department: Department;
  emergencyContact: {
    fullName: string;
    phoneNumber: PhoneNumber;
  };
  startDate: NativeDate;
  active: boolean;
};

async function updateUserService(inputObj: UpdateUserServiceInput) {
  try {
    // get existing user
    const existingUser = await UserModel.findById(inputObj.userId).lean().exec();
    // replace existing user with new user minus the password
    const updatedUser = await UserModel.findByIdAndUpdate(
      inputObj.userId,
      { ...inputObj, password: existingUser?.password },
      { new: true }
    )
      .select('-password')
      .lean()
      .exec();

    return updatedUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateUserService' });
  }
}

type CheckUserPasswordServiceInput = {
  userId: Types.ObjectId;
  password: string;
};
async function checkUserPasswordService({
  userId,
  password,
}: CheckUserPasswordServiceInput): Promise<boolean> {
  try {
    const user = await UserModel.findById(userId).lean().exec();
    if (!user) {
      return false;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkUserPasswordService' });
  }
}

type UpdateUserPasswordServiceInput = {
  userId: Types.ObjectId;
  newPassword: string;
};
async function updateUserPasswordService({ userId, newPassword }: UpdateUserPasswordServiceInput) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    )
      .select('-password')
      .lean()
      .exec();
    return updatedUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateUserPasswordService' });
  }
}

/**
 *
 *
 *
 */

export {
  createNewUserService,
  checkUserExistsService,
  checkUserIsActiveService,
  deleteUserService,
  getQueriedUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserService,
  getQueriedTotalUsersService,
  checkUserPasswordService,
  updateUserPasswordService,
  getUserWithPasswordService,
};
