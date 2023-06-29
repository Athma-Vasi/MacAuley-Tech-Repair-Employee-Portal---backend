import expressAsyncHandler from 'express-async-handler';

import { Types } from 'mongoose';
import type { Response } from 'express';
import type {
  CreateNewExpenseClaimRequest,
  DeleteAllExpenseClaimsRequest,
  DeleteAnExpenseClaimRequest,
  ExpenseClaimServerResponse,
  GetAllExpenseClaimsRequest,
  GetExpenseClaimByIdRequest,
  GetExpenseClaimsByUserRequest,
} from './expenseClaim.types';

import { getUserByIdService } from '../../../user';
import { createNewExpenseClaimService, getAllExpenseClaimsService } from './expenseClaim.service';

// @desc   Create a new expense claim
// @route  POST /expense-claim
// @access Private
const createNewExpenseClaimHandler = expressAsyncHandler(
  async (request: CreateNewExpenseClaimRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      expenseClaim: {
        receiptPhotoId,
        expenseClaimType,
        expenseClaimAmount,
        expenseClaimCurrency,
        expenseClaimDate,
        expenseClaimDescription,
        additionalComments,
        acknowledgement,
      },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', expenseClaimData: [] });
      return;
    }

    // user must acknowledge that expenseClaim info is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', expenseClaimData: [] });
      return;
    }

    // TODO: check if receiptPhotoId exists

    // create new expenseClaim object
    const newExpenseClaimObject = {
      userId,
      username,
      receiptPhotoId,
      expenseClaimType,
      expenseClaimAmount,
      expenseClaimCurrency,
      expenseClaimDate,
      expenseClaimDescription,
      additionalComments,
      acknowledgement,
    };

    // create new expenseClaim
    const newExpenseClaim = await createNewExpenseClaimService(newExpenseClaimObject);

    if (newExpenseClaim) {
      response
        .status(201)
        .json({ message: 'New expense claim created', expenseClaimData: [newExpenseClaim] });
    } else {
      response
        .status(400)
        .json({ message: 'New expense claim could not be created', expenseClaimData: [] });
    }
  }
);

// @desc   Get all expense claims
// @route  GET /expense-claim
// @access Private/Admin/Manager
const getAllExpenseClaimsHandler = expressAsyncHandler(
  async (request: GetAllExpenseClaimsRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', expenseClaimData: [] });
      return;
    }

    // check permissions: only admin and manager can view all expense claims
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admins can view all expense claims',
        expenseClaimData: [],
      });
      return;
    }

    // get all expense claims
    const allExpenseClaims = await getAllExpenseClaimsService();

    if (allExpenseClaims) {
      response
        .status(200)
        .json({ message: 'All expense claims', expenseClaimData: allExpenseClaims });
    } else {
      response.status(404).json({ message: 'No expense claims found', expenseClaimData: [] });
    }
  }
);

export { createNewExpenseClaimHandler, getAllExpenseClaimsHandler };
