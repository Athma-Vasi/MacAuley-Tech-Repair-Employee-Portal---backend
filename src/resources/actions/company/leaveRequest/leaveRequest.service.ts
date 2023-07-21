import type { FilterQuery, QueryOptions, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { LeaveRequestDocument, LeaveRequestSchema } from './leaveRequest.model';
import type { ParsedQs } from 'qs';

import { LeaveRequestModel } from './leaveRequest.model';
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  GetQueriedResourceRequestsServiceInput,
  GetQueriedTotalResourceRequestsServiceInput,
  QueryObjectParsed,
} from '../../../../types';

async function createNewLeaveRequestService(
  input: LeaveRequestSchema
): Promise<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.create(input);
    return leaveRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewLeaveRequestService' });
  }
}

async function getLeaveRequestByIdService(
  leaveRequestId: Types.ObjectId | string
): DatabaseResponseNullable<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId)
      .select('-__v')
      .lean()
      .exec();
    return leaveRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'getLeaveRequestByIdService' });
  }
}

async function deleteALeaveRequestService(leaveRequestId: string): Promise<DeleteResult> {
  try {
    const leaveRequest = await LeaveRequestModel.deleteOne({ _id: leaveRequestId }).lean().exec();
    return leaveRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteALeaveRequestService' });
  }
}

async function deleteAllLeaveRequestsService(): Promise<DeleteResult> {
  try {
    const leaveRequests = await LeaveRequestModel.deleteMany({}).lean().exec();
    return leaveRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllLeaveRequestsService' });
  }
}

async function getQueriedLeaveRequestsService({
  filter = {},
  projection = null,
  options = {},
}: GetQueriedResourceRequestsServiceInput<LeaveRequestDocument>): DatabaseResponse<LeaveRequestDocument> {
  try {
    const leaveRequests = await LeaveRequestModel.find(filter, projection, options).lean().exec();
    return leaveRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedLeaveRequestsService' });
  }
}

async function getQueriedTotalLeaveRequestsService({
  filter = {},
}: GetQueriedTotalResourceRequestsServiceInput<LeaveRequestDocument>): Promise<number> {
  try {
    const totalLeaveRequests = await LeaveRequestModel.countDocuments(filter).lean().exec();
    return totalLeaveRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalLeaveRequestsService' });
  }
}

async function getLeaveRequestsByUserService(
  userId: Types.ObjectId | string
): DatabaseResponse<LeaveRequestDocument> {
  try {
    const leaveRequests = await LeaveRequestModel.find({ userId }).select('-__v').lean().exec();
    return leaveRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getLeaveRequestsByUserService' });
  }
}

export {
  createNewLeaveRequestService,
  getLeaveRequestByIdService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getLeaveRequestsByUserService,
  getQueriedTotalLeaveRequestsService,
};
