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
import {
  createNewExpenseClaimService,
  deleteAllExpenseClaimsService,
  deleteAnExpenseClaimService,
  getAllExpenseClaimsService,
  getExpenseClaimByIdService,
  getExpenseClaimsByUserService,
} from './expenseClaim.service';

// @desc   Create a new expense claim
// @route  POST /expense-claim
// @access Private
const createNewExpenseClaimHandler = expressAsyncHandler(
  async (request: CreateNewExpenseClaimRequest, response: Response<ExpenseClaimServerResponse>) => {
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
  async (request: GetAllExpenseClaimsRequest, response: Response<ExpenseClaimServerResponse>) => {
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

// @desc   Get expense claims by user
// @route  GET /expense-claim/user
// @access Private
const getExpenseClaimsByUserHandler = expressAsyncHandler(
  async (
    request: GetExpenseClaimsByUserRequest,
    response: Response<ExpenseClaimServerResponse>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', expenseClaimData: [] });
      return;
    }

    // get expense claims by user
    const expenseClaimsByUser = await getExpenseClaimsByUserService(userId);
    if (expenseClaimsByUser.length > 0) {
      response.status(200).json({
        message: 'Successfully fetched expense claims',
        expenseClaimData: expenseClaimsByUser,
      });
    } else {
      response.status(404).json({ message: 'No expense claims found', expenseClaimData: [] });
    }
  }
);

// @desc   Get expense claim by id
// @route  GET /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const getExpenseClaimByIdHandler = expressAsyncHandler(
  async (request: GetExpenseClaimByIdRequest, response: Response<ExpenseClaimServerResponse>) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', expenseClaimData: [] });
      return;
    }

    const expenseClaimId = request.params.expenseClaimId as Types.ObjectId;

    // check permissions: only admin and manager can view an expense claim that does not belong to them
    if (roles.includes('Employee')) {
      const expenseClaim = await getExpenseClaimsByUserService(userId);
      if (!expenseClaim) {
        response.status(404).json({ message: 'Expense claim not found', expenseClaimData: [] });
        return;
      }
      response.status(200).json({
        message: 'Successfully fetched expense claim',
        expenseClaimData: expenseClaim,
      });
      return;
    }

    // get expense claim by id
    const expenseClaim = await getExpenseClaimByIdService(expenseClaimId);
    if (expenseClaim) {
      response.status(200).json({
        message: 'Successfully fetched expense claim',
        expenseClaimData: [expenseClaim],
      });
    } else {
      response.status(404).json({ message: 'Expense claim not found', expenseClaimData: [] });
    }
  }
);

// @desc   Delete all expense claims
// @route  DELETE /expense-claim
// @access Private/Admin/Manager
const deleteAllExpenseClaimsHandler = expressAsyncHandler(
  async (request: DeleteAllExpenseClaimsRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', expenseClaimData: [] });
      return;
    }

    // check permissions: only admin and manager can delete all expense claims
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admins can delete all expense claims',
        expenseClaimData: [],
      });
      return;
    }

    // delete all expense claims
    const deletedResult = await deleteAllExpenseClaimsService();

    if (deletedResult.acknowledged) {
      response.status(200).json({ message: 'All expense claims deleted', expenseClaimData: [] });
    } else {
      response.status(404).json({ message: 'No expense claims found', expenseClaimData: [] });
    }
  }
);

// @desc   Delete expense claim by id
// @route  DELETE /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const deleteAnExpenseClaimHandler = expressAsyncHandler(
  async (request: DeleteAnExpenseClaimRequest, response: Response<ExpenseClaimServerResponse>) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', expenseClaimData: [] });
      return;
    }

    const expenseClaimId = request.params.expenseClaimId as Types.ObjectId;

    // check permissions: only admin and manager can delete an expense claim
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admins can delete an expense claim',
        expenseClaimData: [],
      });
      return;
    }

    // delete expense claim by id
    const deletedResult = await deleteAnExpenseClaimService(expenseClaimId);

    if (deletedResult.acknowledged) {
      response.status(200).json({ message: 'Expense claim deleted', expenseClaimData: [] });
    } else {
      response.status(404).json({ message: 'Expense claim not found', expenseClaimData: [] });
    }
  }
);

export {
  createNewExpenseClaimHandler,
  getAllExpenseClaimsHandler,
  getExpenseClaimsByUserHandler,
  getExpenseClaimByIdHandler,
  deleteAllExpenseClaimsHandler,
  deleteAnExpenseClaimHandler,
};
