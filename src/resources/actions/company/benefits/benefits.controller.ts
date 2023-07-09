import expressAsyncHandler from 'express-async-handler';
import type { DeleteResult } from 'mongodb';

import type { Response } from 'express';
import type {
  BenefitsServerResponse,
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetAllBenefitsRequest,
  GetBenefitsByIdRequest,
  GetBenefitsByUserRequest,
} from './benefits.types';
import {
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getAllBenefitsService,
  getBenefitByIdService,
  getBenefitsByUserService,
} from './benefits.service';
import { BenefitsSchema } from './benefits.model';

// @desc   Create a new benefits plan
// @route  POST /benefits
// @access Private/Admin/Manager
const createNewBenefitsHandler = expressAsyncHandler(
  async (request: CreateNewBenefitsRequest, response: Response<BenefitsServerResponse>) => {
    const {
      userInfo: { userId, username, roles },
      benefits: {
        planName,
        planDescription,
        planKind,
        planStartDate,
        isPlanActive,
        currency,
        monthlyPremium,
        employerContribution,
        employeeContribution,
      },
    } = request.body;

    // create new benefits plan object
    const newBenefitsObject: BenefitsSchema = {
      userId,
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
    };

    // create new benefits plan
    const newBenefitsPlan = await createNewBenefitService(newBenefitsObject);
    if (newBenefitsPlan) {
      response
        .status(201)
        .json({ message: 'New benefits plan created', benefitsData: [newBenefitsPlan] });
    } else {
      response
        .status(400)
        .json({ message: 'Unable to create new benefits plan', benefitsData: [] });
    }
  }
);

// @desc   Delete a benefits plan by id
// @route  DELETE /benefits/:benefitsId
// @access Private/Admin/Manager
const deleteABenefitHandler = expressAsyncHandler(
  async (request: DeleteABenefitRequest, response: Response<BenefitsServerResponse>) => {
    const { benefitsId } = request.params;

    // delete a benefits plan
    const deleteBenefitResult: DeleteResult = await deleteABenefitService(benefitsId);
    if (deleteBenefitResult.deletedCount === 1) {
      response.status(200).json({ message: 'Benefits plan deleted', benefitsData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete benefits plan', benefitsData: [] });
    }
  }
);

// @desc   Delete all benefits plans for a user
// @route  DELETE /benefits/user
// @access Private/Admin/Manager
const deleteAllBenefitsByUserHandler = expressAsyncHandler(
  async (request: DeleteAllBenefitsByUserRequest, response: Response<BenefitsServerResponse>) => {
    const userId = request.body.userInfo.userId;

    // delete all benefits plans for a user
    const deleteAllBenefitsResult: DeleteResult = await deleteAllBenefitsByUserService(userId);
    if (deleteAllBenefitsResult.deletedCount > 0) {
      response
        .status(200)
        .json({ message: 'All benefits plans for this user deleted', benefitsData: [] });
    } else {
      response
        .status(400)
        .json({ message: 'Unable to delete all benefits plans for this user', benefitsData: [] });
    }
  }
);

// @desc   Get all benefits plans
// @route  GET /benefits
// @access Private/Admin/Manager
const getAllBenefitsHandler = expressAsyncHandler(
  async (request: GetAllBenefitsRequest, response: Response<BenefitsServerResponse>) => {
    // get all benefits plans
    const allBenefitsPlans = await getAllBenefitsService();
    if (allBenefitsPlans.length > 0) {
      response.status(200).json({
        message: 'All benefits plans fetched successfully',
        benefitsData: allBenefitsPlans,
      });
    } else {
      response.status(400).json({ message: 'Unable to get all benefits plans', benefitsData: [] });
    }
  }
);

// @desc   Get all benefits plans for a user
// @route  GET /benefits/user
// @access Private/Admin/Manager
const getBenefitsByUserHandler = expressAsyncHandler(
  async (request: GetBenefitsByUserRequest, response: Response<BenefitsServerResponse>) => {
    const userId = request.body.userInfo.userId;

    // get all benefits plans for a user
    const allBenefitPlans = await getBenefitsByUserService(userId);
    if (allBenefitPlans.length > 0) {
      response.status(200).json({
        message: 'All benefits plans fetched successfully',
        benefitsData: allBenefitPlans,
      });
    } else {
      response.status(400).json({ message: 'Unable to get all benefits plans', benefitsData: [] });
    }
  }
);

// @desc   Get a benefits plan by id
// @route  GET /benefits/:benefitsId
// @access Private/Admin/Manager
const getBenefitByIdHandler = expressAsyncHandler(
  async (request: GetBenefitsByIdRequest, response: Response<BenefitsServerResponse>) => {
    const { benefitsId } = request.params;

    // get a benefits plan by id
    const benefitsPlan = await getBenefitByIdService(benefitsId);
    if (benefitsPlan) {
      response.status(200).json({
        message: 'Benefits plan fetched successfully',
        benefitsData: [benefitsPlan],
      });
    } else {
      response.status(400).json({ message: 'Unable to get benefits plan', benefitsData: [] });
    }
  }
);

export {
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getBenefitsByUserHandler,
  getBenefitByIdHandler,
};
