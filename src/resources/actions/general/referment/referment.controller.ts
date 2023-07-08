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
  UpdateARefermentRequest,
} from './referment.types';

import {
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
  deleteAllRefermentsService,
  getARefermentService,
  getAllRefermentsService,
  getRefermentsByUserService,
  updateARefermentService,
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
      candidateProfileUrl,
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
      candidateProfileUrl,

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
    const {
      userInfo: { roles, userId },
    } = request.body;

    // only managers/admin can delete referments
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
    if (deletedResult) {
      response.status(200).json({ message: 'Referment deleted successfully', refermentData: [] });
    } else {
      response.status(400).json({ message: 'Referment could not be deleted', refermentData: [] });
    }
  }
);

// @desc   delete all referments
// @route  DELETE /referments
// @access Private
const deleteAllRefermentsHandler = expressAsyncHandler(
  async (request: DeleteAllRefermentsRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // only managers/admin can delete all referments
    if (roles.includes('Employee')) {
      response
        .status(403)
        .json({ message: 'Only managers and admins can delete all referments', refermentData: [] });
      return;
    }

    const deletedResult = await deleteAllRefermentsService();
    if (deletedResult.acknowledged) {
      response
        .status(200)
        .json({ message: 'All referments deleted successfully', refermentData: [] });
    } else {
      response.status(400).json({ message: 'Referments could not be deleted', refermentData: [] });
    }
  }
);

// @desc   get all referments
// @route  GET /referments
// @access Private
const getAllRefermentsHandler = expressAsyncHandler(
  async (request: GetAllRefermentsRequest, response: Response<RefermentsServerResponse>) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // only managers/admin can get all referments
    if (roles.includes('Employee')) {
      response
        .status(403)
        .json({ message: 'Only managers and admins can get all referments', refermentData: [] });
      return;
    }

    const allReferments = await getAllRefermentsService();
    if (allReferments.length === 0) {
      response.status(404).json({ message: 'No referments found', refermentData: [] });
      return;
    } else {
      response
        .status(200)
        .json({ message: 'All referments fetched successfully', refermentData: allReferments });
    }
  }
);

// @desc   get a referment
// @route  GET /referments/:refermentId
// @access Private
const getARefermentHandler = expressAsyncHandler(
  async (request: GetARefermentRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
      refermentId,
    } = request.body;

    // only managers/admin can get a referment by its id
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can get a referment by its id',
        refermentData: [],
      });
      return;
    }

    // check if referment exists
    const isRefermentExists = await checkRefermentExistsService({ refermentId });
    if (!isRefermentExists) {
      response.status(404).json({ message: 'Referment not found', refermentData: [] });
      return;
    }

    const referment = await getARefermentService(refermentId);
    if (referment) {
      response
        .status(200)
        .json({ message: 'Referment fetched successfully', refermentData: [referment] });
    } else {
      response.status(400).json({ message: 'Referment could not be fetched', refermentData: [] });
    }
  }
);

// @desc   get referments by user
// @route  GET /referments/user/
// @access Private
const getRefermentsByUserHandler = expressAsyncHandler(
  async (request: GetRefermentsByUserRequest, response: Response) => {
    const {
      userInfo: { userId },
    } = request.body;

    // anyone can view their own referments
    const referments = await getRefermentsByUserService(userId);
    if (referments) {
      response
        .status(200)
        .json({ message: 'Referments fetched successfully', refermentData: referments });
    } else {
      response.status(400).json({ message: 'Referments could not be fetched', refermentData: [] });
    }
  }
);

// @desc   update a referment
// @route  PUT /referments/:refermentId
// @access Private
const updateARefermentHandler = expressAsyncHandler(
  async (request: UpdateARefermentRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      candidateFullName,
      candidateEmail,
      candidateContactNumber,
      candidateCurrentJobTitle,
      candidateCurrentCompany,
      candidateProfileUrl,
      positionReferredFor,
      positionJobDescription,
      referralReason,
      additionalInformation,
      privacyConsent,
    } = request.body;

    // anyone can update their own referments
    const { refermentId } = request.params;
    // check that referment to be updated exists
    const referment = await getARefermentService(refermentId);
    if (!referment) {
      response.status(404).json({ message: 'Referment not found', refermentData: [] });
      return;
    }

    // check that referment to be updated belongs to the user
    if (referment.referrerUserId !== userId) {
      response.status(403).json({
        message: 'You are not authorized to update as you are not the originator of this referment',
        refermentData: [],
      });
      return;
    }

    // update referment
    const updatedReferment = await updateARefermentService({
      refermentId,
      referrerUserId: userId,
      referrerUsername: username,
      candidateFullName,
      candidateEmail,
      candidateContactNumber,
      candidateCurrentJobTitle,
      candidateCurrentCompany,
      candidateProfileUrl,
      positionReferredFor,
      positionJobDescription,
      referralReason,
      additionalInformation,
      privacyConsent,
    });

    if (updatedReferment) {
      response
        .status(200)
        .json({ message: 'Referment updated successfully', refermentData: [updatedReferment] });
    } else {
      response.status(400).json({ message: 'Referment could not be updated', refermentData: [] });
    }
  }
);

export {
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
  getAllRefermentsHandler,
  getARefermentHandler,
  getRefermentsByUserHandler,
  updateARefermentHandler,
};
