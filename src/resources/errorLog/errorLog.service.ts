import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { ErrorLogDocument, ErrorLogSchema } from "./errorLog.model";

import { ErrorLogModel } from "./errorLog.model";
import {
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";

async function getErrorLogByIdService(
  errorLogId: Types.ObjectId | string
): DatabaseResponseNullable<ErrorLogDocument> {
  try {
    const errorLog = await ErrorLogModel.findById(errorLogId).lean().exec();
    return errorLog;
  } catch (error: any) {
    throw new Error(error, { cause: "getErrorLogByIdService" });
  }
}

async function createNewErrorLogService(
  errorLogSchema: ErrorLogSchema
): Promise<ErrorLogDocument> {
  try {
    const errorLog = await ErrorLogModel.create(errorLogSchema);
    return errorLog;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewErrorLogService" });
  }
}

async function getQueriedErrorLogsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ErrorLogDocument>): DatabaseResponse<ErrorLogDocument> {
  try {
    const errorLog = await ErrorLogModel.find(filter, projection, options).lean().exec();
    return errorLog;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedErrorLogsService" });
  }
}

async function getQueriedTotalErrorLogsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<ErrorLogDocument>): Promise<number> {
  try {
    const totalErrorLogs = await ErrorLogModel.countDocuments(filter).lean().exec();
    return totalErrorLogs;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalErrorLogsService" });
  }
}

async function getQueriedErrorLogsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ErrorLogDocument>): DatabaseResponse<ErrorLogDocument> {
  try {
    const errorLogs = await ErrorLogModel.find(filter, projection, options).lean().exec();
    return errorLogs;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedErrorLogsByUserService" });
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
    return errorLog;
  } catch (error: any) {
    throw new Error(error, { cause: "updateErrorLogStatusByIdService" });
  }
}

async function deleteErrorLogByIdService(
  errorLogId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await ErrorLogModel.deleteOne({ _id: errorLogId })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteErrorLogByIdService" });
  }
}

async function deleteAllErrorLogsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await ErrorLogModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllErrorLogsService" });
  }
}

export {
  getErrorLogByIdService,
  createNewErrorLogService,
  getQueriedErrorLogsService,
  getQueriedTotalErrorLogsService,
  getQueriedErrorLogsByUserService,
  deleteErrorLogByIdService,
  deleteAllErrorLogsService,
  updateErrorLogByIdService,
};
