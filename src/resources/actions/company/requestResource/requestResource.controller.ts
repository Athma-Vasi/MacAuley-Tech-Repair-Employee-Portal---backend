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

import { getUserByIdService } from '../../../user';
import {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
} from './requestResource.service';
import { Types } from 'mongoose';

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

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', requestResourceData: [] });
      return;
    }

    // create new request resource object
    const newRequestResourceObject = {
      userId,
      username,
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
      userInfo: { roles, userId, username },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', requestResourceData: [] });
      return;
    }

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admin can delete a requestResource',
        requestResourceData: [],
      });
      return;
    }

    const requestResourceId = request.params.requestResourceId as Types.ObjectId;

    // delete requestResource
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

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', requestResourceData: [] });
      return;
    }

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admin can delete a requestResource',
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

export { createNewRequestResourceHandler };
