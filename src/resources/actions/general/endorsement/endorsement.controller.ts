import expressAsyncHandler from 'express-async-handler';
import {
  createNewEndorsementService,
  deleteAllEndorsementsService,
  deleteEndorsementService,
  getAllEndorsementsService,
  getAnEndorsementService,
  getEndorsementsByUserService,
} from './endorsement.service';

import type { Response } from 'express';
import type {
  CreateNewEndorsementRequest,
  DeleteAllEndorsementsRequest,
  DeleteEndorsementRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
} from './endorsement.types';
import { getUserByIdService } from '../../../user';

// @desc   Create new endorsement
// @route  POST /endorsements
// @access Private
const createNewEndorsementHandler = expressAsyncHandler(
  async (request: CreateNewEndorsementRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      title,
      section,
      userToBeEndorsed,
      attributeEndorsed,
      summaryOfEndorsement,
    } = request.body;

    const newEndorsementObject = {
      userId,
      section,
      title,
      username,
      userToBeEndorsed,
      summaryOfEndorsement,
      attributeEndorsed,
    };
    const newEndorsement = await createNewEndorsementService(newEndorsementObject);

    if (newEndorsement) {
      response.status(201).json({
        message: 'Endorsement created successfully',
        endorsementData: [newEndorsement],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Endorsement could not be created', endorsementData: [] });
    }
  }
);

// @desc   Get all endorsements
// @route  GET /endorsements
// @access Private
const getAllEndorsementsHandler = expressAsyncHandler(
  async (request: GetAllEndorsementsRequest, response: Response) => {
    // only managers/admins can view all endorsements
    const {
      userInfo: { roles },
    } = request.body;
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can view all endorsements',
        endorsementData: [],
      });
      return;
    }

    const endorsements = await getAllEndorsementsService();

    if (endorsements.length === 0) {
      response
        .status(400)
        .json({ message: 'Endorsements could not be fetched', endorsementData: [] });
    } else {
      response.status(200).json({
        message: 'Endorsements fetched successfully',
        endorsementData: [endorsements],
      });
    }
  }
);

// @desc   Get an endorsement
// @route  GET /endorsements/:id
// @access Private
const getAnEndorsementHandler = expressAsyncHandler(
  async (request: GetAnEndorsementRequest, response: Response) => {
    // only managers/admins can view an endorsement by its id
    const {
      userInfo: { roles },
    } = request.body;
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can view an endorsement not belonging to them',
        endorsementData: [],
      });
      return;
    }

    const { endorsementId } = request.params;

    const endorsement = await getAnEndorsementService(endorsementId);
    if (endorsement) {
      response.status(200).json({
        message: 'Endorsement fetched successfully',
        endorsementData: [endorsement],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Endorsement could not be fetched', endorsementData: [] });
    }
  }
);

// @desc   Get endorsements by user
// @route  GET /endorsements/user
// @access Private
const getEndorsementsByUserHandler = expressAsyncHandler(
  async (request: GetEndorsementsFromUserRequest, response: Response) => {
    // anyone can view their own endorsements
    const {
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    const endorsements = await getEndorsementsByUserService(userId);
    if (endorsements.length === 0) {
      response.status(400).json({ message: 'No endorsements found', endorsementData: [] });
    } else {
      response.status(200).json({
        message: 'Endorsements fetched successfully',
        endorsementData: [endorsements],
      });
    }
  }
);

// @desc   Delete an endorsement
// @route  DELETE /endorsements/:id
// @access Private
const deleteEndorsementHandler = expressAsyncHandler(
  async (request: DeleteEndorsementRequest, response: Response) => {
    // only managers/admins can delete an endorsement by its id
    const {
      userInfo: { roles },
    } = request.body;
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can delete an endorsement',
        endorsementData: [],
      });
      return;
    }

    const { endorsementId } = request.params;

    const deletedEndorsement = await deleteEndorsementService(endorsementId);
    if (deletedEndorsement) {
      response.status(200).json({
        message: 'Endorsement deleted successfully',
        endorsementData: [deletedEndorsement],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Endorsement could not be deleted', endorsementData: [] });
    }
  }
);

// @desc   Delete all endorsements
// @route  DELETE /endorsements
// @access Private
const deleteAllEndorsementsHandler = expressAsyncHandler(
  async (request: DeleteAllEndorsementsRequest, response: Response) => {
    // only managers/admins can delete all endorsements
    const {
      userInfo: { roles },
    } = request.body;
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can delete all endorsements',
        endorsementData: [],
      });
      return;
    }

    const deletedEndorsements = await deleteAllEndorsementsService();
    if (deletedEndorsements.acknowledged) {
      response.status(200).json({
        message: 'Endorsements deleted successfully',
        endorsementData: [],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Endorsements could not be deleted', endorsementData: [] });
    }
  }
);

export {
  createNewEndorsementHandler,
  getAnEndorsementHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  getAllEndorsementsHandler,
  getEndorsementsByUserHandler,
};
