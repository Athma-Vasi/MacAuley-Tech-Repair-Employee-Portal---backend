import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewAnonymousRequestRequest,
  CreateNewAnonymousRequestsBulkRequest,
  DeleteAllAnonymousRequestsRequest,
  DeleteAnonymousRequestRequest,
  GetAnonymousRequestByIdRequest,
  GetQueriedAnonymousRequestsByUserRequest,
  GetQueriedAnonymousRequestsRequest,
  UpdateAnonymousRequestByIdRequest,
  UpdateAnonymousRequestsBulkRequest,
} from "./anonymousRequest.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { AnonymousRequestDocument } from "./anonymousRequest.model";

import {
  createNewAnonymousRequestService,
  deleteAllAnonymousRequestsService,
  deleteAnonymousRequestByIdService,
  getAnonymousRequestByIdService,
  getQueriedAnonymousRequestsByUserService,
  getQueriedAnonymousRequestsService,
  getQueriedTotalAnonymousRequestsService,
  updateAnonymousRequestByIdService,
} from "./anonymousRequest.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";
import createHttpError from "http-errors";

// @desc   Create a new anonymous request
// @route  POST api/v1/actions/general/anonymous-request
// @access Private
const createNewAnonymousRequestController = expressAsyncController(
  async (
    request: CreateNewAnonymousRequestRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>,
    next: NextFunction
  ) => {
    const { anonymousRequestSchema } = request.body;

    const anonymousRequestDocument = await createNewAnonymousRequestService(
      anonymousRequestSchema
    );
    if (!anonymousRequestDocument) {
      return next(
        new createHttpError.InternalServerError(
          "New anonymous document could not be created"
        )
      );
    }

    response.status(201).json({
      message: `Successfully created ${anonymousRequestDocument.title} anonymous request`,
      resourceData: [anonymousRequestDocument],
    });
  }
);

// @desc   Get all anonymousRequests
// @route  GET api/v1/actions/general/anonymous-request
// @access Private/Admin/Manager
const getQueriedAnonymousRequestsController = expressAsyncController(
  async (
    request: GetQueriedAnonymousRequestsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnonymousRequestDocument>>,
    next: NextFunction
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAnonymousRequestsService({
        filter: filter as FilterQuery<AnonymousRequestDocument> | undefined,
      });
    }

    const anonymousRequest = await getQueriedAnonymousRequestsService({
      filter: filter as FilterQuery<AnonymousRequestDocument> | undefined,
      projection: projection as QueryOptions<AnonymousRequestDocument>,
      options: options as QueryOptions<AnonymousRequestDocument>,
    });

    if (!anonymousRequest.length) {
      response.status(200).json({
        message: "No anonymousRequests that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "AnonymousRequests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: anonymousRequest,
    });
  }
);

// @desc   Get all anonymousRequest requests by user
// @route  GET api/v1/actions/general/anonymous-request
// @access Private
const getAnonymousRequestsByUserController = expressAsyncController(
  async (
    request: GetQueriedAnonymousRequestsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnonymousRequestDocument>>,
    next: NextFunction
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
      totalDocuments = await getQueriedTotalAnonymousRequestsService({
        filter: filterWithUserId,
      });
    }

    const anonymousRequests = await getQueriedAnonymousRequestsByUserService({
      filter: filterWithUserId as FilterQuery<AnonymousRequestDocument> | undefined,
      projection: projection as QueryOptions<AnonymousRequestDocument>,
      options: options as QueryOptions<AnonymousRequestDocument>,
    });

    if (!anonymousRequests.length) {
      response.status(200).json({
        message: "No anonymousRequest requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Anonymous Request requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: anonymousRequests,
    });
  }
);

// @desc   Update anonymousRequest status
// @route  PATCH api/v1/actions/general/anonymous-request
// @access Private/Admin/Manager
const updateAnonymousRequestByIdController = expressAsyncController(
  async (
    request: UpdateAnonymousRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>,
    next: NextFunction
  ) => {
    const { anonymousRequestId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    // update anonymousRequest document status
    const updatedAnonymousRequest = await updateAnonymousRequestByIdService({
      _id: anonymousRequestId,
      fields,
      updateOperator,
    });

    if (!updatedAnonymousRequest) {
      return next(
        new createHttpError.InternalServerError(
          "Anonymous Request document could not be updated. Please try again!"
        )
      );
    }

    response.status(200).json({
      message: "Anonymous Request document status updated successfully",
      resourceData: [updatedAnonymousRequest],
    });
  }
);

// @desc   Get an anonymousRequest request
// @route  GET api/v1/actions/general/anonymous-request
// @access Private
const getAnonymousRequestByIdController = expressAsyncController(
  async (
    request: GetAnonymousRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>,
    next: NextFunction
  ) => {
    const { anonymousRequestId } = request.params;
    const anonymousRequest = await getAnonymousRequestByIdService(anonymousRequestId);
    if (!anonymousRequest) {
      return next(new createHttpError.NotFound("Anonymous Request document not found"));
    }

    response.status(200).json({
      message: "Anonymous Request document found successfully",
      resourceData: [anonymousRequest],
    });
  }
);

// @desc   Delete an anonymousRequest document by its id
// @route  DELETE api/v1/actions/general/anonymous-request
// @access Private
const deleteAnonymousRequestController = expressAsyncController(
  async (
    request: DeleteAnonymousRequestRequest,
    response: Response,
    next: NextFunction
  ) => {
    const { anonymousRequestId } = request.params;

    const deletedResult: DeleteResult = await deleteAnonymousRequestByIdService(
      anonymousRequestId
    );

    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "Anonymous Request document could not be deleted"
        )
      );
    }

    response.status(200).json({
      message: "Anonymous Request document deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all anonymousRequest requests
// @route   DELETE api/v1/actions/general/request-resource/anonymous-request
// @access  Private
const deleteAllAnonymousRequestsController = expressAsyncController(
  async (
    _request: DeleteAllAnonymousRequestsRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllAnonymousRequestsService();

    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "Anonymous Request requests could not be deleted"
        )
      );
    }

    response.status(200).json({
      message: "All anonymousRequest requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new anonymousRequest requests in bulk
// @route  POST api/v1/actions/general/anonymous-request
// @access Private
const createNewAnonymousRequestsBulkController = expressAsyncController(
  async (
    request: CreateNewAnonymousRequestsBulkRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const { anonymousRequestSchemas } = request.body;

    const anonymousRequestDocuments = await Promise.all(
      anonymousRequestSchemas.map(async (anonymousRequestSchema) => {
        const anonymousRequestDocument = await createNewAnonymousRequestService(
          anonymousRequestSchema
        );
        return anonymousRequestDocument;
      })
    );

    const filteredAnonymousRequestDocuments = anonymousRequestDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredAnonymousRequestDocuments.length === 0) {
      response.status(400).json({
        message: "Anonymous Request requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      anonymousRequestSchemas.length - filteredAnonymousRequestDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredAnonymousRequestDocuments.length
      } Anonymous Request requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredAnonymousRequestDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Anonymous Requests in bulk
// @route  PATCH api/v1/actions/general/anonymous-request
// @access Private
const updateAnonymousRequestsBulkController = expressAsyncController(
  async (
    request: UpdateAnonymousRequestsBulkRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>,
    next: NextFunction
  ) => {
    const { anonymousRequestFields } = request.body;

    const updatedAnonymousRequests = await Promise.all(
      anonymousRequestFields.map(async (anonymousRequestField) => {
        const {
          documentUpdate: { fields, updateOperator },
          anonymousRequestId,
        } = anonymousRequestField;

        const updatedAnonymousRequest = await updateAnonymousRequestByIdService({
          _id: anonymousRequestId,
          fields,
          updateOperator,
        });

        return updatedAnonymousRequest;
      })
    );

    // filter out any anonymousRequests that were not created
    const successfullyCreatedAnonymousRequests = updatedAnonymousRequests.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedAnonymousRequests.length === 0) {
      response.status(400).json({
        message: "Could not create any Anonymous Requests",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedAnonymousRequests.length
      } Anonymous Requests. ${
        anonymousRequestFields.length - successfullyCreatedAnonymousRequests.length
      } Anonymous Requests failed to be created.`,
      resourceData: successfullyCreatedAnonymousRequests,
    });
  }
);

export {
  createNewAnonymousRequestController,
  getQueriedAnonymousRequestsController,
  getAnonymousRequestsByUserController,
  getAnonymousRequestByIdController,
  deleteAnonymousRequestController,
  deleteAllAnonymousRequestsController,
  updateAnonymousRequestByIdController,
  createNewAnonymousRequestsBulkController,
  updateAnonymousRequestsBulkController,
};
