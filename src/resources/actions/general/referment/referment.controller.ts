import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetRefermentRequestById,
  GetQueriedRefermentsRequest,
  GetQueriedRefermentsByUserRequest,
  UpdateARefermentRequest,
} from './referment.types';

import {
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
  deleteAllRefermentsService,
  getRefermentByIdService,
  getQueriedRefermentsService,
  getQueriedRefermentsByUserService,
  updateARefermentService,
  getQueriedTotalRefermentsService,
} from './referment.service';
import { RefermentDocument } from './referment.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   create new referment
// @route  POST /referments
// @access Private
const createNewRefermentHandler = expressAsyncHandler(
  async (
    request: CreateNewRefermentRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      referment: {
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
        requestStatus,
      },
    } = request.body;

    // user must acknowledge privacy consent
    if (!privacyConsent) {
      response.status(400).json({ message: 'Privacy consent is required', resourceData: [] });
      return;
    }

    const newReferment = await createNewRefermentService({
      referrerUserId: userId,
      referrerUsername: username,
      action: 'general',
      category: 'referment',

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
      requestStatus,
    });

    if (!newReferment) {
      response.status(400).json({ message: 'Referment could not be created', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'New referment created successfully',
      resourceData: [newReferment],
    });
  }
);

// @desc   get all referments
// @route  GET /referments
// @access Private
const getQueriedRefermentsHandler = expressAsyncHandler(
  async (
    request: GetQueriedRefermentsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RefermentDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRefermentsService({
        filter: filter as FilterQuery<RefermentDocument> | undefined,
      });
    }

    // get all referments
    const referments = await getQueriedRefermentsService({
      filter: filter as FilterQuery<RefermentDocument> | undefined,
      projection: projection as QueryOptions<RefermentDocument>,
      options: options as QueryOptions<RefermentDocument>,
    });
    if (referments.length === 0) {
      response.status(404).json({
        message: 'No referments that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found referments',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: referments.length,
        resourceData: referments,
      });
    }
  }
);

// @desc   get referments by user
// @route  GET /referments/user/
// @access Private
const getQueriedRefermentsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedRefermentsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RefermentDocument>>
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
      totalDocuments = await getQueriedTotalRefermentsService({
        filter: filterWithUserId,
      });
    }

    const referments = await getQueriedRefermentsByUserService({
      filter: filterWithUserId as FilterQuery<RefermentDocument> | undefined,
      projection: projection as QueryOptions<RefermentDocument>,
      options: options as QueryOptions<RefermentDocument>,
    });
    if (referments.length === 0) {
      response.status(404).json({
        message: 'No referments found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Referments found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: referments.length,
        resourceData: referments,
      });
    }
  }
);

// @desc   get a referment
// @route  GET /referments/:refermentId
// @access Private
const getARefermentByIdHandler = expressAsyncHandler(
  async (
    request: GetRefermentRequestById,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>
  ) => {
    const { refermentId } = request.params;

    const referment = await getRefermentByIdService(refermentId);
    if (referment) {
      response
        .status(200)
        .json({ message: 'Referment fetched successfully', resourceData: [referment] });
    } else {
      response.status(400).json({ message: 'Referment could not be fetched', resourceData: [] });
    }
  }
);

// @desc   update a referment
// @route  PUT /referments/:refermentId
// @access Private
const updateARefermentHandler = expressAsyncHandler(
  async (
    request: UpdateARefermentRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>
  ) => {
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
    const referment = await getRefermentByIdService(refermentId);
    if (!referment) {
      response.status(404).json({ message: 'Referment not found', resourceData: [] });
      return;
    }

    // check that referment to be updated belongs to the user
    if (referment.referrerUserId !== userId) {
      response.status(403).json({
        message: 'You are not authorized to update as you are not the originator of this referment',
        resourceData: [],
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
        .json({ message: 'Referment updated successfully', resourceData: [updatedReferment] });
    } else {
      response.status(400).json({ message: 'Referment could not be updated', resourceData: [] });
    }
  }
);

// @desc   delete a referment
// @route  DELETE /referments/:refermentId
// @access Private
const deleteARefermentHandler = expressAsyncHandler(
  async (
    request: DeleteARefermentRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>
  ) => {
    const { refermentId } = request.params;
    // check if referment exists
    const isRefermentExists = await checkRefermentExistsService({ refermentId });
    if (!isRefermentExists) {
      response.status(404).json({ message: 'Referment not found', resourceData: [] });
      return;
    }

    // delete referment
    const deletedResult = await deleteARefermentService(refermentId);
    if (deletedResult) {
      response.status(200).json({ message: 'Referment deleted successfully', resourceData: [] });
    } else {
      response.status(400).json({ message: 'Referment could not be deleted', resourceData: [] });
    }
  }
);

// @desc   delete all referments
// @route  DELETE /referments
// @access Private
const deleteAllRefermentsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllRefermentsRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>
  ) => {
    const deletedResult = await deleteAllRefermentsService();
    if (deletedResult.acknowledged) {
      response
        .status(200)
        .json({ message: 'All referments deleted successfully', resourceData: [] });
    } else {
      response.status(400).json({ message: 'Referments could not be deleted', resourceData: [] });
    }
  }
);

export {
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
  getQueriedRefermentsHandler,
  getARefermentByIdHandler,
  getQueriedRefermentsByUserHandler,
  updateARefermentHandler,
};
