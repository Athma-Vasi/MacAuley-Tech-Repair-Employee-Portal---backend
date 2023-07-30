import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewAnonymousRequestRequest,
  DeleteAnAnonymousRequestRequest,
  GetQueriedAnonymousRequestsRequest,
  GetAnAnonymousRequestRequest,
  UpdateAnonymousRequestStatusByIdRequest,
} from './anonymousRequest.types';
import {
  createNewAnonymousRequestService,
  deleteAllAnonymousRequestsService,
  deleteAnAnonymousRequestService,
  getQueriedAnonymousRequestsService,
  getAnAnonymousRequestService,
  getQueriedTotalAnonymousRequestsService,
  updateAnonymousRequestStatusByIdService,
} from './anonymousRequest.service';
import { AnonymousRequestDocument, AnonymousRequestSchema } from './anonymousRequest.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create new anonymous request
// @route  POST /anonymousRequests
// @access Private
const createNewAnonymousRequestHandler = expressAsyncHandler(
  async (
    request: CreateNewAnonymousRequestRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    // userInfo is not stored in server for anonymous requests
    const {
      anonymousRequest: {
        additionalInformation,
        requestDescription,
        requestKind,
        secureContactEmail,
        secureContactNumber,
        title,
        urgency,
      },
    } = request.body;

    const input: AnonymousRequestSchema = {
      action: 'general',
      category: 'anonymous request',
      additionalInformation,
      requestDescription,
      requestKind,
      secureContactEmail,
      secureContactNumber,
      title,
      urgency,
      requestStatus: 'pending',
    };

    const newAnonymousRequest = await createNewAnonymousRequestService(input);

    if (newAnonymousRequest) {
      response.status(201).json({
        message: 'Anonymous request created successfully',
        resourceData: [newAnonymousRequest],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Anonymous request could not be created', resourceData: [] });
    }
  }
);

// @desc   Get all anonymous requests
// @route  GET /anonymousRequests
// @access Private
const getQueriedAnonymousRequestsHandler = expressAsyncHandler(
  async (
    request: GetQueriedAnonymousRequestsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAnonymousRequestsService({
        filter: filter as FilterQuery<AnonymousRequestDocument> | undefined,
      });
    }

    // get all anonymous requests
    const anonymousRequests = await getQueriedAnonymousRequestsService({
      filter: filter as FilterQuery<AnonymousRequestDocument> | undefined,
      projection: projection as QueryOptions<AnonymousRequestDocument>,
      options: options as QueryOptions<AnonymousRequestDocument>,
    });
    if (anonymousRequests.length === 0) {
      response.status(404).json({
        message: 'No anonymous requests that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found anonymous requests',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: anonymousRequests,
      });
    }
  }
);

// @desc   Get an anonymous request
// @route  GET /anonymousRequests/:anonymousRequestId
// @access Private
const getAnAnonymousRequestHandler = expressAsyncHandler(
  async (
    request: GetAnAnonymousRequestRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const { anonymousRequestId } = request.params;

    const anonymousRequest = await getAnAnonymousRequestService(anonymousRequestId);

    if (anonymousRequest) {
      response.status(200).json({
        message: 'Anonymous request found successfully',
        resourceData: [anonymousRequest],
      });
    } else {
      response.status(404).json({
        message: 'Anonymous request not found',
        resourceData: [],
      });
    }
  }
);

// @desc   Update an anonymous request
// @route  PATCH /anonymousRequests/:anonymousRequestId
// @access Private
const updateAnonymousRequestStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateAnonymousRequestStatusByIdRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const { anonymousRequestId } = request.params;
    const {
      anonymousRequest: { requestStatus },
    } = request.body;

    // check if anonymous request exists in database
    const anonymousRequest = await getAnAnonymousRequestService(anonymousRequestId);
    if (!anonymousRequest) {
      response.status(404).json({
        message: 'Anonymous request not found',
        resourceData: [],
      });
      return;
    }

    const updatedAnonymousRequest = await updateAnonymousRequestStatusByIdService({
      anonymousRequestId,
      requestStatus,
    });
    if (updatedAnonymousRequest) {
      response.status(200).json({
        message: 'Anonymous request updated successfully',
        resourceData: [updatedAnonymousRequest],
      });
    } else {
      response.status(400).json({
        message: 'Anonymous request could not be updated',
        resourceData: [],
      });
    }
  }
);

// @desc   Delete an anonymous request
// @route  DELETE /anonymousRequests/:anonymousRequestId
// @access Private
const deleteAnAnonymousRequestHandler = expressAsyncHandler(
  async (
    request: DeleteAnAnonymousRequestRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const { anonymousRequestId } = request.params;
    const anonymousRequest = await deleteAnAnonymousRequestService(anonymousRequestId);
    if (anonymousRequest.deletedCount === 1) {
      response.status(200).json({
        message: 'Anonymous request deleted successfully',
        resourceData: [],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Anonymous request could not be deleted', resourceData: [] });
    }
  }
);

// @desc   Delete all anonymous requests
// @route  DELETE /anonymousRequests
// @access Private
const deleteAllAnonymousRequestsHandler = expressAsyncHandler(
  async (
    _request: DeleteAnAnonymousRequestRequest,
    response: Response<ResourceRequestServerResponse<AnonymousRequestDocument>>
  ) => {
    const deletedResult = await deleteAllAnonymousRequestsService();

    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'All anonymous requests deleted successfully',
        resourceData: [],
      });
    } else {
      response
        .status(400)
        .json({ message: 'All anonymous requests could not be deleted', resourceData: [] });
    }
  }
);

export {
  createNewAnonymousRequestHandler,
  getQueriedAnonymousRequestsHandler,
  getAnAnonymousRequestHandler,
  deleteAnAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  updateAnonymousRequestStatusByIdHandler,
};
