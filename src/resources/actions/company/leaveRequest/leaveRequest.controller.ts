import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewLeaveRequestBulkRequest,
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetLeaveRequestByIdRequest,
  GetQueriedLeaveRequestsByUserRequest,
  GetQueriedLeaveRequestsRequest,
  UpdateLeaveRequestStatusByIdRequest,
} from './leaveRequest.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import type { LeaveRequestDocument, LeaveRequestSchema } from './leaveRequest.model';

import {
  createNewLeaveRequestService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getLeaveRequestByIdService,
  getQueriedLeaveRequestsByUserService,
  getQueriedTotalLeaveRequestsService,
  updateLeaveRequestStatusByIdService,
} from './leaveRequest.service';

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
      requestStatus: 'pending',
    };

    // create new leave request
    const newLeaveRequest = await createNewLeaveRequestService(newLeaveRequestObject);

    if (!newLeaveRequest) {
      response.status(400).json({
        message: 'New leave request could not be created',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${reasonForLeave} leave request`,
      resourceData: [newLeaveRequest],
    });
  }
);

// DEV ROUTE
// @desc   Create new leave requests in bulk
// @route  POST /leave-request/dev
// @access Private/Admin/Manager
const createNewLeaveRequestBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewLeaveRequestBulkRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const { leaveRequests } = request.body;

    // promise array of new leave requests
    const newLeaveRequests = await Promise.all(
      leaveRequests.map(async (leaveRequest) => {
        const {
          userId,
          username,
          startDate,
          endDate,
          reasonForLeave,
          delegatedToEmployee,
          delegatedResponsibilities,
          additionalComments,
          acknowledgement,
          requestStatus,
        } = leaveRequest;

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

        return newLeaveRequest;
      })
    );

    // filter out any leave requests that were not created
    const successfullyCreatedLeaveRequests = newLeaveRequests.filter(
      (leaveRequest) => leaveRequest
    );

    // check if any leave requests were created
    if (successfullyCreatedLeaveRequests.length === leaveRequests.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedLeaveRequests.length} leave requests`,
        resourceData: successfullyCreatedLeaveRequests,
      });
    } else {
      response.status(400).json({
        message: `Successfully created ${
          successfullyCreatedLeaveRequests.length
        } leave requests, but failed to create ${
          leaveRequests.length - successfullyCreatedLeaveRequests.length
        } leave requests`,
        resourceData: successfullyCreatedLeaveRequests,
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

    // only perform a countDocuments scan if a new query is being made
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
    if (!leaveRequests.length) {
      response.status(200).json({
        message: 'No leave requests that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found leave requests',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: leaveRequests,
    });
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

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalLeaveRequestsService({
        filter: filterWithUserId,
      });
    }

    const leaveRequests = await getQueriedLeaveRequestsByUserService({
      filter: filterWithUserId as FilterQuery<LeaveRequestDocument> | undefined,
      projection: projection as QueryOptions<LeaveRequestDocument>,
      options: options as QueryOptions<LeaveRequestDocument>,
    });
    if (!leaveRequests.length) {
      response.status(200).json({
        message: 'No leave requests found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Leave requests found successfully',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: leaveRequests,
    });
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
    if (!leaveRequest) {
      response.status(200).json({
        message: 'Leave request not found',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Leave request found successfully',
      resourceData: [leaveRequest],
    });
  }
);

// @desc   Update a leave request status by id
// @route  PATCH /leave-request/:leaveRequestId
// @access Private/Admin/Manager
const updateLeaveRequestStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateLeaveRequestStatusByIdRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const { leaveRequestId } = request.params;
    const {
      leaveRequest: { requestStatus },
    } = request.body;

    // check if leave request exists
    const leaveRequestExists = await getLeaveRequestByIdService(leaveRequestId);
    if (!leaveRequestExists) {
      response.status(404).json({ message: 'Leave request does not exist', resourceData: [] });
      return;
    }

    // update leave request
    const updatedLeaveRequest = await updateLeaveRequestStatusByIdService({
      leaveRequestId,
      requestStatus,
    });
    if (!updatedLeaveRequest) {
      response.status(400).json({
        message: 'Leave request could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Leave request updated successfully',
      resourceData: [updatedLeaveRequest],
    });
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
    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: 'Leave request could not be deleted',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Leave request deleted successfully',
      resourceData: [],
    });
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
    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: 'All leave requests could not be deleted. Please try again!',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'All leave requests deleted successfully',
      resourceData: [],
    });
  }
);

export {
  createNewLeaveRequestHandler,
  createNewLeaveRequestBulkHandler,
  deleteALeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  getQueriedLeaveRequestsHandler,
  getQueriedLeaveRequestsByUserHandler,
  updateLeaveRequestStatusByIdHandler,
};
