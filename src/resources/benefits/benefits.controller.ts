import expressAsyncHandler from 'express-async-handler';
import { Types } from 'mongoose';

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
  createNewBenefitsService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
} from './benefits.service';

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
        monthlyPremium,
        employerContribution,
        employeeContribution,
      },
    } = request.body;

    // create new benefits plan object
    const newBenefitsObject = {
      userId,
      username,
      planName,
      planDescription,
      planKind,
      planStartDate,
      isPlanActive,
      monthlyPremium,
      employerContribution,
      employeeContribution,
    };

    // create new benefits plan
    const newBenefitsPlan = await createNewBenefitsService(newBenefitsObject);
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
    const deleteBenefitResult = await deleteABenefitService(benefitsId);
    if (deleteBenefitResult.deletedCount === 1) {
      response.status(200).json({ message: 'Benefits plan deleted', benefitsData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete benefits plan', benefitsData: [] });
    }
  }
);

// @desc   Delete all benefits plans for a user
// @route  DELETE /benefits
// @access Private/Admin/Manager
const DeleteAllBenefitsByUserRequest = expressAsyncHandler(
  async (request: DeleteAllBenefitsByUserRequest, response: Response<BenefitsServerResponse>) => {
    const { userId } = request.params;

    // delete all benefits plans for a user
    const deleteAllBenefitsResult = await deleteAllBenefitsByUserService(userId);
    if (deleteAllBenefitsResult.deletedCount >= 1) {
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

export { createNewBenefitsHandler, deleteABenefitHandler, DeleteAllBenefitsByUserRequest };
