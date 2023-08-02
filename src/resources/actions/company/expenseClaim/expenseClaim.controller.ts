import expressAsyncHandler from 'express-async-handler';
import type { DeleteResult } from 'mongodb';

import type { Response } from 'express';
import type { AssociatedResourceKind, FileUploadDocument } from '../../../fileUpload';
import type {
  CreateNewExpenseClaimRequest,
  DeleteAllExpenseClaimsRequest,
  DeleteAnExpenseClaimRequest,
  GetQueriedExpenseClaimsRequest,
  GetExpenseClaimByIdRequest,
  GetQueriedExpenseClaimsByUserRequest,
  UpdateExpenseClaimStatusByIdRequest,
  UpdateExpenseClaimByIdRequest,
} from './expenseClaim.types';

import {
  createNewExpenseClaimService,
  deleteAllExpenseClaimsService,
  deleteAnExpenseClaimService,
  getQueriedExpenseClaimsService,
  getExpenseClaimByIdService,
  getQueriedExpenseClaimsByUserService,
  getQueriedTotalExpenseClaimsService,
  updateExpenseClaimByIdService,
} from './expenseClaim.service';
import {
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
  insertAssociatedResourceDocumentIdService,
} from '../../../fileUpload';
import {
  ExpenseClaimDocument,
  ExpenseClaimSchema,
  ExpenseClaimServerResponse,
} from './expenseClaim.model';
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
        uploadedFilesIds,
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
      response.status(400).json({ message: 'Acknowledgement is required', resourceData: [] });
      return;
    }

    // create new expenseClaim object
    const newExpenseClaimObject: ExpenseClaimSchema = {
      userId,
      username,
      action: 'company',
      category: 'expense claim',
      uploadedFilesIds,
      expenseClaimKind,
      expenseClaimAmount,
      expenseClaimCurrency,
      expenseClaimDate,
      expenseClaimDescription,
      additionalComments,
      acknowledgement,
      requestStatus: 'pending',
    };

    // user must acknowledge that expenseClaim info is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', resourceData: [] });
      return;
    }

    // create new expenseClaim
    const newExpenseClaim = await createNewExpenseClaimService(newExpenseClaimObject);

    if (newExpenseClaim) {
      // for each fileUploadId, grab the corresponding fileUpload document and insert expenseClaim document id into fileUpload document
      await Promise.all(
        uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);
          if (!fileUpload) {
            response.status(404).json({ message: 'File upload not found', resourceData: [] });
            return;
          }

          // insert expenseClaim document id into fileUpload document
          // so that we can query for all fileUploads associated with an expenseClaim
          const fileUploadToUpdateObject = {
            ...fileUpload,
            associatedDocumentId: newExpenseClaim._id,
            associatedResource: 'expense claim' as AssociatedResourceKind,
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

          return updatedFileUpload;
        })
      );

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
    response: Response<GetQueriedResourceRequestServerResponse<ExpenseClaimServerResponse>>
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
      return;
    }

    // find all fileUploads associated with the expenseClaims (in parallel)
    const fileUploadsArrArr = await Promise.all(
      expenseClaims.map(async (expenseClaim) => {
        const fileUploadPromises = expenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create expenseClaimServerResponse array
    const expenseClaimServerResponseArray = expenseClaims
      .map((expenseClaim, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...expenseClaim,
          fileUploads,
        };
      })
      .filter((expenseClaim) => expenseClaim);

    response.status(200).json({
      message: 'Successfully retrieved expense claims',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: expenseClaimServerResponseArray as ExpenseClaimServerResponse[],
    });
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
      return;
    }

    // find all fileUploads associated with the expenseClaims (in parallel)
    const fileUploadsArrArr = await Promise.all(
      expenseClaims.map(async (expenseClaim) => {
        const fileUploadPromises = expenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload as FileUploadDocument;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create expenseClaimServerResponse array
    const expenseClaimServerResponseArray = expenseClaims
      .map((expenseClaim, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...expenseClaim,
          fileUploads,
        };
      })
      .filter((expenseClaim) => expenseClaim);

    response.status(200).json({
      message: 'Successfully retrieved expense claims',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: expenseClaimServerResponseArray,
    });
  }
);

// @desc   Get expense claim by id
// @route  GET /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const getExpenseClaimByIdHandler = expressAsyncHandler(
  async (
    request: GetExpenseClaimByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimServerResponse>>
  ) => {
    const expenseClaimId = request.params.expenseClaimId;

    // get expense claim by id
    const expenseClaim = await getExpenseClaimByIdService(expenseClaimId);
    if (!expenseClaim) {
      response.status(404).json({ message: 'Expense claim not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the expenseClaim
    const fileUploadsArr = await Promise.all(
      expenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create expenseClaimServerResponse
    const expenseClaimServerResponse: ExpenseClaimServerResponse = {
      ...expenseClaim,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved expense claim',
      resourceData: [expenseClaimServerResponse],
    });
  }
);

// @desc   Update an expense claim status by id
// @route  PATCH /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const updateExpenseClaimStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateExpenseClaimStatusByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const { expenseClaimId } = request.params;
    const {
      expenseClaim: { requestStatus },
    } = request.body;

    // check if expense claim exists
    const expenseClaimExists = await getExpenseClaimByIdService(expenseClaimId);
    if (!expenseClaimExists) {
      response.status(404).json({ message: 'Expense claim does not exist', resourceData: [] });
      return;
    }

    // update expense claim
    const updatedExpenseClaim = await updateExpenseClaimByIdService({
      expenseClaimId,
      fieldsToUpdate: { requestStatus },
    });
    if (updatedExpenseClaim) {
      response.status(200).json({
        message: 'Expense claim updated successfully',
        resourceData: [updatedExpenseClaim],
      });
    } else {
      response.status(400).json({
        message: 'Expense claim could not be updated',
        resourceData: [],
      });
    }
  }
);

// @desc   Update an expense claim by id
// @route  PUT /expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const updateExpenseClaimByIdHandler = expressAsyncHandler(
  async (
    request: UpdateExpenseClaimByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const { expenseClaimId } = request.params;
    const { expenseClaim } = request.body;

    // check if expense claim exists
    const expenseClaimExists = await getExpenseClaimByIdService(expenseClaimId);
    if (!expenseClaimExists) {
      response.status(404).json({ message: 'Expense claim does not exist', resourceData: [] });
      return;
    }

    // update expense claim
    const updatedExpenseClaim = await updateExpenseClaimByIdService({
      expenseClaimId,
      fieldsToUpdate: expenseClaim,
    });

    if (updatedExpenseClaim) {
      response.status(200).json({
        message: 'Expense claim updated successfully',
        resourceData: [updatedExpenseClaim],
      });
    } else {
      response.status(400).json({
        message: 'Expense claim could not be updated',
        resourceData: [],
      });
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
    const { uploadedFilesIds } = request.body;
    const expenseClaimId = request.params.expenseClaimId;

    // // delete associated file upload with this expense claim
    // const deleteFileUploadResult: DeleteResult = await deleteFileUploadByIdService(uploadedFileId);
    // if (deleteFileUploadResult.deletedCount === 0) {
    //   response.status(400).json({
    //     message:
    //       'File upload associated with this expense claim could not be deleted. Expense Claim not deleted. Please try again.',
    //     resourceData: [],
    //   });
    //   return;
    // }

    // // delete expense claim by id
    // const deleteExpenseClaimResult: DeleteResult = await deleteAnExpenseClaimService(
    //   expenseClaimId
    // );

    // if (deleteExpenseClaimResult.deletedCount > 0) {
    //   response.status(200).json({ message: 'Expense claim deleted', resourceData: [] });
    // } else {
    //   response.status(400).json({
    //     message: 'Expense claim could not be deleted. Please try again.',
    //     resourceData: [],
    //   });
    // }

    // delete all file uploads associated with this expense claim
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map((uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'File uploads associated with this expense claim could not be deleted. Expense Claim not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete expense claim by id
    const deleteExpenseClaimResult: DeleteResult = await deleteAnExpenseClaimService(
      expenseClaimId
    );

    if (deleteExpenseClaimResult.deletedCount === 1) {
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
  updateExpenseClaimStatusByIdHandler,
  updateExpenseClaimByIdHandler,
};
