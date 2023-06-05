import bcrypt from 'bcryptjs';
import { FlattenMaps, Types } from 'mongoose';

import { UserModel, UserSchema } from '../models';

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

async function checkDuplicateUserService(username: string): Promise<boolean> {
  try {
    // lean is used to return a plain javascript object instead of a mongoose document
    // exec is used when passing an argument and returning a promise and also provides better error handling
    const duplicate = await UserModel.findOne({ username }).lean().exec();

    return duplicate ? true : false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkDuplicateUser' });
  }
}

/**
 *
 *
 *
 */

export { getAllUsersService, checkDuplicateUserService };
