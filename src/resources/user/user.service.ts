import bcrypt from 'bcryptjs';

import type { FlattenMaps, Types } from 'mongoose';
import type {
  Countries,
  Departments,
  JobPositions,
  PhoneNumber,
  PostalCodes,
  UserRoles,
  UserSchema,
} from './user.model';

import { UserModel } from './user.model';

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

async function deleteUserService(id: Types.ObjectId): Promise<
  | (FlattenMaps<UserSchema> & {
      _id: Types.ObjectId;
    })
  | null
> {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id).lean().exec();
    return deletedUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteUserService' });
  }
}

async function getUserByIdService(userId: Types.ObjectId): Promise<
  | (FlattenMaps<UserSchema> & {
      _id: Types.ObjectId;
    })
  | null
> {
  try {
    const user = await UserModel.findById(userId).lean().exec();
    return user;
  } catch (error: any) {
    throw new Error(error, { cause: 'getUserByIdService' });
  }
}

async function getUserByUsernameService(username: string) {
  try {
    const user = await UserModel.findOne({ username }).lean().exec();
    return user;
  } catch (error: any) {
    throw new Error(error, { cause: 'getUserByUsernameService' });
  }
}

async function getAllUsersService(): Promise<
  (FlattenMaps<UserSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    // do not return the password field
    const users = await UserModel.find({}).select('-password').lean().exec();
    return users;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllUsersService' });
  }
}

type UpdateUserServiceInput = {
  id: Types.ObjectId;
  username: string;
  email: string;
  password?: string | undefined;
  roles: ('Admin' | 'Employee' | 'Manager')[];
  active: boolean;
};

async function updateUserService({
  id,
  email,
  username,
  password,
  roles,
  active,
}: UpdateUserServiceInput) {
  try {
    let newHashedPassword: string;
    // if password is provided, hash it and assign it to newHashedPassword
    if (password) {
      const passwordSalt = await bcrypt.genSalt(10);
      newHashedPassword = await bcrypt.hash(password, passwordSalt);
    } else {
      // if password is not provided, find the user by id and grab the existing hashed password
      const user = await UserModel.findById(id).select('password').lean().exec();
      if (user) {
        // if user is found, assign the existing hashed password to newHashedPassword
        newHashedPassword = user.password;
      } else {
        throw new Error('User not found', {
          cause: 'updateUserService in else block of user returned by findById',
        });
      }
    }

    const userFieldsToUpdateObj = {
      email,
      username,
      password: newHashedPassword,
      roles,
      active,
    };

    // find the user by id and update the user
    const updatedUser = await UserModel.findByIdAndUpdate(id, userFieldsToUpdateObj, {
      new: true,
    })
      .lean()
      .exec();

    return updatedUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateUserService' });
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
};
