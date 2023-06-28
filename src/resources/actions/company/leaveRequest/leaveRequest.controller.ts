import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetALeaveRequestRequest,
  GetAllLeaveRequestsRequest,
  GetLeaveRequestsByUserRequest,
  LeaveRequestServerResponse,
} from './leaveRequest.types';

import { getUserByIdService } from '../../../user';
import { createNewLeaveRequestService } from './leaveRequest.service';

// @desc   Create a new leave request
// @route  POST /leave-request
// @access Private
const createNewLeaveRequestHandler = expressAsyncHandler(
  async (request: CreateNewLeaveRequestRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      leaveRequest: {
        startDate,
        endDate,
        reasonForLeave,
        delegatedToEmployee,
        delegatedResponsibilities,
        additionalComments,
        acknowledgement,
      },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist', leaveRequestData: [] });
      return;
    }

    // check if acknowledgement is true
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', leaveRequestData: [] });
      return;
    }

    // create new leave request object
    const newLeaveRequestObject = {
      userId,
      username,
      startDate,
      endDate,
      reasonForLeave,
      delegatedToEmployee,
      delegatedResponsibilities,
      additionalComments,
      acknowledgement,
    };

    // create new leave request
    const newLeaveRequest = await createNewLeaveRequestService(newLeaveRequestObject);

    // check if new leave request was created
    if (newLeaveRequest) {
      response.status(201).json({
        message: 'New leave request created successfully',
        leaveRequestData: newLeaveRequest,
      });
    } else {
      response.status(400).json({
        message: 'New leave request could not be created',
        leaveRequestData: [],
      });
    }
  }
);
