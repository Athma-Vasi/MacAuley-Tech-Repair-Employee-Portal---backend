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
import {
  createNewLeaveRequestService,
  deleteALeaveRequestService,
  getLeaveRequestByIdService,
} from './leaveRequest.service';
import { Types } from 'mongoose';

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
      response.status(404).json({ message: 'User does not exist', leaveRequestData: [] });
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
        leaveRequestData: [newLeaveRequest],
      });
    } else {
      response.status(400).json({
        message: 'New leave request could not be created',
        leaveRequestData: [],
      });
    }
  }
);

// @desc   Delete a leave request by id
// @route  DELETE /leave-request/:leaveRequestId
// @access Private/Admin/Manager
const deleteALeaveRequestHandler = expressAsyncHandler(
  async (request: DeleteALeaveRequestRequest, response: Response) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;
    const leaveRequestId = request.params.leaveRequestId as Types.ObjectId;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', leaveRequestData: [] });
      return;
    }

    // check if user has permission
    if (roles.includes('Employee')) {
      response.status(403).json({ message: 'User does not have permission', leaveRequestData: [] });
      return;
    }

    // check if leave request exists
    const leaveRequestExists = await getLeaveRequestByIdService(leaveRequestId);
    if (!leaveRequestExists) {
      response.status(404).json({ message: 'Leave request does not exist', leaveRequestData: [] });
      return;
    }

    // delete leave request
    const deletedResult = await deleteALeaveRequestService(leaveRequestId);
    if (deletedResult.acknowledged) {
      response.status(200).json({
        message: 'Leave request deleted successfully',
        leaveRequestData: [],
      });
    } else {
      response.status(400).json({
        message: 'Leave request could not be deleted',
        leaveRequestData: [],
      });
    }
  }
);

export { createNewLeaveRequestHandler, deleteALeaveRequestHandler };
