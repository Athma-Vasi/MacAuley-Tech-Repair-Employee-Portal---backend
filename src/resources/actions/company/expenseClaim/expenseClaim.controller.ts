import expressAsyncHandler from 'express-async-handler';
import type { DeleteResult } from 'mongodb';

import type { Response } from 'express';
import type { AssociatedResourceKind } from '../../../fileUpload';
import type {
  CreateNewExpenseClaimRequest,
  DeleteAllExpenseClaimsRequest,
  DeleteAnExpenseClaimRequest,
  GetQueriedExpenseClaimsRequest,
  GetExpenseClaimByIdRequest,
  GetQueriedExpenseClaimsByUserRequest,
} from './expenseClaim.types';

import {
  createNewExpenseClaimService,
  deleteAllExpenseClaimsService,
  deleteAnExpenseClaimService,
  getQueriedExpenseClaimsService,
  getExpenseClaimByIdService,
  getQueriedExpenseClaimsByUserService,
  getQueriedTotalExpenseClaimsService,
} from './expenseClaim.service';
import {
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
  insertAssociatedResourceDocumentIdService,
} from '../../../fileUpload';
import { ExpenseClaimDocument, ExpenseClaimSchema } from './expenseClaim.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create a new expense claim
// @route  POST /expense-claim
// @access Private
const createNewExpenseClaimHandler = expressAsyncHandler(
  async (
    request: CreateNewExpenseClaimRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
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
        requestStatus,
      },
    } = request.body;

    // user must acknowledge that expenseClaim info is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', resourceData: [] });
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
      requestStatus,
    };

    // user must acknowledge that expenseClaim info is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', resourceData: [] });
      return;
    }

    // create new expenseClaim
    const newExpenseClaim = await createNewExpenseClaimService(newExpenseClaimObject);

    if (newExpenseClaim) {
      const expenseClaimDocumentId = newExpenseClaim._id;
      // grab the corresponding fileUpload document
      const fileUpload = await getFileUploadByIdService(uploadedFileId);
      if (!fileUpload) {
        response.status(404).json({ message: 'File upload not found', resourceData: [] });
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
          .json({ message: 'File upload could not be updated', resourceData: [] });
        return;
      }

      response
        .status(201)
        .json({ message: 'New expense claim created', resourceData: [newExpenseClaim] });
    } else {
      response
        .status(400)
        .json({ message: 'New expense claim could not be created', resourceData: [] });
    }
  }
);

// @desc   Get all expense claims
// @route  GET /expense-claim
// @access Private/Admin/Manager
const getQueriedExpenseClaimsHandler = expressAsyncHandler(
  async (
    request: GetQueriedExpenseClaimsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalExpenseClaimsService({
        filter: filter as FilterQuery<ExpenseClaimDocument> | undefined,
      });
    }

    // get all expense claims
    const expenseClaims = await getQueriedExpenseClaimsService({
      filter: filter as FilterQuery<ExpenseClaimDocument> | undefined,
      projection: projection as QueryOptions<ExpenseClaimDocument>,
      options: options as QueryOptions<ExpenseClaimDocument>,
    });
    if (expenseClaims.length === 0) {
      response.status(404).json({
        message: 'No expense claims that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully fetched expense claims',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: expenseClaims,
      });
    }
  }
);

// @desc   Get expense claims by user
// @route  GET /expense-claim/user
// @access Private
const getQueriedExpenseClaimsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedExpenseClaimsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ExpenseClaimDocument>>
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
      totalDocuments = await getQueriedTotalExpenseClaimsService({
        filter: filterWithUserId,
      });
    }

    // get all expense claims for a user
    const expenseClaims = await getQueriedExpenseClaimsByUserService({
      filter: filterWithUserId as FilterQuery<ExpenseClaimDocument> | undefined,
      projection: projection as QueryOptions<ExpenseClaimDocument>,
      options: options as QueryOptions<ExpenseClaimDocument>,
    });
    if (expenseClaims.length === 0) {
      response.status(404).json({
        message: 'No expense claims that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully fetched expense claims',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: expenseClaims,
      });
    }
  }
);

// @desc   Get expense claim by id
// @route  GET /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const getExpenseClaimByIdHandler = expressAsyncHandler(
  async (
    request: GetExpenseClaimByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const expenseClaimId = request.params.expenseClaimId;

    // get expense claim by id
    const expenseClaim = await getExpenseClaimByIdService(expenseClaimId);
    if (expenseClaim) {
      response.status(200).json({
        message: 'Successfully fetched expense claim',
        resourceData: [expenseClaim],
      });
    } else {
      response.status(404).json({ message: 'Expense claim not found', resourceData: [] });
    }
  }
);

// @desc   Delete all expense claims
// @route  DELETE /expense-claim
// @access Private/Admin/Manager
const deleteAllExpenseClaimsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllExpenseClaimsRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    // delete all file uploads with associated resource 'Expense Claim'
    const deleteFileUploadsResult: DeleteResult =
      await deleteAllFileUploadsByAssociatedResourceService('expense claim');
    if (deleteFileUploadsResult.deletedCount === 0) {
      response.status(400).json({
        message:
          'All file uploads associated with all expense claims could not be deleted. Expense Claims not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete all expense claims
    const deleteExpenseClaimsResult: DeleteResult = await deleteAllExpenseClaimsService();

    if (deleteExpenseClaimsResult.deletedCount > 0) {
      response.status(200).json({ message: 'All expense claims deleted', resourceData: [] });
    } else {
      response
        .status(400)
        .json({ message: 'All expense claims could not be deleted', resourceData: [] });
    }
  }
);

// @desc   Delete expense claim by id
// @route  DELETE /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const deleteAnExpenseClaimHandler = expressAsyncHandler(
  async (
    request: DeleteAnExpenseClaimRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const { uploadedFileId } = request.body;
    const expenseClaimId = request.params.expenseClaimId;

    // delete associated file upload with this expense claim
    const deleteFileUploadResult: DeleteResult = await deleteFileUploadByIdService(uploadedFileId);
    if (deleteFileUploadResult.deletedCount === 0) {
      response.status(400).json({
        message:
          'File upload associated with this expense claim could not be deleted. Expense Claim not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete expense claim by id
    const deleteExpenseClaimResult: DeleteResult = await deleteAnExpenseClaimService(
      expenseClaimId
    );

    if (deleteExpenseClaimResult.deletedCount > 0) {
      response.status(200).json({ message: 'Expense claim deleted', resourceData: [] });
    } else {
      response.status(400).json({
        message: 'Expense claim could not be deleted. Please try again.',
        resourceData: [],
      });
    }
  }
);

export {
  createNewExpenseClaimHandler,
  getQueriedExpenseClaimsHandler,
  getQueriedExpenseClaimsByUserHandler,
  getExpenseClaimByIdHandler,
  deleteAllExpenseClaimsHandler,
  deleteAnExpenseClaimHandler,
};
