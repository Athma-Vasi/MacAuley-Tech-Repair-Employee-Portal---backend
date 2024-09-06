import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { ErrorLogDocument, ErrorLogSchema } from "./errorLog.model";

import { ErrorLogModel } from "./errorLog.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";
import { createHttpResultError, createHttpResultSuccess } from "../../utils";
import { Err, Ok } from "ts-results";

async function getErrorLogByIdService(
  errorLogId: Types.ObjectId | string,
) {
  try {
    const errorLog = await ErrorLogModel.findById(errorLogId).lean().exec();
    if (errorLog === null || errorLog === undefined) {
      return new Ok(
        createHttpResultSuccess({ message: "Error log not found" }),
      );
    }

    return new Ok(createHttpResultSuccess({ data: [errorLog] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting error log by id",
      }),
    );
  }
}

async function createNewErrorLogService(
  errorLogSchema: ErrorLogSchema,
) {
  try {
    const errorLog = await ErrorLogModel.create(errorLogSchema);
    return new Ok(createHttpResultSuccess({ data: [errorLog] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error creating new error log",
      }),
    );
  }
}

async function getQueriedErrorLogsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ErrorLogDocument>) {
  try {
    const errorLogs = await ErrorLogModel.find(filter, projection, options)
      .lean().exec();
    return new Ok(createHttpResultSuccess({ data: errorLogs }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting queried error logs",
      }),
    );
  }
}

async function getQueriedTotalErrorLogsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<ErrorLogDocument>) {
  try {
    const totalErrorLogs = await ErrorLogModel.countDocuments(filter).lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: [totalErrorLogs] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting queried total error logs",
      }),
    );
  }
}

async function getQueriedErrorLogsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ErrorLogDocument>) {
  try {
    const errorLogs = await ErrorLogModel.find(filter, projection, options)
      .lean().exec();
    return new Ok(createHttpResultSuccess({ data: errorLogs }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting queried error logs by user",
      }),
    );
  }
}

async function updateErrorLogByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<ErrorLogDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const errorLog = await ErrorLogModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: [errorLog] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error updating error log by id",
      }),
    );
  }
}

async function deleteErrorLogByIdService(
  errorLogId: Types.ObjectId | string,
) {
  try {
    const deletedResult = await ErrorLogModel.deleteOne({ _id: errorLogId })
      .lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: [deletedResult] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error deleting error log by id",
      }),
    );
  }
}

async function deleteAllErrorLogsService() {
  try {
    const deletedResult = await ErrorLogModel.deleteMany({}).lean().exec();
    return new Ok(createHttpResultSuccess({ data: [deletedResult] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error deleting all error logs",
      }),
    );
  }
}

export {
  createNewErrorLogService,
  deleteAllErrorLogsService,
  deleteErrorLogByIdService,
  getErrorLogByIdService,
  getQueriedErrorLogsByUserService,
  getQueriedErrorLogsService,
  getQueriedTotalErrorLogsService,
  updateErrorLogByIdService,
};
