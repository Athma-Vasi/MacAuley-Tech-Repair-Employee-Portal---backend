import expressAsyncHandler from 'express-async-handler';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type {
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetQueriedRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetQueriedRequestResourcesByUserRequest,
  UpdateRequestResourceStatusByIdRequest,
  CreateNewRequestResourceBulkRequest,
} from './requestResource.types';

import {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getQueriedRequestResourceService,
  getRequestResourceByIdService,
  getQueriedRequestResourceByUserService,
  getQueriedTotalRequestResourceService,
  updateRequestResourceStatusByIdService,
} from './requestResource.service';
import { RequestResourceDocument, RequestResourceSchema } from './requestResource.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create a new request resource
// @route  POST /request-resource
// @access Private
const createNewRequestResourceHandler = expressAsyncHandler(
  async (
    request: CreateNewRequestResourceRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      requestResource: {
        resourceType,
        department,
        reasonForRequest,
        resourceDescription,
        resourceQuantity,
        urgency,
        dateNeededBy,
        additionalInformation,
      },
    } = request.body;

    // create new request resource object
    const newRequestResourceObject: RequestResourceSchema = {
      userId,
      username,
      action: 'company',
      category: 'request resource',
      resourceType,
      department,
      reasonForRequest,
      resourceDescription,
      resourceQuantity,
      urgency,
      dateNeededBy,
      additionalInformation,
      requestStatus: 'pending',
    };

    // create new request resource
    const newRequestResource = await createNewRequestResourceService(newRequestResourceObject);
    if (newRequestResource) {
      response.status(201).json({
        message: `New request resource of kind ${resourceType} for ${department} created`,
        resourceData: [newRequestResource],
      });
    } else {
      response
        .status(400)
        .json({ message: 'New request resource could not be created', resourceData: [] });
    }
  }
);

// DEV ROUTE
// @desc   Create new request resources in bulk
// @route  POST /request-resource/dev
// @access Private/Admin/Manager
const createNewRequestResourceBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewRequestResourceBulkRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResources } = request.body;

    // promise all array
    const newRequestResources = await Promise.all(
      requestResources.map(async (requestResource) => {
        const {
          userId,
          username,
          department,
          resourceType,
          resourceQuantity,
          resourceDescription,
          reasonForRequest,
          urgency,
          dateNeededBy,
          additionalInformation,
          requestStatus,
        } = requestResource;

        // create new request resource object
        const newRequestResourceObject: RequestResourceSchema = {
          userId,
          username,
          action: 'company',
          category: 'request resource',
          resourceType,
          department,
          resourceQuantity,
          resourceDescription,
          reasonForRequest,
          urgency,
          dateNeededBy,
          additionalInformation,
          requestStatus,
        };

        // create new request resource
        const newRequestResource = await createNewRequestResourceService(newRequestResourceObject);

        return newRequestResource;
      })
    );

    // filter out undefined values
    const filteredRequestResources = requestResources.filter((requestResource) => requestResource);

    if (filteredRequestResources.length === newRequestResources.length) {
      response.status(201).json({
        message: 'New request resources created successfully',
        resourceData: newRequestResources,
      });
    } else {
      response.status(400).json({
        message: 'New request resources could not be created',
        resourceData: [],
      });
    }
  }
);

// @desc   Get all request resources
// @route  GET /request-resource
// @access Private/Admin/Manager
const getQueriedRequestResourcesHandler = expressAsyncHandler(
  async (
    request: GetQueriedRequestResourcesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRequestResourceService({
        filter: filter as FilterQuery<RequestResourceDocument> | undefined,
      });
    }

    // get all resource requests
    const resourceRequests = await getQueriedRequestResourceService({
      filter: filter as FilterQuery<RequestResourceDocument> | undefined,
      projection: projection as QueryOptions<RequestResourceDocument>,
      options: options as QueryOptions<RequestResourceDocument>,
    });
    if (resourceRequests.length === 0) {
      response.status(200).json({
        message: 'No resource requests that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found resource requests',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: resourceRequests,
      });
    }
  }
);

// @desc   Get request resource by user
// @route  GET /request-resource/user
// @access Private
const getRequestResourceByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedRequestResourcesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RequestResourceDocument>>
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
      totalDocuments = await getQueriedTotalRequestResourceService({
        filter: filterWithUserId,
      });
    }

    const resourceRequests = await getQueriedRequestResourceByUserService({
      filter: filterWithUserId as FilterQuery<RequestResourceDocument> | undefined,
      projection: projection as QueryOptions<RequestResourceDocument>,
      options: options as QueryOptions<RequestResourceDocument>,
    });
    if (resourceRequests.length === 0) {
      response.status(200).json({
        message: 'No resource requests found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Resource requests found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: resourceRequests,
      });
    }
  }
);

// @desc   Get request resource by id
// @route  GET /request-resource/:requestResourceId
// @access Private/Admin/Manager
const getRequestResourceByIdHandler = expressAsyncHandler(
  async (
    request: GetRequestResourceByIdRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResourceId } = request.params;

    // get resourceRequest
    const resourceRequest = await getRequestResourceByIdService(requestResourceId);
    if (resourceRequest) {
      response.status(200).json({
        message: 'Request resource retrieved successfully',
        resourceData: [resourceRequest],
      });
    } else {
      response.status(400).json({
        message: 'Request resource could not be retrieved',
        resourceData: [],
      });
    }
  }
);

// @desc   Update a request resource status by id
// @route  PATCH /request-resource/:requestResourceId
// @access Private/Admin/Manager
const updateRequestResourceStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateRequestResourceStatusByIdRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResourceId } = request.params;
    const {
      requestResource: { requestStatus },
    } = request.body;

    // check if request resource exists
    const requestResourceExists = await getRequestResourceByIdService(requestResourceId);
    if (!requestResourceExists) {
      response.status(404).json({ message: 'Request resource does not exist', resourceData: [] });
      return;
    }

    // update request resource
    const updatedRequestResource = await updateRequestResourceStatusByIdService({
      requestResourceId,
      requestStatus,
    });
    if (updatedRequestResource) {
      response.status(200).json({
        message: 'Request resource updated successfully',
        resourceData: [updatedRequestResource],
      });
    } else {
      response.status(400).json({
        message: 'Request resource could not be updated',
        resourceData: [],
      });
    }
  }
);

// @desc   Delete a request resource
// @route  DELETE /request-resource/:requestResourceId
// @access Private/Admin/Manager
const deleteARequestResourceHandler = expressAsyncHandler(
  async (
    request: DeleteARequestResourceRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    const { requestResourceId } = request.params;

    // check if request resource exists
    const requestResourceExists = await getRequestResourceByIdService(requestResourceId);
    if (!requestResourceExists) {
      response.status(404).json({ message: 'Request resource does not exist', resourceData: [] });
      return;
    }

    // delete resourceRequest
    const deletedResult: DeleteResult = await deleteARequestResourceService(requestResourceId);
    if (deletedResult.deletedCount === 1) {
      response.status(200).json({
        message: 'Request resource deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'Request resource could not be deleted',
        resourceData: [],
      });
    }
  }
);

// @desc   Delete all request resources
// @route  DELETE /request-resource
// @access Private/Admin/Manager
const deleteAllRequestResourcesHandler = expressAsyncHandler(
  async (
    _request: DeleteAllRequestResourcesRequest,
    response: Response<ResourceRequestServerResponse<RequestResourceDocument>>
  ) => {
    // delete all requestResources
    const deletedResult: DeleteResult = await deleteAllRequestResourcesService();
    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'Request resources deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'Request resources could not be deleted',
        resourceData: [],
      });
    }
  }
);

export {
  createNewRequestResourceHandler,
  createNewRequestResourceBulkHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
  updateRequestResourceStatusByIdHandler,
};
