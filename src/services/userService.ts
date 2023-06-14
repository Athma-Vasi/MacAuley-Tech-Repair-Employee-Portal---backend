import bcrypt from 'bcryptjs';
import { FlattenMaps, Schema, Types } from 'mongoose';

import { UserModel, UserSchema } from '../models';
import { GetAllUsersReturn } from '../types';

type CheckUserExistsServiceInput = {
  email?: string;
  username?: string;
  id?: Types.ObjectId;
};

async function checkUserExistsService({
  email,
  username,
  id,
}: CheckUserExistsServiceInput): Promise<boolean> {
  try {
    // lean is used to return a plain javascript object instead of a mongoose document
    // exec is used when passing an argument and returning a promise and also provides better error handling

    if (id) {
      const duplicateId = await UserModel.findById(id).lean().exec();
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
  username?: string;
  id?: Types.ObjectId;
};

async function checkUserIsActiveService({ username, id }: CheckUserIsActiveServiceInput) {
  try {
    if (id) {
      const user = await UserModel.findById(id).lean().exec();
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
  roles: ('Admin' | 'Employee' | 'Manager')[];
};

async function createNewUserService({
  email,
  username,
  password,
  roles,
}: CreateNewUserServiceInput) {
  // salt rounds of 10
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUserObject = {
      email,
      username,
      password: hashedPassword,
      roles,
    };

    const newUser = await UserModel.create(newUserObject);
    return newUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewUserService' });
  }
}

async function deleteUserService(id: Types.ObjectId) {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    return deletedUser;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteUserService' });
  }
}

async function getUserByIdService(id: Types.ObjectId): Promise<
  | (FlattenMaps<UserSchema> & {
      _id: Types.ObjectId;
    })
  | null
> {
  try {
    const user = await UserModel.findById(id).lean().exec();
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

async function getAllUsersService(): Promise<GetAllUsersReturn[]> {
  try {
    // select is used to exclude the password field from the returned document
    // lean is used to return a plain javascript object instead of a mongoose document
    const users = (await UserModel.find().select('-password').lean()) as GetAllUsersReturn[];
    return users;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllUsersService' });
  }
}

type UpdateUserServiceInput = {
  id: Types.ObjectId;
  username: string;
  password?: string | undefined;
  roles: ('Admin' | 'Employee' | 'Manager')[];
  active: boolean;
};

async function updateUserService({
  id,
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
      const user = await UserModel.findById(id).select('password').lean();
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
      username,
      password: newHashedPassword,
      roles,
      active,
    };

    // find the user by id and update the user
    const updatedUser = await UserModel.findByIdAndUpdate(id, userFieldsToUpdateObj, {
      new: true,
    }).lean();

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
