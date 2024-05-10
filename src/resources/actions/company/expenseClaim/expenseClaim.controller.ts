import expressAsyncController from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { NextFunction, Response } from "express";
import type { AssociatedResourceKind, FileUploadDocument } from "../../../fileUpload";
import type {
  CreateNewExpenseClaimRequest,
  DeleteAllExpenseClaimsRequest,
  DeleteExpenseClaimRequest,
  GetQueriedExpenseClaimsRequest,
  GetExpenseClaimByIdRequest,
  GetQueriedExpenseClaimsByUserRequest,
  UpdateExpenseClaimByIdRequest,
  CreateNewExpenseClaimsBulkRequest,
  ExpenseClaimServerResponseDocument,
  UpdateExpenseClaimsBulkRequest,
} from "./expenseClaim.types";

import {
  createNewExpenseClaimService,
  deleteAllExpenseClaimsService,
  getQueriedExpenseClaimsService,
  getExpenseClaimByIdService,
  getQueriedExpenseClaimsByUserService,
  getQueriedTotalExpenseClaimsService,
  updateExpenseClaimByIdService,
  deleteExpenseClaimByIdService,
  returnAllExpenseClaimsUploadedFileIdsService,
} from "./expenseClaim.service";
import {
  deleteFileUploadByIdService,
  getFileUploadByIdService,
  insertAssociatedResourceDocumentIdService,
} from "../../../fileUpload";
import {
  ExpenseClaimDocument,
  ExpenseClaimSchema,
  ExpenseClaimServerResponse,
} from "./expenseClaim.model";
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import { FilterQuery, QueryOptions, Types } from "mongoose";
import { getUserByIdService } from "../../../user";
import { removeUndefinedAndNullValues } from "../../../../utils";
import createHttpError from "http-errors";

// @desc   Create a new expense claim
// @route  POST api/v1/actions/company/expense-claim
// @access Private
const createNewExpenseClaimController = expressAsyncController(
  async (
    request: CreateNewExpenseClaimRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId, username },
      expenseClaimSchema,
    } = request.body;

    const newExpenseClaimSchema: ExpenseClaimSchema = {
      ...expenseClaimSchema,
      userId,
      username,
    };

    const newExpenseClaim = await createNewExpenseClaimService(newExpenseClaimSchema);
    if (!newExpenseClaim) {
      return next(
        new createHttpError.InternalServerError("Expense claim could not be created")
      );
    }

    // for each fileUploadId, grab the corresponding fileUpload document and insert expenseClaim document id into fileUpload document
    await Promise.all(
      newExpenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);
        if (!fileUpload) {
          return next(new createHttpError.NotFound("File upload not found"));
        }

        // insert expenseClaim document id into fileUpload document to
        // query for all fileUploads associated with an expenseClaim
        const fileUploadToUpdateObject = {
          ...fileUpload,
          associatedDocumentId: newExpenseClaim._id,
          associatedResource: "expense claim" as AssociatedResourceKind,
        };

        const updatedFileUpload = (await insertAssociatedResourceDocumentIdService(
          fileUploadToUpdateObject
        )) as FileUploadDocument;

        if (!updatedFileUpload) {
          return next(
            new createHttpError.InternalServerError("File upload could not be updated")
          );
        }

        return updatedFileUpload;
      })
    );

    response
      .status(201)
      .json({ message: "New expense claim created", resourceData: [newExpenseClaim] });
  }
);

// @desc   Get all expense claims
// @route  GET api/v1/actions/company/expense-claim
// @access Private/Admin/Manager
const getQueriedExpenseClaimsController = expressAsyncController(
  async (
    request: GetQueriedExpenseClaimsRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<ExpenseClaimServerResponseDocument>
    >,
    next: NextFunction
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalExpenseClaimsService({
        filter: filter as FilterQuery<ExpenseClaimDocument> | undefined,
      });
    }

    const expenseClaims = await getQueriedExpenseClaimsService({
      filter: filter as FilterQuery<ExpenseClaimDocument> | undefined,
      projection: projection as QueryOptions<ExpenseClaimDocument>,
      options: options as QueryOptions<ExpenseClaimDocument>,
    });
    if (expenseClaims.length === 0) {
      response.status(200).json({
        message: "No expense claims that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the expenseClaims (in parallel)
    const fileUploadsArrArr = await Promise.all(
      expenseClaims.map(async (expenseClaim) => {
        const fileUploadPromises = expenseClaim.uploadedFilesIds.map(
          async (uploadedFileId) => {
            const fileUpload = await getFileUploadByIdService(uploadedFileId);
            if (!fileUpload) {
              return next(new createHttpError.NotFound("File upload not found"));
            }

            return fileUpload;
          }
        );

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        return fileUploads.filter((fileUpload) =>
          removeUndefinedAndNullValues(fileUpload)
        );
      })
    );

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
      message: "Successfully retrieved expense claims",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: expenseClaimServerResponseArray as ExpenseClaimServerResponse[],
    });
  }
);

// @desc   Get expense claims by user
// @route  GET api/v1/actions/company/expense-claim/user
// @access Private
const getQueriedExpenseClaimsByUserController = expressAsyncController(
  async (
    request: GetQueriedExpenseClaimsByUserRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<ExpenseClaimServerResponseDocument>
    >,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalExpenseClaimsService({
        filter: filterWithUserId,
      });
    }

    const expenseClaims = await getQueriedExpenseClaimsByUserService({
      filter: filterWithUserId as FilterQuery<ExpenseClaimDocument> | undefined,
      projection: projection as QueryOptions<ExpenseClaimDocument>,
      options: options as QueryOptions<ExpenseClaimDocument>,
    });
    if (expenseClaims.length === 0) {
      response.status(200).json({
        message: "No expense claims that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    const fileUploadsArrArr = await Promise.all(
      expenseClaims.map(async (expenseClaim) => {
        const fileUploadPromises = expenseClaim.uploadedFilesIds.map(
          async (uploadedFileId) => {
            const fileUpload = await getFileUploadByIdService(uploadedFileId);
            if (!fileUpload) {
              return next(new createHttpError.NotFound("File upload not found"));
            }

            return fileUpload as FileUploadDocument;
          }
        );

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        return fileUploads.filter((fileUpload) =>
          removeUndefinedAndNullValues(fileUpload)
        );
      })
    );

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
      message: "Successfully retrieved expense claims",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: expenseClaimServerResponseArray,
    });
  }
);

// @desc   Get expense claim by id
// @route  GET api/v1/actions/company/expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const getExpenseClaimByIdController = expressAsyncController(
  async (
    request: GetExpenseClaimByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimServerResponseDocument>>,
    next: NextFunction
  ) => {
    const expenseClaimId = request.params.expenseClaimId;

    const expenseClaim = await getExpenseClaimByIdService(expenseClaimId);
    if (!expenseClaim) {
      return next(new createHttpError.NotFound("Expense claim not found"));
    }

    const fileUploadsArr = await Promise.all(
      expenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);
        if (!fileUpload) {
          return next(new createHttpError.NotFound("File upload not found"));
        }

        return fileUpload as FileUploadDocument;
      })
    );

    // create expenseClaimServerResponse
    const expenseClaimServerResponse: ExpenseClaimServerResponse = {
      ...expenseClaim,
      fileUploads: fileUploadsArr.filter((fileUpload) =>
        removeUndefinedAndNullValues(fileUpload)
      ) as FileUploadDocument[],
    };

    response.status(200).json({
      message: "Successfully retrieved expense claim",
      resourceData: [expenseClaimServerResponse],
    });
  }
);

// @desc   Update an expense claim by id
// @route  PATCH api/v1/actions/company/expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const updateExpenseClaimByIdController = expressAsyncController(
  async (
    request: UpdateExpenseClaimByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>,
    next: NextFunction
  ) => {
    const { expenseClaimId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User does not exist"));
    }

    const updatedExpenseClaim = await updateExpenseClaimByIdService({
      _id: expenseClaimId,
      fields,
      updateOperator,
    });
    if (!updatedExpenseClaim) {
      return next(new createHttpError.InternalServerError("Expense claim update failed"));
    }

    response.status(200).json({
      message: "Expense claim updated successfully",
      resourceData: [updatedExpenseClaim],
    });
  }
);

// @desc   Delete all expense claims
// @route  DELETE api/v1/actions/company/expense-claim
// @access Private/Admin/Manager
const deleteAllExpenseClaimsController = expressAsyncController(
  async (
    _request: DeleteAllExpenseClaimsRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>,
    next: NextFunction
  ) => {
    const fileUploadsIds = await returnAllExpenseClaimsUploadedFileIdsService();
    if (!fileUploadsIds?.length) {
      return next(new createHttpError.NotFound("No file uploads found"));
    }

    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      fileUploadsIds.map(async (fileUploadId: Types.ObjectId | string) =>
        deleteFileUploadByIdService(fileUploadId)
      )
    );
    if (!deleteFileUploadsResult.every((result) => result.deletedCount !== 0)) {
      return next(
        new createHttpError.InternalServerError(
          "Some file uploads could not be deleted. Please try again."
        )
      );
    }

    const deleteExpenseClaimsResult: DeleteResult = await deleteAllExpenseClaimsService();
    if (!deleteExpenseClaimsResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "All expense claims could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({
      message: "All expense claims deleted",
      resourceData: [],
    });
  }
);

// @desc   Delete expense claim by id
// @route  DELETE api/v1/actions/company/expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const deleteExpenseClaimController = expressAsyncController(
  async (
    request: DeleteExpenseClaimRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>,
    next: NextFunction
  ) => {
    const expenseClaimId = request.params.expenseClaimId;

    const expenseClaimExists = await getExpenseClaimByIdService(expenseClaimId);
    if (!expenseClaimExists) {
      return next(new createHttpError.NotFound("Expense claim not found"));
    }

    // DO NOT DELETE: TURN THIS BACK ON AFTER TESTING
    // ????

    const uploadedFilesIds = [...expenseClaimExists.uploadedFilesIds];

    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) =>
        deleteFileUploadByIdService(uploadedFileId)
      )
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError(
          "Some file uploads associated with this expense claim could not be deleted. Expense Claim not deleted. Please try again."
        )
      );
    }

    const deleteExpenseClaimResult: DeleteResult = await deleteExpenseClaimByIdService(
      expenseClaimId
    );
    if (!deleteExpenseClaimResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "Expense claim could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "Expense claim deleted", resourceData: [] });
  }
);

// DEV ROUTE
// @desc   Create new expense claims in bulk
// @route  POST api/v1/actions/company/expense-claim/dev
// @access Private
const createNewExpenseClaimsBulkController = expressAsyncController(
  async (
    request: CreateNewExpenseClaimsBulkRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const { expenseClaimSchemas } = request.body;

    const expenseClaimDocuments = await Promise.all(
      expenseClaimSchemas.map(async (expenseClaimSchema) => {
        const expenseClaimDocument = await createNewExpenseClaimService(
          expenseClaimSchema
        );
        return expenseClaimDocument;
      })
    );

    const filteredExpenseClaimDocuments = expenseClaimDocuments.filter(
      (expenseClaimDocument) => removeUndefinedAndNullValues(expenseClaimDocument)
    );

    if (filteredExpenseClaimDocuments.length === 0) {
      response.status(500).json({
        message: "Expense claims could not be created",
        resourceData: [],
      });

      return;
    }

    const uncreatedDocumentsAmount =
      expenseClaimSchemas.length - filteredExpenseClaimDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredExpenseClaimDocuments.length
      } Expense Claims.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredExpenseClaimDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update expense claims in bulk
// @route  PATCH api/v1/actions/company/expense-claim/dev
// @access Private
const updateExpenseClaimsBulkController = expressAsyncController(
  async (
    request: UpdateExpenseClaimsBulkRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const { expenseClaimFields } = request.body;

    const updatedExpenseClaims = await Promise.all(
      expenseClaimFields.map(async (expenseClaimField) => {
        const {
          documentUpdate: { fields, updateOperator },
          expenseClaimId,
        } = expenseClaimField;

        const updatedExpenseClaim = await updateExpenseClaimByIdService({
          _id: expenseClaimId,
          fields,
          updateOperator,
        });

        return updatedExpenseClaim;
      })
    );

    const successfullyCreatedExpenseClaims = updatedExpenseClaims.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedExpenseClaims.length === 0) {
      response.status(500).json({
        message: "Expense claims could not be updated",
        resourceData: [],
      });

      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedExpenseClaims.length
      } Expense Claims. ${
        expenseClaimFields.length - successfullyCreatedExpenseClaims.length
      } Expense Claims failed to be created.`,
      resourceData: successfullyCreatedExpenseClaims,
    });
  }
);

export {
  createNewExpenseClaimsBulkController,
  createNewExpenseClaimController,
  deleteAllExpenseClaimsController,
  deleteExpenseClaimController,
  getExpenseClaimByIdController,
  getQueriedExpenseClaimsByUserController,
  getQueriedExpenseClaimsController,
  updateExpenseClaimByIdController,
  updateExpenseClaimsBulkController,
};
