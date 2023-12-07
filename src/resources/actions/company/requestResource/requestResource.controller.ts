import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewRequestResourceRequest,
  CreateNewRequestResourcesBulkRequest,
  DeleteAllRequestResourcesRequest,
  DeleteRequestResourceRequest,
  GetRequestResourceByIdRequest,
  GetQueriedRequestResourcesByUserRequest,
  GetQueriedRequestResourcesRequest,
  UpdateRequestResourceByIdRequest,
  UpdateRequestResourcesBulkRequest,
} from "./requestResource.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type {
  RequestResourceDocument,
  RequestResourceSchema,
} from "./requestResource.model";

import {
  createNewRequestResourceService,
  deleteAllRequestResourcesService,
  deleteRequestResourceByIdService,
  getRequestResourceByIdService,
  getQueriedRequestResourcesByUserService,
  getQueriedRequestResourcesService,
  getQueriedTotalRequestResourcesService,
  updateRequestResourceByIdService,
} from "./requestResource.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";

// @desc   Create a new request resource
// @route  POST api/v1/actions/company/request-resource
// @access Private
const createNewRequestResourceHandler = expressAsyncHandler(
  async (
    request: CreateNewRequestResourceRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      requestResourceFields,
    } = request.body;

    // create new request resource object
    const requestResourceSchema: RequestResourceSchema = {
      ...requestResourceFields,
      userId,
      username,
    };

    const requestResourceDocument = await createNewRequestResourceService(
      requestResourceSchema
    );

    if (!requestResourceDocument) {
      response.status(400).json({
        message: "New request resource could not be created",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${requestResourceDocument.reasonForRequest} request resource`,
      resourceData: [requestResourceDocument],
    });
  }
);

// @desc   Get all requestResources
// @route  GET api/v1/actions/company/request-resource
// @access Private/Admin/Manager
const getQueriedRequestResourcesHandler = expressAsyncHandler(
  async (
    request: GetQueriedRequestResourcesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRequestResourcesService({
        filter: filter as FilterQuery<RequestResourceDocument> | undefined,
      });
    }

    // get all requestResources
    const requestResource = await getQueriedRequestResourcesService({
      filter: filter as FilterQuery<RequestResourceDocument> | undefined,
      projection: projection as QueryOptions<RequestResourceDocument>,
      options: options as QueryOptions<RequestResourceDocument>,
    });

    if (!requestResource.length) {
      response.status(200).json({
        message: "No requestResources that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RequestResources found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: requestResource,
    });
  }
);

// @desc   Get all requestResource requests by user
// @route  GET api/v1/actions/company/request-resource/user
// @access Private
const getRequestResourcesByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedRequestResourcesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    // anyone can view their own requestResource requests
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
      totalDocuments = await getQueriedTotalRequestResourcesService({
        filter: filterWithUserId,
      });
    }

    // get all requestResource requests by user
    const requestResources = await getQueriedRequestResourcesByUserService({
      filter: filterWithUserId as FilterQuery<RequestResourceDocument> | undefined,
      projection: projection as QueryOptions<RequestResourceDocument>,
      options: options as QueryOptions<RequestResourceDocument>,
    });

    if (!requestResources.length) {
      response.status(200).json({
        message: "No requestResource requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Request Resource requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: requestResources,
    });
  }
);

// @desc   Update requestResource status
// @route  PATCH api/v1/actions/company/request-resource/:requestResourceId
// @access Private/Admin/Manager
const updateRequestResourceByIdHandler = expressAsyncHandler(
  async (
    request: UpdateRequestResourceByIdRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResourceId } = request.params;
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

    // update requestResource request status
    const updatedRequestResource = await updateRequestResourceByIdService({
      _id: requestResourceId,
      fields,
      updateOperator,
    });

    if (!updatedRequestResource) {
      response.status(400).json({
        message: "Request Resource request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Request Resource request status updated successfully",
      resourceData: [updatedRequestResource],
    });
  }
);

// @desc   Get an requestResource request
// @route  GET api/v1/actions/company/request-resource/:requestResourceId
// @access Private
const getRequestResourceByIdHandler = expressAsyncHandler(
  async (
    request: GetRequestResourceByIdRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResourceId } = request.params;
    const requestResource = await getRequestResourceByIdService(requestResourceId);
    if (!requestResource) {
      response
        .status(404)
        .json({ message: "Request Resource request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Request Resource request found successfully",
      resourceData: [requestResource],
    });
  }
);

// @desc   Delete an requestResource request by its id
// @route  DELETE api/v1/actions/company/request-resource/:requestResourceId
// @access Private
const deleteRequestResourceHandler = expressAsyncHandler(
  async (request: DeleteRequestResourceRequest, response: Response) => {
    const { requestResourceId } = request.params;

    // delete requestResource request by id
    const deletedResult: DeleteResult = await deleteRequestResourceByIdService(
      requestResourceId
    );

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Request Resource request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Request Resource request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all requestResource requests
// @route   DELETE api/v1/actions/company/request-resource/delete-all
// @access  Private
const deleteAllRequestResourcesHandler = expressAsyncHandler(
  async (_request: DeleteAllRequestResourcesRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllRequestResourcesService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All requestResource requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All requestResource requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new requestResource requests in bulk
// @route  POST api/v1/actions/company/request-resource/dev
// @access Private
const createNewRequestResourcesBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewRequestResourcesBulkRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResourceSchemas } = request.body;

    const requestResourceDocuments = await Promise.all(
      requestResourceSchemas.map(async (requestResourceSchema) => {
        const requestResourceDocument = await createNewRequestResourceService(
          requestResourceSchema
        );
        return requestResourceDocument;
      })
    );

    // filter out any null documents
    const filteredRequestResourceDocuments = requestResourceDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredRequestResourceDocuments.length === 0) {
      response.status(400).json({
        message: "Request Resource requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      requestResourceSchemas.length - filteredRequestResourceDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredRequestResourceDocuments.length
      } Request Resource requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredRequestResourceDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Request Resources in bulk
// @route  PATCH api/v1/actions/company/request-resource/dev
// @access Private
const updateRequestResourcesBulkHandler = expressAsyncHandler(
  async (
    request: UpdateRequestResourcesBulkRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResourceFields } = request.body;

    const updatedRequestResources = await Promise.all(
      requestResourceFields.map(async (requestResourceField) => {
        const {
          documentUpdate: { fields, updateOperator },
          requestResourceId,
        } = requestResourceField;

        const updatedRequestResource = await updateRequestResourceByIdService({
          _id: requestResourceId,
          fields,
          updateOperator,
        });

        return updatedRequestResource;
      })
    );

    // filter out any requestResources that were not created
    const successfullyCreatedRequestResources = updatedRequestResources.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedRequestResources.length === 0) {
      response.status(400).json({
        message: "Could not create any Request Resources",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedRequestResources.length
      } Request Resources. ${
        requestResourceFields.length - successfullyCreatedRequestResources.length
      } Request Resources failed to be created.`,
      resourceData: successfullyCreatedRequestResources,
    });
  }
);

export {
  createNewRequestResourceHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourcesByUserHandler,
  getRequestResourceByIdHandler,
  deleteRequestResourceHandler,
  deleteAllRequestResourcesHandler,
  updateRequestResourceByIdHandler,
  createNewRequestResourcesBulkHandler,
  updateRequestResourcesBulkHandler,
};
