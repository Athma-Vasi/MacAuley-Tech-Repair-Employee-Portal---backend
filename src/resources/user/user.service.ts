import bcrypt from 'bcryptjs';

import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  Countries,
  Departments,
  JobPositions,
  PhoneNumber,
  PostalCodes,
  UserDocument,
  UserRoles,
  UserSchema,
} from './user.model';

import { UserModel } from './user.model';
import { UserDatabaseResponse } from './user.types';

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

type CreateNewUserServiceInput = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNumber: PhoneNumber;
  address: {
    addressLine1: string;
    city: string;
    province: string;
    state: string;
    postalCode: PostalCodes;
    country: Countries;
  };
  jobPosition: JobPositions;
  department: Departments;
  emergencyContact: {
    fullName: string;
    contactNumber: PhoneNumber;
  };
  startDate: NativeDate;
  roles: UserRoles;
  active: boolean;
};

async function createNewUserService(inputObj: CreateNewUserServiceInput) {
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

async function deleteUserService(userId: Types.ObjectId): Promise<DeleteResult> {
  try {
    const deletedUser = await UserModel.deleteOne({ _id: userId }).lean().exec();
    return deletedUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteUserService' });
  }
}

async function getUserByIdService(userId: Types.ObjectId) {
  try {
    const user = await UserModel.findById(userId).select('-password').lean().exec();
    return user as unknown as Promise<UserDatabaseResponse> | null;
  } catch (error: any) {
    throw new Error(error, { cause: 'getUserByIdService' });
  }
}

async function getUserByUsernameService(username: string) {
  try {
    const user = await UserModel.findOne({ username }).select('-password').lean().exec();
    return user as unknown as Promise<UserDatabaseResponse> | null;
  } catch (error: any) {
    throw new Error(error, { cause: 'getUserByUsernameService' });
  }
}

async function getAllUsersService() {
  try {
    // do not return the password field
    const users = await UserModel.find({}).select('-password').lean().exec();
    return users as unknown as Promise<UserDatabaseResponse[]>;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllUsersService' });
  }
}

type UpdateUserServiceInput = {
  userId: Types.ObjectId;
  email: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNumber: PhoneNumber;
  address: {
    addressLine1: string;
    city: string;
    province: string;
    state: string;
    postalCode: PostalCodes;
    country: Countries;
  };
  jobPosition: JobPositions;
  department: Departments;
  emergencyContact: {
    fullName: string;
    contactNumber: PhoneNumber;
  };
  startDate: NativeDate;
  roles: UserRoles;
  active: boolean;
};

async function updateUserService(input: UpdateUserServiceInput) {
  try {
    // get existing user
    const existingUser = await UserModel.findById(input.userId).lean().exec();
    // replace existing user with new user minus the password
    const updatedUser = await UserModel.findByIdAndUpdate(
      input.userId,
      { ...input, password: existingUser?.password },
      { new: true }
    )
      .select('-password')
      .lean()
      .exec();

    return updatedUser as Promise<UserDatabaseResponse> | null;
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
  getAllUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserService,
  checkUserPasswordService,
  updateUserPasswordService,
};
