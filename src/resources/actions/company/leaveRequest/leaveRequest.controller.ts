import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetLeaveRequestByIdRequest,
  GetQueriedLeaveRequestsByUserRequest,
  GetQueriedLeaveRequestsRequest,
} from './leaveRequest.types';

import {
  createNewLeaveRequestService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getLeaveRequestByIdService,
  getQueriedLeaveRequestsByUserService,
  getQueriedTotalLeaveRequestsService,
} from './leaveRequest.service';
import { LeaveRequestDocument, LeaveRequestSchema } from './leaveRequest.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';

// @desc   Create a new leave request
// @route  POST /leave-request
// @access Private
const createNewLeaveRequestHandler = expressAsyncHandler(
  async (
    request: CreateNewLeaveRequestRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
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
      response.status(400).json({ message: 'Acknowledgement is required', resourceData: [] });
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
        resourceData: [newLeaveRequest],
      });
    } else {
      response.status(400).json({
        message: 'New leave request could not be created',
        resourceData: [],
      });
    }
  }
);

// @desc   Delete a leave request by id
// @route  DELETE /leave-request/:leaveRequestId
// @access Private/Admin/Manager
const deleteALeaveRequestHandler = expressAsyncHandler(
  async (
    request: DeleteALeaveRequestRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const leaveRequestId = request.params.leaveRequestId;

    // check if leave request exists
    const leaveRequestExists = await getLeaveRequestByIdService(leaveRequestId);
    if (!leaveRequestExists) {
      response.status(404).json({ message: 'Leave request does not exist', resourceData: [] });
      return;
    }

    // delete leave request
    const deletedResult: DeleteResult = await deleteALeaveRequestService(leaveRequestId);
    if (deletedResult.deletedCount === 1) {
      response.status(200).json({
        message: 'Leave request deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'Leave request could not be deleted',
        resourceData: [],
      });
    }
  }
);

// @desc   Delete all leave requests
// @route  DELETE /leave-request
// @access Private/Admin/Manager
const deleteAllLeaveRequestsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllLeaveRequestsRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    // delete all leave requests
    const deletedResult: DeleteResult = await deleteAllLeaveRequestsService();
    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'All leave requests deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'All leave requests could not be deleted',
        resourceData: [],
      });
    }
  }
);

// @desc   Get a leave request by id
// @route  GET /leave-request/:leaveRequestId
// @access Private/Admin/Manager
const getLeaveRequestByIdHandler = expressAsyncHandler(
  async (
    request: GetLeaveRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const leaveRequestId = request.params.leaveRequestId;

    // get leave request
    const leaveRequest = await getLeaveRequestByIdService(leaveRequestId);
    if (leaveRequest) {
      response.status(200).json({
        message: 'Leave request found successfully',
        resourceData: [leaveRequest],
      });
    } else {
      response.status(404).json({
        message: 'Leave request not found',
        resourceData: [],
      });
    }
  }
);

// @desc   Get all leave requests
// @route  GET /leave-request
// @access Private/Admin/Manager
const getQueriedLeaveRequestsHandler = expressAsyncHandler(
  async (
    request: GetQueriedLeaveRequestsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

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
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Leave requests found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: leaveRequests.length,
        resourceData: leaveRequests,
      });
    }
  }
);

// @desc   Get all leave requests for a user
// @route  GET /leave-request/user
// @access Private/Admin/Manager/Employee
const getQueriedLeaveRequestsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedLeaveRequestsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalLeaveRequestsService({
        filter: filter as FilterQuery<LeaveRequestDocument> | undefined,
      });
    }

    // assign userId to filter
    Object.defineProperty(filter, 'userId', {
      value: userId,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    const leaveRequests = await getQueriedLeaveRequestsByUserService({
      filter: filter as FilterQuery<LeaveRequestDocument> | undefined,
      projection: projection as QueryOptions<LeaveRequestDocument>,
      options: options as QueryOptions<LeaveRequestDocument>,
    });
    if (leaveRequests.length === 0) {
      response.status(404).json({
        message: 'No leave requests found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Leave requests found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: leaveRequests.length,
        resourceData: leaveRequests,
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
  getQueriedLeaveRequestsByUserHandler,
};
