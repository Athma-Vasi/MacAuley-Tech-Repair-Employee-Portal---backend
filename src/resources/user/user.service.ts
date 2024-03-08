import bcrypt from "bcryptjs";

import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { UserDocument, UserSchema } from "./user.model";

import { UserModel } from "./user.model";
import {
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";

type CheckUserExistsServiceInput = {
  email?: string | undefined;
  username?: string | undefined;
  userId?: Types.ObjectId | undefined;
};

// async function checkUserExistsService({
//   email,
//   username,
//   userId,
// }: CheckUserExistsServiceInput): Promise<boolean> {
//   try {
//     if (userId) {
//       const userCount = await UserModel.countDocuments().lean().exec();
//       return userCount ? true : false;
//     }

//     if (email) {
//       const userCount = await UserModel.countDocuments({ email }).lean().exec();
//       return userCount ? true : false;
//     }

//     if (username) {
//       const userCount = await UserModel.countDocuments({ username }).lean().exec();
//       return userCount ? true : false;
//     }

//     return false;
//   } catch (error: any) {
//     throw new Error(error, { cause: "checkUserExistsService" });
//   }
// }

type CheckUserIsActiveServiceInput = {
  username?: string | undefined;
  userId?: Types.ObjectId | undefined;
};

async function checkUserIsActiveService({
  username,
  userId,
}: CheckUserIsActiveServiceInput) {
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
    throw new Error(error, { cause: "checkUserExistsService" });
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
    throw new Error(error, { cause: "createNewUserService" });
  }
}

async function deleteUserService(userId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deletedUser = await UserModel.deleteOne({ _id: userId }).lean().exec();
    return deletedUser;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteUserService" });
  }
}

async function deleteAllUsersService(): Promise<DeleteResult> {
  try {
    const users = await UserModel.deleteMany({}).lean().exec();
    return users;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllUsersService" });
  }
}

async function getUserByIdService(
  userId: string | Types.ObjectId
): DatabaseResponseNullable<UserDocument> {
  try {
    const user = await UserModel.findById(userId).select("-password").lean().exec();
    return user;
  } catch (error: any) {
    throw new Error(error, { cause: "getUserByIdService" });
  }
}

async function getUserByUsernameService(
  username: string
): DatabaseResponseNullable<UserDocument> {
  try {
    const user = await UserModel.findOne({ username }).select("-password").lean().exec();
    return user;
  } catch (error: any) {
    throw new Error(error, { cause: "getUserByUsernameService" });
  }
}

async function getUserWithPasswordService(
  username: string
): DatabaseResponseNullable<UserDocument> {
  try {
    const userWithPassword = await UserModel.findOne({ username }).lean().exec();
    return userWithPassword;
  } catch (error: any) {
    throw new Error(error, { cause: "getUserWithPasswordService" });
  }
}

async function getAllUsersService() {
  try {
    const users = await UserModel.find().select("-password").lean().exec();
    return users;
  } catch (error: any) {
    throw new Error(error, { cause: "getAllUsersService" });
  }
}

async function getQueriedUsersService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<UserDocument>) {
  try {
    const users = await UserModel.find(filter, projection, options)
      .select("-password")
      .lean()
      .exec();
    return users;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedUsersService" });
  }
}

async function getQueriedTotalUsersService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<UserDocument>): Promise<number> {
  try {
    const totalUsers = await UserModel.countDocuments(filter).lean().exec();
    return totalUsers;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalUsersService" });
  }
}

async function updateUserByIdService({
  fields,
  updateOperator,
  _id,
}: UpdateDocumentByIdServiceInput<UserDocument>): DatabaseResponseNullable<UserDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .select("-password")
      .lean()
      .exec();
    return updatedUser;
  } catch (error: any) {
    throw new Error(error, { cause: "updateUserByIdService" });
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
    throw new Error(error, { cause: "checkUserPasswordService" });
  }
}

type UpdateUserPasswordServiceInput = {
  userId: Types.ObjectId;
  newPassword: string;
};
async function updateUserPasswordService({
  userId,
  newPassword,
}: UpdateUserPasswordServiceInput) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    )
      .select("-password")
      .lean()
      .exec();
    return updatedUser;
  } catch (error: any) {
    throw new Error(error, { cause: "updateUserPasswordService" });
  }
}

export {
  // checkUserExistsService,
  checkUserIsActiveService,
  checkUserPasswordService,
  createNewUserService,
  deleteAllUsersService,
  deleteUserService,
  getAllUsersService,
  getQueriedTotalUsersService,
  getQueriedUsersService,
  getUserByIdService,
  getUserByUsernameService,
  getUserWithPasswordService,
  updateUserByIdService,
  updateUserPasswordService,
};
