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
import { createNewRequestResourceService } from './requestResource.service';

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

export { createNewRequestResourceHandler };
