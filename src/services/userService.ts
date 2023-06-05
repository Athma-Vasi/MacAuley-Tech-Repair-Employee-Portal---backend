import bcrypt from 'bcryptjs';
import { FlattenMaps, Types } from 'mongoose';

import { UserModel, UserSchema } from '../models';

async function checkUserExistsService(username: string): Promise<boolean> {
  try {
    // lean is used to return a plain javascript object instead of a mongoose document
    // exec is used when passing an argument and returning a promise and also provides better error handling
    const duplicate = await UserModel.findOne({ username }).lean().exec();

    return duplicate ? true : false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkDuplicateUser' });
  }
}

type CreateNewUserServiceInput = {
  username: string;
  password: string;
  roles: ('Admin' | 'Employee' | 'Manager')[];
};

async function createNewUserService({ username, password, roles }: CreateNewUserServiceInput) {
  // salt rounds of 10
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUserObject = {
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

async function getAllUsersService(): Promise<
  (FlattenMaps<UserSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    // select is used to exclude the password field from the returned document
    // lean is used to return a plain javascript object instead of a mongoose document
    const users = await UserModel.find().select('-password').lean();
    return users;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllUsersService' });
  }
}

type UpdateUserServiceInput = {
  id: string;
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
    // if password is provided, hash it
    let newHashedPassword: string;
    if (password) {
      const passwordSalt = await bcrypt.genSalt(10);
      newHashedPassword = await bcrypt.hash(password, passwordSalt);
    } else {
      // find the user by id and select the password field
      const user = await UserModel.findById(id).select('password').lean();
      if (user) {
        // if password is not provided, use the existing password
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

export { createNewUserService, checkUserExistsService, getAllUsersService, updateUserService };
