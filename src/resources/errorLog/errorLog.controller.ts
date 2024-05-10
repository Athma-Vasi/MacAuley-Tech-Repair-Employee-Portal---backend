import expressAsyncController from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { ErrorLogDocument, ErrorLogSchema } from "./errorLog.model";
import type { Response } from "express";
import type {
  CreateNewErrorLogRequest,
  DeleteAnErrorLogRequest,
  DeleteAllErrorLogsRequest,
  GetQueriedErrorLogsByUserRequest,
  GetErrorLogByIdRequest,
  UpdateErrorLogByIdRequest,
  CreateNewErrorLogsBulkRequest,
  UpdateErrorLogsBulkRequest,
  GetQueriedErrorLogsRequest,
} from "./errorLog.types";

import {
  createNewErrorLogService,
  deleteErrorLogByIdService,
  deleteAllErrorLogsService,
  getErrorLogByIdService,
  getQueriedErrorLogsByUserService,
  getQueriedTotalErrorLogsService,
  getQueriedErrorLogsService,
  updateErrorLogByIdService,
} from "./errorLog.service";
import { FilterQuery, QueryOptions } from "mongoose";
import {
  ResourceRequestServerResponse,
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
} from "../../types";
import { removeUndefinedAndNullValues } from "../../utils";
import { getUserByIdService } from "../user";

// @desc   Create a new error log request
// @route  POST api/v1/error-log
// @access Private
const createNewErrorLogController = expressAsyncController(
  async (
    request: CreateNewErrorLogRequest,
    response: Response<ResourceRequestServerResponse<ErrorLogDocument>>
  ) => {
    const { errorLogShema } = request.body;

    // create new errorLog request
    const errorLogDocument = await createNewErrorLogService(errorLogShema);
    if (!errorLogDocument) {
      response
        .status(400)
        .json({ message: "Error creating error log", resourceData: [] });
      return;
    }

    response.status(201).json({
      message: "Error log created successfully",
      resourceData: [errorLogDocument],
    });
  }
);

// @desc   Get all error logs
// @route  GET api/v1/error-log
// @access Private/Admin/Manager
const getQueriedErrorLogsController = expressAsyncController(
  async (
    request: GetQueriedErrorLogsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ErrorLogDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalErrorLogsService({
        filter: filter as FilterQuery<ErrorLogDocument> | undefined,
      });
    }

    // get all error logs
    const errorLog = await getQueriedErrorLogsService({
      filter: filter as FilterQuery<ErrorLogDocument> | undefined,
      projection: projection as QueryOptions<ErrorLogDocument>,
      options: options as QueryOptions<ErrorLogDocument>,
    });

    if (!errorLog.length) {
      response.status(200).json({
        message: "No error logs that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Address logs found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: errorLog,
    });
  }
);

// @desc   Get all error log requests by user
// @route  GET api/v1/error-log/user
// @access Private
const getErrorLogsByUserController = expressAsyncController(
  async (
    request: GetQueriedErrorLogsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ErrorLogDocument>>
  ) => {
    // anyone can view their own errorLog requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalErrorLogsService({
        filter: filterWithUserId,
      });
    }

    // get all errorLog requests by user
    const errorLogs = await getQueriedErrorLogsByUserService({
      filter: filterWithUserId as FilterQuery<ErrorLogDocument> | undefined,
      projection: projection as QueryOptions<ErrorLogDocument>,
      options: options as QueryOptions<ErrorLogDocument>,
    });
    if (errorLogs.length === 0) {
      response.status(200).json({
        message: "No error log requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: "Address log requests found successfully",
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: errorLogs,
      });
    }
  }
);

// @desc   Update error log status
// @route  PATCH api/v1/error-log/:errorLogId
// @access Private/Admin/Manager
const updateErrorLogByIdController = expressAsyncController(
  async (
    request: UpdateErrorLogByIdRequest,
    response: Response<ResourceRequestServerResponse<ErrorLogDocument>>
  ) => {
    const { errorLogId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update errorLog request status
    const updatedErrorLog = await updateErrorLogByIdService({
      _id: errorLogId,
      fields,
      updateOperator,
    });

    if (!updatedErrorLog) {
      response.status(400).json({
        message: "Address log request status update failed",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Address log request status updated successfully",
      resourceData: [updatedErrorLog],
    });
  }
);

// @desc   Get an error log request
// @route  GET api/v1/error-log/:errorLogId
// @access Private
const getErrorLogByIdController = expressAsyncController(
  async (
    request: GetErrorLogByIdRequest,
    response: Response<ResourceRequestServerResponse<ErrorLogDocument>>
  ) => {
    const { errorLogId } = request.params;
    // get errorLog request by id
    const errorLog = await getErrorLogByIdService(errorLogId);
    if (!errorLog) {
      response
        .status(404)
        .json({ message: "ErrorLog request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Address log request found successfully",
      resourceData: [errorLog],
    });
  }
);

// @desc   Delete an error log request by its id
// @route  DELETE api/v1/error-log/:errorLogId
// @access Private
const deleteAnErrorLogController = expressAsyncController(
  async (request: DeleteAnErrorLogRequest, response: Response) => {
    const { errorLogId } = request.params;

    // delete errorLog request by id
    const deletedResult: DeleteResult = await deleteErrorLogByIdService(errorLogId);

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Address log request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "ErrorLog request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all error log requests
// @route   DELETE api/v1/error-log/delete-all
// @access  Private
const deleteAllErrorLogsController = expressAsyncController(
  async (_request: DeleteAllErrorLogsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllErrorLogsService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All error log requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All error log requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new error log requests in bulk
// @route  POST api/v1/error-log/dev
// @access Private
const createNewErrorLogsBulkController = expressAsyncController(
  async (
    request: CreateNewErrorLogsBulkRequest,
    response: Response<ResourceRequestServerResponse<ErrorLogDocument>>
  ) => {
    const { errorLogSchemas } = request.body;

    const errorLogDocuments = await Promise.all(
      errorLogSchemas.map(async (errorLogSchema) => {
        const errorLogDocument = await createNewErrorLogService(errorLogSchema);
        return errorLogDocument;
      })
    );

    const filteredErrorLogDocuments = errorLogDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredErrorLogDocuments.length === 0) {
      response.status(400).json({
        message: "Address log requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      errorLogSchemas.length - filteredErrorLogDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredErrorLogDocuments.length
      } Address Change Requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredErrorLogDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update ErrorLogs in bulk
// @route  PATCH api/v1/error-log/dev
// @access Private
const updateErrorLogsBulkController = expressAsyncController(
  async (
    request: UpdateErrorLogsBulkRequest,
    response: Response<ResourceRequestServerResponse<ErrorLogDocument>>
  ) => {
    const { errorLogFields } = request.body;

    const updatedErrorLogs = await Promise.all(
      errorLogFields.map(async (errorLogField) => {
        const {
          documentUpdate: { fields, updateOperator },
          errorLogId,
        } = errorLogField;

        const updatedErrorLog = await updateErrorLogByIdService({
          _id: errorLogId,
          fields,
          updateOperator,
        });

        return updatedErrorLog;
      })
    );

    // filter out any errorLogs that were not created
    const successfullyCreatedErrorLogs = updatedErrorLogs.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedErrorLogs.length === 0) {
      response.status(400).json({
        message: "Could not create any Address Changes",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedErrorLogs.length
      } Address Changes. ${
        errorLogFields.length - successfullyCreatedErrorLogs.length
      } Address Changes failed to be created.`,
      resourceData: successfullyCreatedErrorLogs,
    });
  }
);

export {
  createNewErrorLogController,
  getQueriedErrorLogsController,
  getErrorLogsByUserController,
  getErrorLogByIdController,
  deleteAnErrorLogController,
  deleteAllErrorLogsController,
  updateErrorLogByIdController,
  createNewErrorLogsBulkController,
  updateErrorLogsBulkController,
};
