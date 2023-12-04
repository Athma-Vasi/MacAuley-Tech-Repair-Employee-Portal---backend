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

async function getLeaveRequestByIdService(
  leaveRequestId: Types.ObjectId | string
): DatabaseResponseNullable<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId).lean().exec();
    return leaveRequest;
  } catch (error: any) {
    throw new Error(error, { cause: "getLeaveRequestByIdService" });
  }
}

async function createNewLeaveRequestService(
  leaveRequestSchema: LeaveRequestSchema
): Promise<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.create(leaveRequestSchema);
    return leaveRequest;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewLeaveRequestService" });
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
    throw new Error(error, { cause: "getQueriedLeaveRequestsService" });
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
    throw new Error(error, { cause: "getQueriedTotalLeaveRequestsService" });
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
    throw new Error(error, { cause: "getQueriedLeaveRequestsByUserService" });
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
    throw new Error(error, { cause: "updateLeaveRequestStatusByIdService" });
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
    throw new Error(error, { cause: "deleteLeaveRequestByIdService" });
  }
}

async function deleteAllLeaveRequestsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await LeaveRequestModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllLeaveRequestsService" });
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
