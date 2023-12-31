import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
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
import type {
  AnonymousRequestDocument,
  AnonymousRequestSchema,
} from "./anonymousRequest.model";

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

// @desc   Create a new anonymous request
// @route  POST api/v1/actions/general/anonymous-request
// @access Private
const createNewAnonymousRequestHandler = expressAsyncHandler(
  async (
    request: CreateNewAnonymousRequestRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const { anonymousRequestSchema } = request.body;

    const anonymousRequestDocument = await createNewAnonymousRequestService(
      anonymousRequestSchema
    );

    if (!anonymousRequestDocument) {
      response.status(400).json({
        message: "New anonymous request could not be created",
        resourceData: [],
      });
      return;
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
const getQueriedAnonymousRequestsHandler = expressAsyncHandler(
  async (
    request: GetQueriedAnonymousRequestsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnonymousRequestDocument>>
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

    // get all anonymousRequests
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
const getAnonymousRequestsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedAnonymousRequestsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    // anyone can view their own anonymousRequest requests
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
      totalDocuments = await getQueriedTotalAnonymousRequestsService({
        filter: filterWithUserId,
      });
    }

    // get all anonymousRequest requests by user
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
const updateAnonymousRequestByIdHandler = expressAsyncHandler(
  async (
    request: UpdateAnonymousRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const { anonymousRequestId } = request.params;
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

    // update anonymousRequest request status
    const updatedAnonymousRequest = await updateAnonymousRequestByIdService({
      _id: anonymousRequestId,
      fields,
      updateOperator,
    });

    if (!updatedAnonymousRequest) {
      response.status(400).json({
        message: "Anonymous Request request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Anonymous Request request status updated successfully",
      resourceData: [updatedAnonymousRequest],
    });
  }
);

// @desc   Get an anonymousRequest request
// @route  GET api/v1/actions/general/anonymous-request
// @access Private
const getAnonymousRequestByIdHandler = expressAsyncHandler(
  async (
    request: GetAnonymousRequestByIdRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const { anonymousRequestId } = request.params;
    const anonymousRequest = await getAnonymousRequestByIdService(anonymousRequestId);
    if (!anonymousRequest) {
      response
        .status(404)
        .json({ message: "Anonymous Request request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Anonymous Request request found successfully",
      resourceData: [anonymousRequest],
    });
  }
);

// @desc   Delete an anonymousRequest request by its id
// @route  DELETE api/v1/actions/general/anonymous-request
// @access Private
const deleteAnonymousRequestHandler = expressAsyncHandler(
  async (request: DeleteAnonymousRequestRequest, response: Response) => {
    const { anonymousRequestId } = request.params;

    // delete anonymousRequest request by id
    const deletedResult: DeleteResult = await deleteAnonymousRequestByIdService(
      anonymousRequestId
    );

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Anonymous Request request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Anonymous Request request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all anonymousRequest requests
// @route   DELETE api/v1/actions/general/request-resource/anonymous-request
// @access  Private
const deleteAllAnonymousRequestsHandler = expressAsyncHandler(
  async (_request: DeleteAllAnonymousRequestsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllAnonymousRequestsService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All anonymousRequest requests could not be deleted",
        resourceData: [],
      });
      return;
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
const createNewAnonymousRequestsBulkHandler = expressAsyncHandler(
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

    // filter out any null documents
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
const updateAnonymousRequestsBulkHandler = expressAsyncHandler(
  async (
    request: UpdateAnonymousRequestsBulkRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
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
  createNewAnonymousRequestHandler,
  getQueriedAnonymousRequestsHandler,
  getAnonymousRequestsByUserHandler,
  getAnonymousRequestByIdHandler,
  deleteAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  updateAnonymousRequestByIdHandler,
  createNewAnonymousRequestsBulkHandler,
  updateAnonymousRequestsBulkHandler,
};
