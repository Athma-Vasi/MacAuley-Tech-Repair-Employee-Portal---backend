import expressAsyncHandler from 'express-async-handler';
import { EndorsementModel } from './endorsement.model';
import {
  createNewEndorsementService,
  deleteEndorsementService,
  getAllEndorsementsService,
  getAnEndorsementService,
  getEndorsementsByUserService,
} from './endorsement.service';

import type { Request, Response } from 'express';
import type {
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
} from './index';

const createNewEndorsementHandler = expressAsyncHandler(
  async (request: CreateNewEndorsementRequest, response: Response) => {
    const newEndorsement = await createNewEndorsementService(request.body);

    if (newEndorsement) {
      response.status(201).json({
        message: 'Endorsement created successfully',
        endorsement: newEndorsement,
      });
    } else {
      response.status(400).json({ message: 'Endorsement could not be created', endorsement: [] });
    }
  }
);

const getAllEndorsementsHandler = expressAsyncHandler(
  async (request: GetAllEndorsementsRequest, response: Response) => {
    const endorsements = await getAllEndorsementsService();

    if (endorsements.length === 0) {
      response.status(400).json({ message: 'Endorsements could not be fetched', endorsements: [] });
    } else {
      response.status(200).json({
        message: 'Endorsements fetched successfully',
        endorsements,
      });
    }
  }
);

const getAnEndorsementHandler = expressAsyncHandler(
  async (request: GetAnEndorsementRequest, response: Response) => {
    const { id: endorsementId } = request.params;

    const endorsement = await getAnEndorsementService(endorsementId);
    if (endorsement) {
      response.status(200).json({
        message: 'Endorsement fetched successfully',
        endorsement,
      });
    } else {
      response.status(400).json({ message: 'Endorsement could not be fetched', endorsement: [] });
    }
  }
);

const getEndorsementsByUserHandler = expressAsyncHandler(
  async (request: GetEndorsementsFromUserRequest, response: Response) => {
    const {
      userInfo: { userId },
    } = request.body;

    const endorsements = await getEndorsementsByUserService(userId);
    if (endorsements.length === 0) {
      response.status(400).json({ message: 'No endorsements found', endorsements: [] });
    } else {
      response.status(200).json({
        message: 'Endorsements fetched successfully',
        endorsements,
      });
    }
  }
);

const deleteEndorsementHandler = expressAsyncHandler(
  async (request: DeleteEndorsementRequest, response: Response) => {
    const { id: endorsementId } = request.params;

    const deletedEndorsement = await deleteEndorsementService(endorsementId);
    if (deletedEndorsement) {
      response.status(200).json({
        message: 'Endorsement deleted successfully',
        endorsement: deletedEndorsement,
      });
    } else {
      response.status(400).json({ message: 'Endorsement could not be deleted', endorsement: {} });
    }
  }
);

export {
  createNewEndorsementHandler,
  getAnEndorsementHandler,
  deleteEndorsementHandler,
  getAllEndorsementsHandler,
  getEndorsementsByUserHandler,
};
