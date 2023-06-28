import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  LeaveRequestDocument,
  ReasonForLeave,
  LeaveRequestSchema,
} from './leaveRequest.model';

import { LeaveRequestModel } from './leaveRequest.model';

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

export { createNewLeaveRequestService };
