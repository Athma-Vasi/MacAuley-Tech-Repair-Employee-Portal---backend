import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
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
import createHttpError from "http-errors";

// @desc   Create a new leave request
// @route  POST api/v1/actions/company/leave-request
// @access Private
const createNewLeaveRequestController = expressAsyncController(
  async (
    request: CreateNewLeaveRequestRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId, username },
      leaveRequestSchema,
    } = request.body;

    const newLeaveRequestSchema: LeaveRequestSchema = {
      ...leaveRequestSchema,
      userId,
      username,
    };

    const leaveRequestDocument = await createNewLeaveRequestService(
      newLeaveRequestSchema
    );
    if (!leaveRequestDocument) {
      return next(
        new createHttpError.InternalServerError(
          "New leave request could not be created. Please try again!"
        )
      );
    }

    response.status(201).json({
      message: `Successfully created ${leaveRequestDocument.reasonForLeave} leave request`,
      resourceData: [leaveRequestDocument],
    });
  }
);

// @desc   Get all leaveRequests
// @route  GET api/v1/actions/company/leave-request
// @access Private/Admin/Manager
const getQueriedLeaveRequestsController = expressAsyncController(
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
// @route  GET api/v1/actions/company/leave-request/user
// @access Private
const getLeaveRequestsByUserController = expressAsyncController(
  async (
    request: GetQueriedLeaveRequestsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<LeaveRequestDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

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
// @route  PATCH api/v1/actions/company/leave-request/:leaveRequestId
// @access Private/Admin/Manager
const updateLeaveRequestByIdController = expressAsyncController(
  async (
    request: UpdateLeaveRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>,
    next: NextFunction
  ) => {
    const { leaveRequestId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const isUserExists = await getUserByIdService(userId);
    if (!isUserExists) {
      return next(
        new createHttpError.NotFound(
          `User with id: ${userId} does not exist. Please provide a valid user id`
        )
      );
    }

    const updatedLeaveRequest = await updateLeaveRequestByIdService({
      _id: leaveRequestId,
      fields,
      updateOperator,
    });

    if (!updatedLeaveRequest) {
      return next(
        new createHttpError.InternalServerError(
          "Leave Request request status update failed. Please try again!"
        )
      );
    }

    response.status(200).json({
      message: "Leave Request request status updated successfully",
      resourceData: [updatedLeaveRequest],
    });
  }
);

// @desc   Get an leaveRequest request
// @route  GET api/v1/actions/company/leave-request/:leaveRequestId
// @access Private
const getLeaveRequestByIdController = expressAsyncController(
  async (
    request: GetLeaveRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>,
    next: NextFunction
  ) => {
    const { leaveRequestId } = request.params;
    const leaveRequest = await getLeaveRequestByIdService(leaveRequestId);
    if (!leaveRequest) {
      return next(
        new createHttpError.NotFound(
          `Leave Request request with id: ${leaveRequestId} not found. Please provide a valid leave request id`
        )
      );
    }

    response.status(200).json({
      message: "Leave Request request found successfully",
      resourceData: [leaveRequest],
    });
  }
);

// @desc   Delete an leaveRequest request by its id
// @route  DELETE api/v1/actions/company/leave-request/:leaveRequestId
// @access Private
const deleteLeaveRequestController = expressAsyncController(
  async (request: DeleteLeaveRequestRequest, response: Response, next: NextFunction) => {
    const { leaveRequestId } = request.params;

    const deletedResult: DeleteResult = await deleteLeaveRequestByIdService(
      leaveRequestId
    );

    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "Leave Request request could not be deleted. Please try again!"
        )
      );
    }

    response.status(200).json({
      message: "Leave Request request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all leaveRequest requests
// @route   DELETE api/v1/actions/company/leave-request/delete-all
// @access  Private
const deleteAllLeaveRequestsController = expressAsyncController(
  async (
    _request: DeleteAllLeaveRequestsRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllLeaveRequestsService();

    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "All leaveRequest requests could not be deleted. Please try again!"
        )
      );
    }

    response.status(200).json({
      message: "All leaveRequest requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new leaveRequest requests in bulk
// @route  POST api/v1/actions/company/leave-request/dev
// @access Private
const createNewLeaveRequestsBulkController = expressAsyncController(
  async (
    request: CreateNewLeaveRequestsBulkRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>,
    next: NextFunction
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

    const filteredLeaveRequestDocuments = leaveRequestDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredLeaveRequestDocuments.length === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Leave Request requests creation failed. Please try again!"
        )
      );
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
// @route  PATCH api/v1/actions/company/leave-request/dev
// @access Private
const updateLeaveRequestsBulkController = expressAsyncController(
  async (
    request: UpdateLeaveRequestsBulkRequest,
    response: Response<ResourceRequestServerResponse<LeaveRequestDocument>>,
    next: NextFunction
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
      return next(
        new createHttpError.InternalServerError(
          "Leave Request requests update failed. Please try again!"
        )
      );
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
  createNewLeaveRequestController,
  getQueriedLeaveRequestsController,
  getLeaveRequestsByUserController,
  getLeaveRequestByIdController,
  deleteLeaveRequestController,
  deleteAllLeaveRequestsController,
  updateLeaveRequestByIdController,
  createNewLeaveRequestsBulkController,
  updateLeaveRequestsBulkController,
};
