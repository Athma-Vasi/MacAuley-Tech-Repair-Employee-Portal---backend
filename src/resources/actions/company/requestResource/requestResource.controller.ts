import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
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
import { create } from "domain";
import createHttpError from "http-errors";

// @desc   Create a new request resource
// @route  POST api/v1/actions/company/request-resource
// @access Private
const createNewRequestResourceController = expressAsyncController(
  async (
    request: CreateNewRequestResourceRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId, username },
      requestResourceSchema,
    } = request.body;

    const newRequestResourceSchema: RequestResourceSchema = {
      ...requestResourceSchema,
      userId,
      username,
    };

    const requestResourceDocument = await createNewRequestResourceService(
      newRequestResourceSchema
    );

    if (!requestResourceDocument) {
      return next(
        new createHttpError.InternalServerError(
          "Request resource document could not be created. Please try again!"
        )
      );
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
const getQueriedRequestResourcesController = expressAsyncController(
  async (
    request: GetQueriedRequestResourcesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RequestResourceDocument>>,
    next: NextFunction
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

// @desc   Get all requestResource documents by user
// @route  GET api/v1/actions/company/request-resource/user
// @access Private
const getRequestResourcesByUserController = expressAsyncController(
  async (
    request: GetQueriedRequestResourcesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RequestResourceDocument>>,
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
      totalDocuments = await getQueriedTotalRequestResourcesService({
        filter: filterWithUserId,
      });
    }

    const requestResources = await getQueriedRequestResourcesByUserService({
      filter: filterWithUserId as FilterQuery<RequestResourceDocument> | undefined,
      projection: projection as QueryOptions<RequestResourceDocument>,
      options: options as QueryOptions<RequestResourceDocument>,
    });

    if (!requestResources.length) {
      response.status(200).json({
        message: "No requestResource documents found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Request Resource documents found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: requestResources,
    });
  }
);

// @desc   Update requestResource status
// @route  PATCH api/v1/actions/company/request-resource/:requestResourceId
// @access Private/Admin/Manager
const updateRequestResourceByIdController = expressAsyncController(
  async (
    request: UpdateRequestResourceByIdRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>,
    next: NextFunction
  ) => {
    const { requestResourceId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const updatedRequestResource = await updateRequestResourceByIdService({
      _id: requestResourceId,
      fields,
      updateOperator,
    });

    if (!updatedRequestResource) {
      return next(
        new createHttpError.InternalServerError(
          "Request resource document could not be updated. Please try again!"
        )
      );
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
const getRequestResourceByIdController = expressAsyncController(
  async (
    request: GetRequestResourceByIdRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>,
    next: NextFunction
  ) => {
    const { requestResourceId } = request.params;
    const requestResource = await getRequestResourceByIdService(requestResourceId);
    if (!requestResource) {
      return next(new createHttpError.NotFound("Request Resource request not found"));
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
const deleteRequestResourceController = expressAsyncController(
  async (
    request: DeleteRequestResourceRequest,
    response: Response,
    next: NextFunction
  ) => {
    const { requestResourceId } = request.params;

    const deletedResult: DeleteResult = await deleteRequestResourceByIdService(
      requestResourceId
    );

    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "Request Resource request could not be deleted. Please try again!"
        )
      );
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
const deleteAllRequestResourcesController = expressAsyncController(
  async (
    _request: DeleteAllRequestResourcesRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllRequestResourcesService();

    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "Request Resource documents could not be deleted. Please try again!"
        )
      );
    }

    response.status(200).json({
      message: "All request resource documents deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new requestResource documents in bulk
// @route  POST api/v1/actions/company/request-resource/dev
// @access Private
const createNewRequestResourcesBulkController = expressAsyncController(
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

    const filteredRequestResourceDocuments = requestResourceDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredRequestResourceDocuments.length === 0) {
      response.status(500).json({
        message: `Failed to create ${requestResourceSchemas.length} Request Resource requests. Please try again.`,
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
const updateRequestResourcesBulkController = expressAsyncController(
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

    const successfullyCreatedRequestResources = updatedRequestResources.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedRequestResources.length === 0) {
      response.status(500).json({
        message: `Failed to update ${requestResourceFields.length} Request Resources. Please try again.`,
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
  createNewRequestResourceController,
  getQueriedRequestResourcesController,
  getRequestResourcesByUserController,
  getRequestResourceByIdController,
  deleteRequestResourceController,
  deleteAllRequestResourcesController,
  updateRequestResourceByIdController,
  createNewRequestResourcesBulkController,
  updateRequestResourcesBulkController,
};
