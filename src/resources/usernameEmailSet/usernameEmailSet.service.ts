import createHttpError from "http-errors";
import { UsernameEmailSetModel } from "./usernameEmailSet.model";

async function checkUsernameExistsService(filter: { username: { $in: string[] } }) {
  try {
    const count = await UsernameEmailSetModel.countDocuments(filter).lean().exec();
    return count ? true : false;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("checkUsernameExistsService");
  }
}

async function checkEmailExistsService(filter: { email: { $in: string[] } }) {
  try {
    const count = await UsernameEmailSetModel.countDocuments(filter).lean().exec();
    return count ? true : false;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("checkEmailExistsService");
  }
}

/**
 * @description only runs once to create the document (only one document exists in collection)
 * - created by DEV only
 */
async function createUsernameEmailSetService({
  username,
  email,
}: {
  username: string[];
  email: string[];
}) {
  try {
    const usernameEmailSet = await UsernameEmailSetModel.create({
      username,
      email,
    });
    return usernameEmailSet;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createUsernameEmailSetService");
  }
}

async function updateUsernameEmailSetWithUsernameService(username: string) {
  try {
    const usernameEmailSet = await UsernameEmailSetModel.findOneAndUpdate(
      {},
      {
        $push: {
          username: username,
        },
      },
      { new: true }
    )
      .lean()
      .exec();
    return usernameEmailSet;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "updateUsernameEmailSetWithUsernameService"
    );
  }
}

async function updateUsernameEmailSetWithEmailService(email: string) {
  try {
    const usernameEmailSet = await UsernameEmailSetModel.findOneAndUpdate(
      {},
      {
        $push: {
          email: email,
        },
      },
      { new: true }
    )
      .lean()
      .exec();
    return usernameEmailSet;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "updateUsernameEmailSetWithEmailService"
    );
  }
}

export {
  checkEmailExistsService,
  checkUsernameExistsService,
  createUsernameEmailSetService,
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
};
