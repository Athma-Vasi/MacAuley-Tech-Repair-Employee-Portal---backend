import expressAsyncHandler from 'express-async-handler';
import {
  createNewEndorsementService,
  deleteAllEndorsementsService,
  deleteEndorsementService,
  getQueriedEndorsementsService,
  getAnEndorsementService,
  getQueriedEndorsementsByUserService,
  updateEndorsementStatusByIdService,
  getQueriedTotalEndorsementsService,
} from './endorsement.service';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type {
  CreateNewEndorsementRequest,
  DeleteAllEndorsementsRequest,
  DeleteEndorsementRequest,
  GetQueriedEndorsementsRequest,
  GetAnEndorsementRequest,
  GetQueriedEndorsementsByUserRequest,
  UpdateEndorsementStatusByIdRequest,
} from './endorsement.types';
import { EndorsementDocument, EndorsementSchema } from './endorsement.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create new endorsement
// @route  POST /endorsement
// @access Private
const createNewEndorsementHandler = expressAsyncHandler(
  async (
    request: CreateNewEndorsementRequest,
    response: Response<ResourceRequestServerResponse<EndorsementDocument>>
  ) => {
    const {
      userInfo: { userId, username },

      endorsement: { title, userToBeEndorsed, attributeEndorsed, summaryOfEndorsement },
    } = request.body;

    const newEndorsementObject: EndorsementSchema = {
      userId,
      username,
      action: 'general',
      category: 'endorsement',
      title,
      userToBeEndorsed,
      summaryOfEndorsement,
      attributeEndorsed,
      requestStatus: 'pending',
    };
    const newEndorsement = await createNewEndorsementService(newEndorsementObject);

    if (newEndorsement) {
      response.status(201).json({
        message: 'Endorsement created successfully',
        resourceData: [newEndorsement],
      });
    } else {
      response.status(400).json({ message: 'Endorsement could not be created', resourceData: [] });
    }
  }
);

// @desc   Get all endorsements
// @route  GET /endorsement
// @access Private
const getQueriedEndorsementsHandler = expressAsyncHandler(
  async (
    request: GetQueriedEndorsementsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EndorsementDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalEndorsementsService({
        filter: filter as FilterQuery<EndorsementDocument> | undefined,
      });
    }

    // get all endorsements
    const endorsements = await getQueriedEndorsementsService({
      filter: filter as FilterQuery<EndorsementDocument> | undefined,
      projection: projection as QueryOptions<EndorsementDocument>,
      options: options as QueryOptions<EndorsementDocument>,
    });
    if (endorsements.length === 0) {
      response.status(404).json({
        message: 'No endorsements that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found endorsements',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: endorsements.length,
        resourceData: endorsements,
      });
    }
  }
);

// @desc   Get endorsements by user
// @route  GET /endorsement/user
// @access Private
const getQueriedEndorsementsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedEndorsementsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EndorsementDocument>>
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
      totalDocuments = await getQueriedTotalEndorsementsService({
        filter: filterWithUserId,
      });
    }

    // get all endorsements
    const endorsements = await getQueriedEndorsementsByUserService({
      filter: filterWithUserId as FilterQuery<EndorsementDocument> | undefined,
      projection: projection as QueryOptions<EndorsementDocument>,
      options: options as QueryOptions<EndorsementDocument>,
    });
    if (endorsements.length === 0) {
      response.status(404).json({
        message: 'No endorsements that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found endorsements',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: endorsements.length,
        resourceData: endorsements,
      });
    }
  }
);

// @desc   Get an endorsement
// @route  GET /endorsement/:endorsementId
// @access Private
const getAnEndorsementHandler = expressAsyncHandler(
  async (
    request: GetAnEndorsementRequest,
    response: Response<ResourceRequestServerResponse<EndorsementDocument>>
  ) => {
    const { endorsementId } = request.params;

    const endorsement = await getAnEndorsementService(endorsementId);
    if (endorsement) {
      response.status(200).json({
        message: 'Endorsement fetched successfully',
        resourceData: [endorsement],
      });
    } else {
      response.status(400).json({ message: 'Endorsement could not be fetched', resourceData: [] });
    }
  }
);

// @desc   Delete an endorsement
// @route  DELETE /endorsement/:id
// @access Private
const deleteEndorsementHandler = expressAsyncHandler(
  async (request: DeleteEndorsementRequest, response: Response) => {
    const { endorsementId } = request.params;

    const deletedEndorsement: DeleteResult = await deleteEndorsementService(endorsementId);
    if (deletedEndorsement.deletedCount === 1) {
      response.status(200).json({
        message: 'Endorsement deleted successfully',
        resourceData: [deletedEndorsement],
      });
    } else {
      response.status(400).json({ message: 'Endorsement could not be deleted', resourceData: [] });
    }
  }
);

// @desc   Delete all endorsements
// @route  DELETE /endorsement
// @access Private
const deleteAllEndorsementsHandler = expressAsyncHandler(
  async (_request: DeleteAllEndorsementsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllEndorsementsService();
    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'Endorsements deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({ message: 'Endorsements could not be deleted', resourceData: [] });
    }
  }
);

// @desc   Update an endorsement
// @route  PATCH /endorsement/:endorsementId
// @access Private
const updateAnEndorsementHandler = expressAsyncHandler(
  async (request: UpdateEndorsementStatusByIdRequest, response: Response) => {
    // anyone can update their own endorsements
    const {
      endorsement: { requestStatus },
    } = request.body;
    const { endorsementId } = request.params;

    // check if endorsement exists
    const endorsement = await getAnEndorsementService(endorsementId);
    if (!endorsement) {
      response.status(404).json({ message: 'Endorsement does not exist' });
      return;
    }

    const updatedEndorsement = await updateEndorsementStatusByIdService({
      endorsementId,
      requestStatus,
    });

    if (updatedEndorsement) {
      response.status(200).json({
        message: 'Endorsement updated successfully',
        resourceData: [updatedEndorsement],
      });
    } else {
      response.status(400).json({ message: 'Endorsement could not be updated', resourceData: [] });
    }
  }
);

export {
  createNewEndorsementHandler,
  getAnEndorsementHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  getQueriedEndorsementsHandler,
  getQueriedEndorsementsByUserHandler,
  updateAnEndorsementHandler,
};
