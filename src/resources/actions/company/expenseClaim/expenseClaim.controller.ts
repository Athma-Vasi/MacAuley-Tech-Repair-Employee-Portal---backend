import expressAsyncHandler from 'express-async-handler';
import type { DeleteResult } from 'mongodb';

import type { Response } from 'express';
import type { AssociatedResourceKind } from '../../../fileUpload';
import type {
  CreateNewExpenseClaimRequest,
  DeleteAllExpenseClaimsRequest,
  DeleteAnExpenseClaimRequest,
  ExpenseClaimServerResponse,
  GetAllExpenseClaimsRequest,
  GetExpenseClaimByIdRequest,
  GetExpenseClaimsByUserRequest,
} from './expenseClaim.types';

import {
  createNewExpenseClaimService,
  deleteAllExpenseClaimsService,
  deleteAnExpenseClaimService,
  getAllExpenseClaimsService,
  getExpenseClaimByIdService,
  getExpenseClaimsByUserService,
} from './expenseClaim.service';
import {
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
  insertAssociatedResourceDocumentIdService,
} from '../../../fileUpload';
import { ExpenseClaimSchema } from './expenseClaim.model';

// @desc   Create a new expense claim
// @route  POST /expense-claim
// @access Private
const createNewExpenseClaimHandler = expressAsyncHandler(
  async (request: CreateNewExpenseClaimRequest, response: Response<ExpenseClaimServerResponse>) => {
    const {
      userInfo: { userId, username },
      expenseClaim: {
        uploadedFileId,
        expenseClaimKind,
        expenseClaimAmount,
        expenseClaimCurrency,
        expenseClaimDate,
        expenseClaimDescription,
        additionalComments,
        acknowledgement,
      },
    } = request.body;

    // user must acknowledge that expenseClaim info is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', expenseClaimData: [] });
      return;
    }

    // create new expenseClaim object
    const newExpenseClaimObject: ExpenseClaimSchema = {
      userId,
      username,
      action: 'company',
      category: 'expense claim',
      uploadedFileId,
      expenseClaimKind,
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
      const expenseClaimDocumentId = newExpenseClaim._id;
      // grab the corresponding fileUpload document
      const fileUpload = await getFileUploadByIdService(uploadedFileId);
      if (!fileUpload) {
        response.status(404).json({ message: 'File upload not found', expenseClaimData: [] });
        return;
      }

      // insert expenseClaim document id into fileUpload document
      // so that we can query for all fileUploads associated with an expenseClaim
      const fileUploadToUpdateObject = {
        ...fileUpload,
        associatedDocumentId: expenseClaimDocumentId,
        associatedResource: 'Expense Claim' as AssociatedResourceKind,
      };

      // put the updated fileUpload document into the database
      const updatedFileUpload = await insertAssociatedResourceDocumentIdService(
        fileUploadToUpdateObject
      );
      if (!updatedFileUpload) {
        response
          .status(400)
          .json({ message: 'File upload could not be updated', expenseClaimData: [] });
        return;
      }

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

    // anyone can view their own expense claims
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

    const expenseClaimId = request.params.expenseClaimId;

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

    // check permissions: only admin and manager can delete all expense claims
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admins can delete all expense claims',
        expenseClaimData: [],
      });
      return;
    }

    // delete all file uploads with associated resource 'Expense Claim'
    const deleteFileUploadsResult: DeleteResult =
      await deleteAllFileUploadsByAssociatedResourceService('expense claim');
    if (deleteFileUploadsResult.deletedCount === 0) {
      response.status(400).json({
        message:
          'All file uploads associated with all expense claims could not be deleted. Expense Claims not deleted. Please try again.',
        expenseClaimData: [],
      });
      return;
    }

    // delete all expense claims
    const deleteExpenseClaimsResult: DeleteResult = await deleteAllExpenseClaimsService();

    if (deleteExpenseClaimsResult.deletedCount > 0) {
      response.status(200).json({ message: 'All expense claims deleted', expenseClaimData: [] });
    } else {
      response
        .status(400)
        .json({ message: 'All expense claims could not be deleted', expenseClaimData: [] });
    }
  }
);

// @desc   Delete expense claim by id
// @route  DELETE /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const deleteAnExpenseClaimHandler = expressAsyncHandler(
  async (request: DeleteAnExpenseClaimRequest, response: Response<ExpenseClaimServerResponse>) => {
    const {
      userInfo: { roles },
      uploadedFileId,
    } = request.body;

    const expenseClaimId = request.params.expenseClaimId;

    // check permissions: only admin and manager can delete an expense claim
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers/admins can delete an expense claim',
        expenseClaimData: [],
      });
      return;
    }

    // delete associated file upload with this expense claim
    const deleteFileUploadResult: DeleteResult = await deleteFileUploadByIdService(uploadedFileId);
    if (deleteFileUploadResult.deletedCount === 0) {
      response.status(400).json({
        message:
          'File upload associated with this expense claim could not be deleted. Expense Claim not deleted. Please try again.',
        expenseClaimData: [],
      });
      return;
    }

    // delete expense claim by id
    const deleteExpenseClaimResult: DeleteResult = await deleteAnExpenseClaimService(
      expenseClaimId
    );

    if (deleteExpenseClaimResult.deletedCount > 0) {
      response.status(200).json({ message: 'Expense claim deleted', expenseClaimData: [] });
    } else {
      response.status(400).json({
        message: 'Expense claim could not be deleted. Please try again.',
        expenseClaimData: [],
      });
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
