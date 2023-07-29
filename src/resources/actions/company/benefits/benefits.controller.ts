import expressAsyncHandler from 'express-async-handler';
import type { DeleteResult } from 'mongodb';

import type { Response } from 'express';
import type {
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  GetBenefitsByIdRequest,
  GetQueriedBenefitsByUserRequest,
  UpdateBenefitsStatusByIdRequest,
} from './benefits.types';
import {
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getQueriedBenefitsService,
  getBenefitByIdService,
  getQueriedBenefitsByUserService,
  getQueriedTotalBenefitsService,
  updateBenefitStatusByIdService,
} from './benefits.service';
import { BenefitsDocument, BenefitsSchema } from './benefits.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';
import { getQueriedTotalLeaveRequestsService } from '../leaveRequest/leaveRequest.service';
import { getUserByUsernameService } from '../../../user';

// @desc   Create a new benefits plan
// @route  POST /benefits
// @access Private/Admin/Manager
const createNewBenefitsHandler = expressAsyncHandler(
  async (
    request: CreateNewBenefitsRequest,
    response: Response<ResourceRequestServerResponse<BenefitsDocument>>
  ) => {
    const {
      userInfo: { roles },
      benefit: {
        username,
        planName,
        planDescription,
        planKind,
        planStartDate,
        isPlanActive,
        currency,
        monthlyPremium,
        employerContribution,
        employeeContribution,
        requestStatus,
      },
    } = request.body;

    // only managers can create a new benefits plan
    // by default, verifyRoles middleware allows all to access POST routes
    if (!roles.includes('Manager')) {
      response.status(403).json({ message: 'User does not have permission', resourceData: [] });
      return;
    }

    // get userId from benefit username
    const benefitUserDoc = await getUserByUsernameService(username);
    if (!benefitUserDoc) {
      response.status(404).json({ message: 'User not found', resourceData: [] });
      return;
    }
    const benefitUserId = benefitUserDoc._id;

    // create new benefits plan object
    const newBenefitsObject: BenefitsSchema = {
      benefitUserId,
      username,
      action: 'company',
      category: 'benefits',

      planName,
      planDescription,
      planKind,
      planStartDate,
      isPlanActive,
      currency,
      monthlyPremium,
      employerContribution,
      employeeContribution,
      requestStatus,
    };

    // create new benefits plan
    const newBenefitsPlan = await createNewBenefitService(newBenefitsObject);
    if (newBenefitsPlan) {
      response
        .status(201)
        .json({ message: 'New benefit plan created', resourceData: [newBenefitsPlan] });
    } else {
      response.status(400).json({ message: 'Unable to create new benefit plan', resourceData: [] });
    }
  }
);

// @desc   Get all benefits plans
// @route  GET /benefits
// @access Private/Admin/Manager
const getAllBenefitsHandler = expressAsyncHandler(
  async (
    request: GetQueriedBenefitsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<BenefitsDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalBenefitsService({
        filter: filter as FilterQuery<BenefitsDocument> | undefined,
      });
    }

    // get all benefits plans
    const allBenefitsPlans = await getQueriedBenefitsService({
      filter: filter as FilterQuery<BenefitsDocument> | undefined,
      projection: projection as QueryOptions<BenefitsDocument>,
      options: options as QueryOptions<BenefitsDocument>,
    });
    if (allBenefitsPlans.length === 0) {
      response.status(404).json({
        message: 'No benefits that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'All benefits plans fetched successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: allBenefitsPlans,
      });
    }
  }
);

// @desc   Get all benefits plans for a user
// @route  GET /benefits/user
// @access Private/Admin/Manager
const getQueriedBenefitsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedBenefitsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<BenefitsDocument>>
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
      totalDocuments = await getQueriedTotalLeaveRequestsService({
        filter: filterWithUserId,
      });
    }

    const benefits = await getQueriedBenefitsByUserService({
      filter: filterWithUserId as FilterQuery<BenefitsDocument> | undefined,
      projection: projection as QueryOptions<BenefitsDocument>,
      options: options as QueryOptions<BenefitsDocument>,
    });
    if (benefits.length === 0) {
      response.status(404).json({
        message: 'No benefits that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Benefits plans fetched successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: benefits,
      });
    }
  }
);

// @desc   Get a benefits plan by id
// @route  GET /benefits/:benefitsId
// @access Private/Admin/Manager
const getBenefitByIdHandler = expressAsyncHandler(
  async (
    request: GetBenefitsByIdRequest,
    response: Response<ResourceRequestServerResponse<BenefitsDocument>>
  ) => {
    const { benefitsId } = request.params;

    // get a benefits plan by id
    const benefitsPlan = await getBenefitByIdService(benefitsId);
    if (benefitsPlan) {
      response.status(200).json({
        message: 'Benefits plan fetched successfully',
        resourceData: [benefitsPlan],
      });
    } else {
      response.status(400).json({ message: 'Unable to get benefits plan', resourceData: [] });
    }
  }
);

// @desc   Update a benefits plan by id
// @route  PATCH /benefits/:benefitsId
// @access Private/Admin/Manager
const updateBenefitStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateBenefitsStatusByIdRequest,
    response: Response<ResourceRequestServerResponse<BenefitsDocument>>
  ) => {
    const { benefitId } = request.params;
    const {
      benefit: { requestStatus },
    } = request.body;

    // check if benefits plan exists
    const benefitsPlan = await getBenefitByIdService(benefitId);
    if (!benefitsPlan) {
      response.status(404).json({
        message: 'Benefits plan does not exist',
        resourceData: [],
      });
      return;
    }

    // update a benefits plan by id
    const updatedBenefitsPlan = await updateBenefitStatusByIdService({ benefitId, requestStatus });
    if (updatedBenefitsPlan) {
      response.status(200).json({
        message: 'Benefits plan updated successfully',
        resourceData: [updatedBenefitsPlan],
      });
    } else {
      response.status(400).json({ message: 'Unable to update benefits plan', resourceData: [] });
    }
  }
);

// @desc   Delete a benefits plan by id
// @route  DELETE /benefits/:benefitsId
// @access Private/Admin/Manager
const deleteABenefitHandler = expressAsyncHandler(
  async (
    request: DeleteABenefitRequest,
    response: Response<ResourceRequestServerResponse<BenefitsDocument>>
  ) => {
    const { benefitsId } = request.params;

    // delete a benefits plan
    const deleteBenefitResult: DeleteResult = await deleteABenefitService(benefitsId);
    if (deleteBenefitResult.deletedCount === 1) {
      response.status(200).json({ message: 'Benefits plan deleted', resourceData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete benefits plan', resourceData: [] });
    }
  }
);

// @desc   Delete all benefits plans for a user
// @route  DELETE /benefits/user
// @access Private/Admin/Manager
const deleteAllBenefitsByUserHandler = expressAsyncHandler(
  async (
    request: DeleteAllBenefitsByUserRequest,
    response: Response<ResourceRequestServerResponse<BenefitsDocument>>
  ) => {
    const userId = request.body.userInfo.userId;

    // delete all benefits plans for a user
    const deleteAllBenefitsResult: DeleteResult = await deleteAllBenefitsByUserService(userId);
    if (deleteAllBenefitsResult.deletedCount > 0) {
      response
        .status(200)
        .json({ message: 'All benefits plans for this user deleted', resourceData: [] });
    } else {
      response
        .status(400)
        .json({ message: 'Unable to delete all benefits plans for this user', resourceData: [] });
    }
  }
);

export {
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getQueriedBenefitsByUserHandler,
  getBenefitByIdHandler,
  updateBenefitStatusByIdHandler,
};
