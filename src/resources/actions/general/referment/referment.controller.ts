import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetARefermentRequest,
  GetAllRefermentsRequest,
  GetRefermentsByUserRequest,
  RefermentsServerResponse,
  UpdateRefermentRequest,
} from './referment.types';

import { getUserByIdService } from '../../../user';
import {
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
} from './referment.service';

// @desc   create new referment
// @route  POST /referments
// @access Private
const createNewRefermentHandler = expressAsyncHandler(
  async (request: CreateNewRefermentRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      candidateFullName,
      candidateEmail,
      candidateContactNumber,
      candidateCurrentJobTitle,
      candidateCurrentCompany,
      candidateLinkedinProfile,
      positionReferredFor,
      positionJobDescription,
      referralReason,
      additionalInformation,
      privacyConsent,
    } = request.body;

    const newReferment = await createNewRefermentService({
      referrerUserId: userId,
      referrerUsername: username,

      candidateFullName,
      candidateEmail,
      candidateContactNumber,
      candidateCurrentJobTitle,
      candidateCurrentCompany,
      candidateLinkedinProfile,

      positionReferredFor,
      positionJobDescription,
      referralReason,
      additionalInformation,
      privacyConsent,
    });

    response.status(201).json({
      message: 'New referment created successfully',
      refermentData: [newReferment],
    });
  }
);

// @desc   delete a referment
// @route  DELETE /referments/:refermentId
// @access Private
const deleteARefermentHandler = expressAsyncHandler(
  async (request: DeleteARefermentRequest, response: Response) => {
    // only managers/admin can delete referments
    const {
      userInfo: { roles },
    } = request.body;
    if (roles.includes('Employee')) {
      response
        .status(403)
        .json({ message: 'Only managers and admins can delete referments', refermentData: [] });
      return;
    }

    const { refermentId } = request.params;
    // check if referment exists
    const isRefermentExists = await checkRefermentExistsService({ refermentId });
    if (!isRefermentExists) {
      response.status(404).json({ message: 'Referment not found', refermentData: [] });
      return;
    }

    // delete referment
    const deletedResult = await deleteARefermentService(refermentId);
  }
);

export { createNewRefermentHandler, deleteARefermentHandler };
