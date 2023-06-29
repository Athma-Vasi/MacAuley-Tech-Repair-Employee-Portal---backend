import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import { Types } from 'mongoose';
import type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetLeaveRequestByIdRequest,
  GetAllLeaveRequestsRequest,
  GetLeaveRequestsByUserRequest,
  LeaveRequestServerResponse,
} from './leaveRequest.types';

import { getUserByIdService } from '../../../user';
import {
  createNewLeaveRequestService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getAllLeaveRequestsService,
  getLeaveRequestByIdService,
  getLeaveRequestsByUserService,
} from './leaveRequest.service';

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

    // user must acknowledge that leaveRequest info is correct
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

// @desc   Delete all leave requests
// @route  DELETE /leave-request
// @access Private/Admin/Manager
const deleteAllLeaveRequestsHandler = expressAsyncHandler(
  async (request: DeleteAllLeaveRequestsRequest, response: Response) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;

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

    // delete all leave requests
    const deletedResult = await deleteAllLeaveRequestsService();
    if (deletedResult.acknowledged) {
      response.status(200).json({
        message: 'All leave requests deleted successfully',
        leaveRequestData: [],
      });
    } else {
      response.status(400).json({
        message: 'All leave requests could not be deleted',
        leaveRequestData: [],
      });
    }
  }
);

// @desc   Get a leave request by id
// @route  GET /leave-request/:leaveRequestId
// @access Private/Admin/Manager
const getLeaveRequestByIdHandler = expressAsyncHandler(
  async (request: GetLeaveRequestByIdRequest, response: Response<LeaveRequestServerResponse>) => {
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

    // get leave request
    const leaveRequest = await getLeaveRequestByIdService(leaveRequestId);
    if (leaveRequest) {
      response.status(200).json({
        message: 'Leave request found successfully',
        leaveRequestData: [leaveRequest],
      });
    } else {
      response.status(404).json({
        message: 'Leave request not found',
        leaveRequestData: [],
      });
    }
  }
);

// @desc   Get all leave requests
// @route  GET /leave-request
// @access Private/Admin/Manager
const getAllLeaveRequestsHandler = expressAsyncHandler(
  async (request: GetAllLeaveRequestsRequest, response: Response<LeaveRequestServerResponse>) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;

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

    // get all leave requests
    const leaveRequests = await getAllLeaveRequestsService();
    if (leaveRequests.length === 0) {
      response.status(404).json({
        message: 'No leave requests found',
        leaveRequestData: [],
      });
    } else {
      response.status(200).json({
        message: 'Leave requests found successfully',
        leaveRequestData: leaveRequests,
      });
    }
  }
);

// @desc   Get all leave requests for a user
// @route  GET /leave-request/user
// @access Private/Admin/Manager/Employee
const getLeaveRequestsByUserHandler = expressAsyncHandler(
  async (
    request: GetLeaveRequestsByUserRequest,
    response: Response<LeaveRequestServerResponse>
  ) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', leaveRequestData: [] });
      return;
    }

    // anyone can get their own leave requests
    const leaveRequests = await getLeaveRequestsByUserService(userId);
    if (leaveRequests.length === 0) {
      response.status(404).json({
        message: 'No leave requests found',
        leaveRequestData: [],
      });
    } else {
      response.status(200).json({
        message: 'Leave requests found successfully',
        leaveRequestData: leaveRequests,
      });
    }
  }
);
export {
  createNewLeaveRequestHandler,
  deleteALeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  getAllLeaveRequestsHandler,
  getLeaveRequestsByUserHandler,
};
