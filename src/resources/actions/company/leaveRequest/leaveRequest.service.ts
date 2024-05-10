import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { LeaveRequestDocument, LeaveRequestSchema } from "./leaveRequest.model";

import { LeaveRequestModel } from "./leaveRequest.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";
import createHttpError from "http-errors";

async function getLeaveRequestByIdService(
  leaveRequestId: Types.ObjectId | string
): DatabaseResponseNullable<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId).lean().exec();
    return leaveRequest;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("Error in getLeaveRequestByIdService");
  }
}

async function createNewLeaveRequestService(
  leaveRequestSchema: LeaveRequestSchema
): Promise<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.create(leaveRequestSchema);
    return leaveRequest;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in createNewLeaveRequestService"
    );
  }
}

async function getQueriedLeaveRequestsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<LeaveRequestDocument>): DatabaseResponse<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.find(filter, projection, options)
      .lean()
      .exec();
    return leaveRequest;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in getQueriedLeaveRequestsService"
    );
  }
}

async function getQueriedTotalLeaveRequestsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<LeaveRequestDocument>): Promise<number> {
  try {
    const totalLeaveRequests = await LeaveRequestModel.countDocuments(filter)
      .lean()
      .exec();
    return totalLeaveRequests;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in getQueriedTotalLeaveRequestsService"
    );
  }
}

async function getQueriedLeaveRequestsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<LeaveRequestDocument>): DatabaseResponse<LeaveRequestDocument> {
  try {
    const leaveRequests = await LeaveRequestModel.find(filter, projection, options)
      .lean()
      .exec();
    return leaveRequests;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in getQueriedLeaveRequestsByUserService"
    );
  }
}

async function updateLeaveRequestByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<LeaveRequestDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const leaveRequest = await LeaveRequestModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return leaveRequest;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in updateLeaveRequestByIdService"
    );
  }
}

async function deleteLeaveRequestByIdService(
  leaveRequestId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await LeaveRequestModel.deleteOne({ _id: leaveRequestId })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in deleteLeaveRequestByIdService"
    );
  }
}

async function deleteAllLeaveRequestsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await LeaveRequestModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in deleteAllLeaveRequestsService"
    );
  }
}

export {
  getLeaveRequestByIdService,
  createNewLeaveRequestService,
  getQueriedLeaveRequestsService,
  getQueriedTotalLeaveRequestsService,
  getQueriedLeaveRequestsByUserService,
  deleteLeaveRequestByIdService,
  deleteAllLeaveRequestsService,
  updateLeaveRequestByIdService,
};
