import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  LeaveRequestDocument,
  ReasonForLeave,
  LeaveRequestSchema,
} from './leaveRequest.model';

import { LeaveRequestModel } from './leaveRequest.model';
import { DatabaseResponseNullable } from '../../../../types';

type CreateNewLeaveRequestServiceInput = {
  userId: Types.ObjectId;
  username: string;
  startDate: Date;
  endDate: Date;
  reasonForLeave: ReasonForLeave;
  delegatedToEmployee: string;
  delegatedResponsibilities: string;
  additionalComments: string;
  acknowledgement: boolean;
};

async function createNewLeaveRequestService(
  input: CreateNewLeaveRequestServiceInput
): Promise<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.create(input);
    return leaveRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewLeaveRequestService' });
  }
}

async function getLeaveRequestByIdService(
  leaveRequestId: Types.ObjectId
): DatabaseResponseNullable<LeaveRequestDocument> {
  try {
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId).lean().exec();
    return leaveRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'getLeaveRequestByIdService' });
  }
}

async function deleteALeaveRequestService(leaveRequestId: Types.ObjectId): Promise<DeleteResult> {
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

async function getAllLeaveRequestsService(): Promise<
  (FlattenMaps<LeaveRequestDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
  try {
    const leaveRequests = await LeaveRequestModel.find({}).lean().exec();
    return leaveRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllLeaveRequestsService' });
  }
}

export {
  createNewLeaveRequestService,
  getLeaveRequestByIdService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getAllLeaveRequestsService,
};
