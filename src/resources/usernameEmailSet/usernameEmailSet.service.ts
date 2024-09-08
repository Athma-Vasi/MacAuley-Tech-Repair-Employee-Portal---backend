import { UsernameEmailSetModel } from "./usernameEmailSet.model";
import { createHttpResultError, createHttpResultSuccess } from "../../utils";
import { Err, Ok } from "ts-results";

async function updateUsernameEmailSetWithUsernameService(username: string) {
  try {
    const usernameEmailSet = await UsernameEmailSetModel.findOneAndUpdate(
      {},
      { $push: { username: username } },
      { new: true },
    )
      .lean()
      .exec();

    if (usernameEmailSet === null || usernameEmailSet === undefined) {
      return new Ok(createHttpResultError({ status: 404 }));
    }

    return new Ok(createHttpResultSuccess({ data: [usernameEmailSet] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error updating usernameEmailSet with username",
      }),
    );
  }
}

async function updateUsernameEmailSetWithEmailService(email: string) {
  try {
    const usernameEmailSet = await UsernameEmailSetModel.findOneAndUpdate(
      {},
      { $push: { email: email } },
      { new: true },
    )
      .lean()
      .exec();

    if (usernameEmailSet === null || usernameEmailSet === undefined) {
      return new Ok(createHttpResultError({ status: 404 }));
    }

    return new Ok(createHttpResultSuccess({ data: [usernameEmailSet] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error updating usernameEmailSet with email",
      }),
    );
  }
}

export {
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
};
