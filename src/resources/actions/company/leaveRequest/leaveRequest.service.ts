import type { FilterQuery, QueryOptions, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { LeaveRequestDocument, LeaveRequestSchema } from './leaveRequest.model';
import type { ParsedQs } from 'qs';

import { LeaveRequestModel } from './leaveRequest.model';
import { DatabaseResponse, DatabaseResponseNullable, QueryObjectParsed } from '../../../../types';

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
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId).lean().exec();
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

type GetAllLeaveRequestsServiceInput = {
  filter?: FilterQuery<LeaveRequestDocument> | undefined;
  projection?: QueryOptions<LeaveRequestDocument> | null | undefined;
  options?: QueryOptions<LeaveRequestDocument> | null | undefined;
};

async function getAllLeaveRequestsService({
  filter = {},
  projection = null,
  options = {},
}: GetAllLeaveRequestsServiceInput): DatabaseResponse<LeaveRequestDocument> {
  try {
    console.group('getAllLeaveRequestsService');
    console.log('filter', filter);
    console.log('projection', projection);
    console.log('options', options);
    console.groupEnd();

    const leaveRequests = await LeaveRequestModel.find(filter, projection, options).lean().exec();
    return leaveRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllLeaveRequestsService' });
  }
}

async function getLeaveRequestsByUserService(
  userId: Types.ObjectId | string
): DatabaseResponse<LeaveRequestDocument> {
  try {
    const leaveRequests = await LeaveRequestModel.find({ userId }).lean().exec();
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
  getAllLeaveRequestsService,
  getLeaveRequestsByUserService,
};
