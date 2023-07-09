import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetAllRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetRequestResourcesByUserRequest,
  RequestResourcesServerResponse,
} from './requestResource.types';

import {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getAllRequestResourcesService,
  getRequestResourceByIdService,
  getRequestResourceByUserService,
} from './requestResource.service';
import { RequestResourceSchema } from './requestResource.model';

// @desc   Create a new request resource
// @route  POST /request-resource
// @access Private
const createNewRequestResourceHandler = expressAsyncHandler(
  async (
    request: CreateNewRequestResourceRequest,
    response: Response<RequestResourcesServerResponse>
  ) => {
    const {
      userInfo: { userId, username },
      resourceRequest: {
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
    };

    // create new request resource
    const newRequestResource = await createNewRequestResourceService(newRequestResourceObject);
    if (newRequestResource) {
      response.status(201).json({
        message: 'New request resource created',
        requestResourceData: [newRequestResource],
      });
    } else {
      response
        .status(400)
        .json({ message: 'New request resource could not be created', requestResourceData: [] });
    }
  }
);

// @desc   Delete a request resource
// @route  DELETE /request-resource/:requestResourceId
// @access Private/Admin/Manager
const deleteARequestResourceHandler = expressAsyncHandler(
  async (
    request: DeleteARequestResourceRequest,
    response: Response<RequestResourcesServerResponse>
  ) => {
    const {
      userInfo: { roles },
    } = request.body;

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admin can delete a resourceRequest',
        requestResourceData: [],
      });
      return;
    }

    const requestResourceId = request.params.requestResourceId;

    // delete resourceRequest
    const deletedResult = await deleteARequestResourceService(requestResourceId);
    if (deletedResult.acknowledged) {
      response.status(200).json({
        message: 'Request resource deleted successfully',
        requestResourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'Request resource could not be deleted',
        requestResourceData: [],
      });
    }
  }
);

// @desc   Delete all request resources
// @route  DELETE /request-resource
// @access Private/Admin/Manager
const deleteAllRequestResourcesHandler = expressAsyncHandler(
  async (
    request: DeleteAllRequestResourcesRequest,
    response: Response<RequestResourcesServerResponse>
  ) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admin can delete a resourceRequest',
        requestResourceData: [],
      });
      return;
    }

    // delete all requestResources
    const deletedResult = await deleteAllRequestResourcesService();
    if (deletedResult.acknowledged) {
      response.status(200).json({
        message: 'Request resources deleted successfully',
        requestResourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'Request resources could not be deleted',
        requestResourceData: [],
      });
    }
  }
);

// @desc   Get all request resources
// @route  GET /request-resource
// @access Private/Admin/Manager
const getAllRequestResourcesHandler = expressAsyncHandler(
  async (
    request: GetAllRequestResourcesRequest,
    response: Response<RequestResourcesServerResponse>
  ) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admin can delete a resourceRequest',
        requestResourceData: [],
      });
      return;
    }

    // get all requestResources
    const requestResources = await getAllRequestResourcesService();
    if (requestResources.length > 0) {
      response.status(200).json({
        message: 'Request resources retrieved successfully',
        requestResourceData: requestResources,
      });
    } else {
      response.status(400).json({
        message: 'Request resources could not be retrieved',
        requestResourceData: [],
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
    response: Response<RequestResourcesServerResponse>
  ) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admin can get a resourceRequest',
        requestResourceData: [],
      });
      return;
    }

    const requestResourceId = request.params.requestResourceId;

    // get resourceRequest
    const resourceRequest = await getRequestResourceByIdService(requestResourceId);
    if (resourceRequest) {
      response.status(200).json({
        message: 'Request resource retrieved successfully',
        requestResourceData: [resourceRequest],
      });
    } else {
      response.status(400).json({
        message: 'Request resource could not be retrieved',
        requestResourceData: [],
      });
    }
  }
);

// @desc   Get request resource by user
// @route  GET /request-resource/user
// @access Private
const getRequestResourceByUserHandler = expressAsyncHandler(
  async (
    request: GetRequestResourcesByUserRequest,
    response: Response<RequestResourcesServerResponse>
  ) => {
    const {
      userInfo: { roles, userId, username },
    } = request.body;

    // anyone can get their own request resources
    const requestResources = await getRequestResourceByUserService(userId);
    if (requestResources.length > 0) {
      response.status(200).json({
        message: 'Request resources retrieved successfully',
        requestResourceData: requestResources,
      });
    } else {
      response.status(400).json({
        message: 'Request resources could not be retrieved',
        requestResourceData: [],
      });
    }
  }
);

export {
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getAllRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
};
