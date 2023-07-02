import expressAsyncHandler from 'express-async-handler';
import { Types } from 'mongoose';

import type { Response } from 'express';
import type {
  BenefitsServerResponse,
  CreateNewBenefitsRequest,
  DeleteABenefitsRequest,
  DeleteAllBenefitsRequest,
  GetAllBenefitsRequest,
  GetBenefitsByIdRequest,
  GetBenefitsByUserRequest,
} from './benefits.types';
import { createNewBenefitsService } from './benefits.service';

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

export { createNewBenefitsHandler };
