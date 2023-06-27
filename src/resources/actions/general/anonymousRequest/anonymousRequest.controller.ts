import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewAnonymousRequestRequest,
  DeleteAnAnonymousRequestRequest,
  GetAllAnonymousRequestsRequest,
  GetAnAnonymousRequestRequest,
} from './anonymousRequest.types';
import {
  createNewAnonymousRequestService,
  deleteAllAnonymousRequestsService,
  deleteAnAnonymousRequestService,
  getAllAnonymousRequestsService,
  getAnAnonymousRequestService,
} from './anonymousRequest.service';

// @desc   Create new anonymous request
// @route  POST /anonymousRequests
// @access Private
const createNewAnonymousRequestHandler = expressAsyncHandler(
  async (request: CreateNewAnonymousRequestRequest, response: Response) => {
    const newAnonymousRequest = await createNewAnonymousRequestService(request.body);

    if (newAnonymousRequest) {
      response.status(201).json({
        message: 'Anonymous request created successfully',
        anonymousRequestData: [newAnonymousRequest],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Anonymous request could not be created', anonymousRequestData: [] });
    }
  }
);

// @desc   Get all anonymous requests
// @route  GET /anonymousRequests
// @access Private
const getAllAnonymousRequestsHandler = expressAsyncHandler(
  async (request: GetAllAnonymousRequestsRequest, response: Response) => {
    // only managers and admins can view all anonymous requests
    const {
      userInfo: { roles },
    } = request.body;
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can get all anonymous requests',
        anonymousRequestData: [],
      });
      return;
    }

    const allAnonymousRequests = await getAllAnonymousRequestsService();

    if (allAnonymousRequests.length === 0) {
      response.status(404).json({
        message: 'No anonymous requests found',
        anonymousRequestData: [],
      });
    } else {
      response.status(200).json({
        message: 'Anonymous requests found successfully',
        anonymousRequestData: allAnonymousRequests,
      });
    }
  }
);

// @desc   Get an anonymous request
// @route  GET /anonymousRequests/:anonymousRequestId
// @access Private
const getAnAnonymousRequestHandler = expressAsyncHandler(
  async (request: GetAnAnonymousRequestRequest, response: Response) => {
    // only managers and admins can view an anonymous request by its id
    const {
      userInfo: { roles },
    } = request.body;
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can get view an anonymous request not belonging to them',
        anonymousRequestData: [],
      });
      return;
    }

    const { anonymousRequestId } = request.params;

    const anonymousRequest = await getAnAnonymousRequestService(anonymousRequestId);

    if (anonymousRequest) {
      response.status(200).json({
        message: 'Anonymous request found successfully',
        anonymousRequestData: [anonymousRequest],
      });
    } else {
      response.status(404).json({
        message: 'Anonymous request not found',
        anonymousRequestData: [],
      });
    }
  }
);

// @desc   Delete an anonymous request
// @route  DELETE /anonymousRequests/:anonymousRequestId
// @access Private
const deleteAnAnonymousRequestHandler = expressAsyncHandler(
  async (request: DeleteAnAnonymousRequestRequest, response: Response) => {
    // only managers can delete anonymous requests
    const {
      userInfo: { roles },
    } = request.body;
    if (!roles.includes('Manager')) {
      response.status(403).json({
        message: 'Only managers can delete anonymous requests',
        anonymousRequestData: [],
      });
      return;
    }

    const { anonymousRequestId } = request.params;
    const anonymousRequest = await deleteAnAnonymousRequestService(anonymousRequestId);
    if (anonymousRequest) {
      response.status(200).json({
        message: 'Anonymous request deleted successfully',
        anonymousRequestData: anonymousRequest,
      });
    } else {
      response
        .status(400)
        .json({ message: 'Anonymous request could not be deleted', anonymousRequestData: [] });
    }
  }
);

// @desc   Delete all anonymous requests
// @route  DELETE /anonymousRequests
// @access Private
const deleteAllAnonymousRequestsHandler = expressAsyncHandler(
  async (request: DeleteAnAnonymousRequestRequest, response: Response) => {
    // only managers can delete all anonymous requests
    const {
      userInfo: { roles },
    } = request.body;
    if (!roles.includes('Manager')) {
      response.status(403).json({
        message: 'Only managers can delete all anonymous requests',
        anonymousRequestData: [],
      });
      return;
    }

    const deletedResult = await deleteAllAnonymousRequestsService();

    if (deletedResult.acknowledged) {
      response.status(200).json({
        message: 'All anonymous requests deleted successfully',
        anonymousRequestData: [],
      });
    } else {
      response
        .status(400)
        .json({ message: 'All anonymous requests could not be deleted', anonymousRequestData: [] });
    }
  }
);

export {
  createNewAnonymousRequestHandler,
  getAllAnonymousRequestsHandler,
  getAnAnonymousRequestHandler,
  deleteAnAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
};
