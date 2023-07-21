import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetLeaveRequestByIdRequest,
  GetLeaveRequestsByUserRequest,
  LeaveRequestServerResponse,
  QueriedLeaveRequestsServerResponse,
} from './leaveRequest.types';

import {
  createNewLeaveRequestService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getLeaveRequestByIdService,
  getLeaveRequestsByUserService,
  getQueriedTotalLeaveRequestsService,
} from './leaveRequest.service';
import { LeaveRequestDocument, LeaveRequestSchema } from './leaveRequest.model';
import {
  GetQueriedResourceRequest,
  QueryObjectParsed,
  QueryObjectParsedWithDefaults,
} from '../../../../types';

// @desc   Create a new leave request
// @route  POST /leave-request
// @access Private
const createNewLeaveRequestHandler = expressAsyncHandler(
  async (request: CreateNewLeaveRequestRequest, response: Response<LeaveRequestServerResponse>) => {
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
        requestStatus,
      },
    } = request.body;

    // user must acknowledge that leaveRequest info is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', leaveRequestData: [] });
      return;
    }

    // create new leave request object
    const newLeaveRequestObject: LeaveRequestSchema = {
      userId,
      username,
      action: 'company',
      category: 'leave request',
      startDate,
      endDate,
      reasonForLeave,
      delegatedToEmployee,
      delegatedResponsibilities,
      additionalComments,
      acknowledgement,
      requestStatus,
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
      userInfo: { roles },
    } = request.body;
    const leaveRequestId = request.params.leaveRequestId;

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
    const deletedResult: DeleteResult = await deleteALeaveRequestService(leaveRequestId);
    if (deletedResult.deletedCount === 1) {
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
      userInfo: { roles },
    } = request.body;

    // check if user has permission
    if (roles.includes('Employee')) {
      response.status(403).json({ message: 'User does not have permission', leaveRequestData: [] });
      return;
    }

    // delete all leave requests
    const deletedResult: DeleteResult = await deleteAllLeaveRequestsService();
    if (deletedResult.deletedCount > 0) {
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
    const leaveRequestId = request.params.leaveRequestId;

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
const getQueriedLeaveRequestsHandler = expressAsyncHandler(
  async (
    request: GetQueriedResourceRequest,
    response: Response<QueriedLeaveRequestsServerResponse>
  ) => {
    let {
      userInfo: { roles, userId, username },
      newQueryFlag,
      totalDocuments,
    } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // check if user has permission
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'User does not have permission',
        pages: 0,
        totalDocuments: 0,
        leaveRequestsData: [],
      });
      return;
    }

    // if its a brand new query, get total number of documents that match the query options and filter
    // a performance optimization at an acceptable cost in accuracy as the actual number of documents may change between new queries
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalLeaveRequestsService({
        filter: filter as FilterQuery<LeaveRequestDocument> | undefined,
      });
    }

    // get all leave requests
    const leaveRequests = await getQueriedLeaveRequestsService({
      filter: filter as FilterQuery<LeaveRequestDocument> | undefined,
      projection: projection as QueryOptions<LeaveRequestDocument>,
      options: options as QueryOptions<LeaveRequestDocument>,
    });
    if (leaveRequests.length === 0) {
      response.status(404).json({
        message: 'No leave requests that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        leaveRequestsData: [],
      });
    } else {
      response.status(200).json({
        message: 'Leave requests found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: leaveRequests.length,
        leaveRequestsData: leaveRequests,
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
  getQueriedLeaveRequestsHandler,
  getLeaveRequestsByUserHandler,
};
