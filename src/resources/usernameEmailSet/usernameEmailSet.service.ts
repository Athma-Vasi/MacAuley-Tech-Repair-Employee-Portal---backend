import { UsernameEmailSetModel } from "./usernameEmailSet.model";

async function checkUsernameExistsService(
  filter: Record<
    "$in",
    {
      username: string[];
    }
  >
) {
  try {
    const count = await UsernameEmailSetModel.countDocuments(filter).lean().exec();
    return count ? true : false;
  } catch (error: any) {
    throw new Error(error, { cause: "checkUsernameExistsService" });
  }
}

async function checkEmailExistsService(
  filter: Record<
    "$in",
    {
      email: string[];
    }
  >
) {
  try {
    const count = await UsernameEmailSetModel.countDocuments(filter).lean().exec();
    return count ? true : false;
  } catch (error: any) {
    throw new Error(error, { cause: "checkEmailExistsService" });
  }
}

/**
 * @description only runs once to create the document (only one document exists in collection)
 */
async function createUsernameEmailSetService({
  username,
  email,
}: {
  username: string;
  email: string;
}) {
  try {
    const usernameEmailSet = await UsernameEmailSetModel.create({
      username: [username],
      email: [email],
    });
    return usernameEmailSet;
  } catch (error: any) {
    throw new Error(error, { cause: "createUsernameEmailSetService" });
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
    throw new Error(error, { cause: "updateUsernameEmailSetWithUsernameService" });
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
    throw new Error(error, { cause: "updateUsernameEmailSetWithEmailService" });
  }
}

export {
  checkEmailExistsService,
  checkUsernameExistsService,
  createUsernameEmailSetService,
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
};
