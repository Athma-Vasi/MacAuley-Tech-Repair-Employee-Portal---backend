import expressAsyncController from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { ErrorLogDocument, ErrorLogSchema } from "./errorLog.model";
import type { Response } from "express";
import type {
  CreateNewErrorLogRequest,
  CreateNewErrorLogsBulkRequest,
  DeleteAllErrorLogsRequest,
  DeleteAnErrorLogRequest,
  GetErrorLogByIdRequest,
  GetQueriedErrorLogsByUserRequest,
  GetQueriedErrorLogsRequest,
  UpdateErrorLogByIdRequest,
  UpdateErrorLogsBulkRequest,
} from "./errorLog.types";

import {
  createNewErrorLogService,
  deleteAllErrorLogsService,
  deleteErrorLogByIdService,
  getErrorLogByIdService,
  getQueriedErrorLogsByUserService,
  getQueriedErrorLogsService,
  getQueriedTotalErrorLogsService,
  updateErrorLogByIdService,
} from "./errorLog.service";
import { FilterQuery, QueryOptions } from "mongoose";
import {
  CreateNewResourceRequest,
  DeleteResourceRequest,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
  GetResourceByIdRequest,
  HttpResult,
  QueryObjectParsedWithDefaults,
  UpdateResourceByIdRequest,
} from "../../types";
import {
  createHttpResultError,
  createHttpResultSuccess,
  removeUndefinedAndNullValues,
} from "../../utils";
import { getUserByIdService } from "../user";
import { error } from "console";

// @desc   Create a new error log request
// @route  POST api/v1/error-log
// @access Private
const createNewErrorLogController = expressAsyncController(
  async (
    request: CreateNewResourceRequest<ErrorLogSchema>,
    response: Response<HttpResult>,
  ) => {
    const { schema } = request.body;
    const errorLogResult = await createNewErrorLogService(schema);

    errorLogResult.err
      ? response.status(200).json(errorLogResult.val)
      : response.status(201).json(errorLogResult.safeUnwrap());
  },
);

// @desc   Get all error logs
// @route  GET api/v1/error-log
// @access Private/Admin/Manager
const getQueriedErrorLogsController = expressAsyncController(
  async (
    request: GetQueriedResourceRequest,
    response: Response<HttpResult>,
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      const totalResult = await getQueriedTotalErrorLogsService({
        filter: filter as FilterQuery<ErrorLogDocument> | undefined,
      });

      if (totalResult.err) {
        response.status(200).json(totalResult.val);
        return;
      }

      totalDocuments = totalResult.safeUnwrap().data[0];
    }

    const errorLogsResult = await getQueriedErrorLogsService({
      filter,
      projection,
      options,
    });

    if (errorLogsResult.err) {
      response.status(200).json(errorLogsResult.val);
      return;
    }

    response.status(200).json(
      createHttpResultSuccess({
        ...errorLogsResult.safeUnwrap(),
        pages: Math.ceil(totalDocuments / Number(options?.limit ?? 10)),
        totalDocuments,
      }),
    );
  },
);

// @desc   Get all error log requests by user
// @route  GET api/v1/error-log/user
// @access Private
const getErrorLogsByUserController = expressAsyncController(
  async (
    request: GetQueriedResourceByUserRequest,
    response: Response<HttpResult>,
  ) => {
    // anyone can view their own errorLog requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      const totalResult = await getQueriedTotalErrorLogsService({
        filter: filterWithUserId,
      });

      if (totalResult.err) {
        response.status(200).json(totalResult.val);
        return;
      }

      totalDocuments = totalResult.safeUnwrap().data[0];
    }

    const errorLogs = await getQueriedErrorLogsByUserService({
      filter,
      projection,
      options,
    });

    if (errorLogs.err) {
      response.status(200).json(errorLogs.val);
      return;
    }

    response.status(200).json(
      createHttpResultSuccess({
        ...errorLogs.safeUnwrap(),
        pages: Math.ceil(totalDocuments / Number(options?.limit ?? 10)),
        totalDocuments,
      }),
    );
  },
);

// @desc   Update error log status
// @route  PATCH api/v1/error-log/:resourceId
// @access Private/Admin/Manager
const updateErrorLogByIdController = expressAsyncController(
  async (
    request: UpdateResourceByIdRequest,
    response: Response<HttpResult>,
  ) => {
    const { resourceId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedErrorLogResult = await updateErrorLogByIdService({
      _id: resourceId,
      fields,
      updateOperator,
    });

    updatedErrorLogResult.err
      ? response.status(200).json(updatedErrorLogResult.val)
      : response.status(201).json(updatedErrorLogResult.safeUnwrap());
  },
);

// @desc   Get an error log request
// @route  GET api/v1/error-log/:resourceId
// @access Private
const getErrorLogByIdController = expressAsyncController(
  async (
    request: GetResourceByIdRequest,
    response: Response<HttpResult>,
  ) => {
    const { resourceId } = request.params;
    const errorLogResult = await getErrorLogByIdService(resourceId);

    errorLogResult.err
      ? response.status(200).json(errorLogResult.val)
      : response.status(200).json(errorLogResult.safeUnwrap());
  },
);

// @desc   Delete an error log request by its id
// @route  DELETE api/v1/error-log/:resourceId
// @access Private
const deleteAnErrorLogController = expressAsyncController(
  async (request: DeleteResourceRequest, response: Response<HttpResult>) => {
    const { resourceId } = request.params;

    const deletedResult = await deleteErrorLogByIdService(
      resourceId,
    );

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
  },
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
  },
);

// DEV ROUTE
// @desc   Create new error log requests in bulk
// @route  POST api/v1/error-log/dev
// @access Private
const createNewErrorLogsBulkController = expressAsyncController(
  async (
    request: CreateNewErrorLogsBulkRequest,
    response: Response<ResourceRequestServerResponse<ErrorLogDocument>>,
  ) => {
    const { errorLogSchemas } = request.body;

    const errorLogDocuments = await Promise.all(
      errorLogSchemas.map(async (errorLogSchema) => {
        const errorLogDocument = await createNewErrorLogService(errorLogSchema);
        return errorLogDocument;
      }),
    );

    const filteredErrorLogDocuments = errorLogDocuments.filter(
      removeUndefinedAndNullValues,
    );

    if (filteredErrorLogDocuments.length === 0) {
      response.status(400).json({
        message: "Address log requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount = errorLogSchemas.length -
      filteredErrorLogDocuments.length;

    response.status(201).json({
      message:
        `Successfully created ${filteredErrorLogDocuments.length} Address Change Requests.${
          uncreatedDocumentsAmount
            ? ` ${uncreatedDocumentsAmount} documents were not created.`
            : ""
        }}`,
      resourceData: filteredErrorLogDocuments,
    });
  },
);

// DEV ROUTE
// @desc   Update ErrorLogs in bulk
// @route  PATCH api/v1/error-log/dev
// @access Private
const updateErrorLogsBulkController = expressAsyncController(
  async (
    request: UpdateErrorLogsBulkRequest,
    response: Response<ResourceRequestServerResponse<ErrorLogDocument>>,
  ) => {
    const { errorLogFields } = request.body;

    const updatedErrorLogs = await Promise.all(
      errorLogFields.map(async (errorLogField) => {
        const {
          documentUpdate: { fields, updateOperator },
          resourceId,
        } = errorLogField;

        const updatedErrorLog = await updateErrorLogByIdService({
          _id: resourceId,
          fields,
          updateOperator,
        });

        return updatedErrorLog;
      }),
    );

    // filter out any errorLogs that were not created
    const successfullyCreatedErrorLogs = updatedErrorLogs.filter(
      removeUndefinedAndNullValues,
    );

    if (successfullyCreatedErrorLogs.length === 0) {
      response.status(400).json({
        message: "Could not create any Address Changes",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message:
        `Successfully created ${successfullyCreatedErrorLogs.length} Address Changes. ${
          errorLogFields.length - successfullyCreatedErrorLogs.length
        } Address Changes failed to be created.`,
      resourceData: successfullyCreatedErrorLogs,
    });
  },
);

export {
  createNewErrorLogController,
  createNewErrorLogsBulkController,
  deleteAllErrorLogsController,
  deleteAnErrorLogController,
  getErrorLogByIdController,
  getErrorLogsByUserController,
  getQueriedErrorLogsController,
  updateErrorLogByIdController,
  updateErrorLogsBulkController,
};
