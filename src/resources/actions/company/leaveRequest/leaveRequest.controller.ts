import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewLeaveRequestRequest,
  CreateNewLeaveRequestsBulkRequest,
  DeleteAllLeaveRequestsRequest,
  DeleteLeaveRequestRequest,
  GetLeaveRequestByIdRequest,
  GetQueriedLeaveRequestsByUserRequest,
  GetQueriedLeaveRequestsRequest,
  UpdateLeaveRequestByIdRequest,
  UpdateLeaveRequestsBulkRequest,
} from "./leaveRequest.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { LeaveRequestDocument, LeaveRequestSchema } from "./leaveRequest.model";

import {
  createNewLeaveRequestService,
  deleteAllLeaveRequestsService,
  deleteLeaveRequestByIdService,
  getLeaveRequestByIdService,
  getQueriedLeaveRequestsByUserService,
  getQueriedLeaveRequestsService,
  getQueriedTotalLeaveRequestsService,
  updateLeaveRequestByIdService,
} from "./leaveRequest.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";

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
      leaveRequestFields,
    } = request.body;

    // create new leave request object
    const leaveRequestSchema: LeaveRequestSchema = {
      ...leaveRequestFields,
      userId,
      username,
    };

    const leaveRequestDocument = await createNewLeaveRequestService(leaveRequestSchema);

    if (!leaveRequestDocument) {
      response.status(400).json({
        message: "New leave request could not be created",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${leaveRequestDocument.reasonForLeave} leave request`,
      resourceData: [leaveRequestDocument],
    });
  }
);

// @desc   Get all leaveRequests
// @route  GET api/v1/company/leave-request
// @access Private/Admin/Manager
const getQueriedLeaveRequestsHandler = expressAsyncHandler(
  async (
    request: GetQueriedLeaveRequestsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalLeaveRequestsService({
        filter: filter as FilterQuery<LeaveRequestDocument> | undefined,
      });
    }

    // get all leaveRequests
    const leaveRequest = await getQueriedLeaveRequestsService({
      filter: filter as FilterQuery<LeaveRequestDocument> | undefined,
      projection: projection as QueryOptions<LeaveRequestDocument>,
      options: options as QueryOptions<LeaveRequestDocument>,
    });

    if (!leaveRequest.length) {
      response.status(200).json({
        message: "No leaveRequests that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "LeaveRequests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: leaveRequest,
    });
  }
);

// @desc   Get all leaveRequest requests by user
// @route  GET api/v1/company/leave-request/user
// @access Private
const getLeaveRequestsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedLeaveRequestsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    // anyone can view their own leaveRequest requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalLeaveRequestsService({
        filter: filterWithUserId,
      });
    }

    // get all leaveRequest requests by user
    const leaveRequests = await getQueriedLeaveRequestsByUserService({
      filter: filterWithUserId as FilterQuery<LeaveRequestDocument> | undefined,
      projection: projection as QueryOptions<LeaveRequestDocument>,
      options: options as QueryOptions<LeaveRequestDocument>,
    });

    if (!leaveRequests.length) {
      response.status(200).json({
        message: "No leaveRequest requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Leave Request requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: leaveRequests,
    });
  }
);

// @desc   Update leaveRequest status
// @route  PATCH api/v1/company/leave-request/:leaveRequestId
// @access Private/Admin/Manager
const updateLeaveRequestStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateLeaveRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const { leaveRequestId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update leaveRequest request status
    const updatedLeaveRequest = await updateLeaveRequestByIdService({
      _id: leaveRequestId,
      fields,
      updateOperator,
    });

    if (!updatedLeaveRequest) {
      response.status(400).json({
        message: "Leave Request request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Leave Request request status updated successfully",
      resourceData: [updatedLeaveRequest],
    });
  }
);

// @desc   Get an leaveRequest request
// @route  GET api/v1/company/leave-request/:leaveRequestId
// @access Private
const getLeaveRequestByIdHandler = expressAsyncHandler(
  async (
    request: GetLeaveRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const { leaveRequestId } = request.params;
    const leaveRequest = await getLeaveRequestByIdService(leaveRequestId);
    if (!leaveRequest) {
      response
        .status(404)
        .json({ message: "Leave Request request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Leave Request request found successfully",
      resourceData: [leaveRequest],
    });
  }
);

// @desc   Delete an leaveRequest request by its id
// @route  DELETE api/v1/company/leave-request/:leaveRequestId
// @access Private
const deleteLeaveRequestHandler = expressAsyncHandler(
  async (request: DeleteLeaveRequestRequest, response: Response) => {
    const { leaveRequestId } = request.params;

    // delete leaveRequest request by id
    const deletedResult: DeleteResult = await deleteLeaveRequestByIdService(
      leaveRequestId
    );

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Leave Request request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Leave Request request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all leaveRequest requests
// @route   DELETE api/v1/company/leave-request/delete-all
// @access  Private
const deleteAllLeaveRequestsHandler = expressAsyncHandler(
  async (_request: DeleteAllLeaveRequestsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllLeaveRequestsService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All leaveRequest requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All leaveRequest requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new leaveRequest requests in bulk
// @route  POST api/v1/company/leave-request/dev
// @access Private
const createNewLeaveRequestsBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewLeaveRequestsBulkRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const { leaveRequestSchemas } = request.body;

    const leaveRequestDocuments = await Promise.all(
      leaveRequestSchemas.map(async (leaveRequestSchema) => {
        const leaveRequestDocument = await createNewLeaveRequestService(
          leaveRequestSchema
        );
        return leaveRequestDocument;
      })
    );

    // filter out any null documents
    const filteredLeaveRequestDocuments = leaveRequestDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredLeaveRequestDocuments.length === 0) {
      response.status(400).json({
        message: "Leave Request requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      leaveRequestSchemas.length - filteredLeaveRequestDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredLeaveRequestDocuments.length
      } LeaveRequest Requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredLeaveRequestDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Leave Requests in bulk
// @route  PATCH api/v1/company/leave-request/dev
// @access Private
const updateLeaveRequestsBulkHandler = expressAsyncHandler(
  async (
    request: UpdateLeaveRequestsBulkRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const { leaveRequestFields } = request.body;

    const updatedLeaveRequests = await Promise.all(
      leaveRequestFields.map(async (leaveRequestField) => {
        const {
          documentUpdate: { fields, updateOperator },
          leaveRequestId,
        } = leaveRequestField;

        const updatedLeaveRequest = await updateLeaveRequestByIdService({
          _id: leaveRequestId,
          fields,
          updateOperator,
        });

        return updatedLeaveRequest;
      })
    );

    // filter out any leaveRequests that were not created
    const successfullyCreatedLeaveRequests = updatedLeaveRequests.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedLeaveRequests.length === 0) {
      response.status(400).json({
        message: "Could not create any Leave Requests",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedLeaveRequests.length
      } Leave Requests. ${
        leaveRequestFields.length - successfullyCreatedLeaveRequests.length
      } Leave Requests failed to be created.`,
      resourceData: successfullyCreatedLeaveRequests,
    });
  }
);

export {
  createNewLeaveRequestHandler,
  getQueriedLeaveRequestsHandler,
  getLeaveRequestsByUserHandler,
  getLeaveRequestByIdHandler,
  deleteLeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  updateLeaveRequestStatusByIdHandler,
  createNewLeaveRequestsBulkHandler,
  updateLeaveRequestsBulkHandler,
};
