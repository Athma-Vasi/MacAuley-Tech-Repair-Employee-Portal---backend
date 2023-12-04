import expressAsyncHandler from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { Response } from "express";
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

// @desc   Create a new expense claim
// @route  POST api/v1/actions/company/expense-claim
// @access Private
const createNewExpenseClaimHandler = expressAsyncHandler(
  async (
    request: CreateNewExpenseClaimRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      expenseClaimFields,
    } = request.body;

    // create new expenseClaim object
    const expenseClaimSchema: ExpenseClaimSchema = {
      ...expenseClaimFields,
      userId,
      username,
    };

    // create new expenseClaim
    const newExpenseClaim = await createNewExpenseClaimService(expenseClaimSchema);

    if (newExpenseClaim) {
      // for each fileUploadId, grab the corresponding fileUpload document and insert expenseClaim document id into fileUpload document
      await Promise.all(
        newExpenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);
          if (!fileUpload) {
            response
              .status(404)
              .json({ message: "File upload not found", resourceData: [] });
            return;
          }

          // insert expenseClaim document id into fileUpload document
          // so that we can query for all fileUploads associated with an expenseClaim
          const fileUploadToUpdateObject = {
            ...fileUpload,
            associatedDocumentId: newExpenseClaim._id,
            associatedResource: "expense claim" as AssociatedResourceKind,
          };

          // put the updated fileUpload document into the database
          const updatedFileUpload = await insertAssociatedResourceDocumentIdService(
            fileUploadToUpdateObject
          );
          if (!updatedFileUpload) {
            response
              .status(400)
              .json({ message: "File upload could not be updated", resourceData: [] });
            return;
          }

          return updatedFileUpload;
        })
      );

      response
        .status(201)
        .json({ message: "New expense claim created", resourceData: [newExpenseClaim] });
    } else {
      response
        .status(400)
        .json({ message: "New expense claim could not be created", resourceData: [] });
    }
  }
);

// @desc   Get all expense claims
// @route  GET api/v1/actions/company/expense-claim
// @access Private/Admin/Manager
const getQueriedExpenseClaimsHandler = expressAsyncHandler(
  async (
    request: GetQueriedExpenseClaimsRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<ExpenseClaimServerResponseDocument>
    >
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

    // get all expense claims
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

            return fileUpload;
          }
        );

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
const getQueriedExpenseClaimsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedExpenseClaimsByUserRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<ExpenseClaimServerResponseDocument>
    >
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

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

            return fileUpload as FileUploadDocument;
          }
        );

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
const getExpenseClaimByIdHandler = expressAsyncHandler(
  async (
    request: GetExpenseClaimByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimServerResponseDocument>>
  ) => {
    const expenseClaimId = request.params.expenseClaimId;

    // get expense claim by id
    const expenseClaim = await getExpenseClaimByIdService(expenseClaimId);
    if (!expenseClaim) {
      response.status(404).json({ message: "Expense claim not found", resourceData: [] });
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
      fileUploads: fileUploadsArr.filter(
        (fileUpload) => fileUpload
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
const updateExpenseClaimByIdHandler = expressAsyncHandler(
  async (
    request: UpdateExpenseClaimByIdRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const { expenseClaimId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update expense claim
    const updatedExpenseClaim = await updateExpenseClaimByIdService({
      _id: expenseClaimId,
      fields,
      updateOperator,
    });

    if (!updatedExpenseClaim) {
      response.status(400).json({
        message: "Expense claim update failed. Please try again!",
        resourceData: [],
      });
      return;
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
const deleteAllExpenseClaimsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllExpenseClaimsRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    // grab all expense claims file upload ids
    const fileUploadsIds = await returnAllExpenseClaimsUploadedFileIdsService();

    // delete all file uploads associated with all expense claims
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      fileUploadsIds.map(async (fileUploadId: Types.ObjectId | string) =>
        deleteFileUploadByIdService(fileUploadId)
      )
    );
    if (!deleteFileUploadsResult.every((result) => result.deletedCount !== 0)) {
      response.status(400).json({
        message: "Some file uploads could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    // delete all expense claims
    const deleteExpenseClaimsResult: DeleteResult = await deleteAllExpenseClaimsService();

    if (deleteExpenseClaimsResult.deletedCount > 0) {
      response
        .status(200)
        .json({ message: "All expense claims deleted", resourceData: [] });
    } else {
      response
        .status(400)
        .json({ message: "All expense claims could not be deleted", resourceData: [] });
    }
  }
);

// @desc   Delete expense claim by id
// @route  DELETE api/v1/actions/company/expense-claim/:expenseClaimId
// @access Private/Admin/Manager
const deleteExpenseClaimHandler = expressAsyncHandler(
  async (
    request: DeleteExpenseClaimRequest,
    response: Response<ResourceRequestServerResponse<ExpenseClaimDocument>>
  ) => {
    const expenseClaimId = request.params.expenseClaimId;

    // check if expense claim exists
    const expenseClaimExists = await getExpenseClaimByIdService(expenseClaimId);
    if (!expenseClaimExists) {
      response
        .status(404)
        .json({ message: "Expense claim does not exist", resourceData: [] });
      return;
    }

    // DO NOT DELETE: TURN THIS BACK ON AFTER TESTING
    // find all file uploads associated with this expense claim
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...expenseClaimExists.uploadedFilesIds];

    // delete all file uploads associated with this expense claim
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) =>
        deleteFileUploadByIdService(uploadedFileId)
      )
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          "Some file uploads associated with this expense claim could not be deleted. Expense Claim not deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    // delete expense claim by id
    const deleteExpenseClaimResult: DeleteResult = await deleteExpenseClaimByIdService(
      expenseClaimId
    );

    if (deleteExpenseClaimResult.deletedCount === 1) {
      response.status(200).json({ message: "Expense claim deleted", resourceData: [] });
    } else {
      response.status(400).json({
        message: "Expense claim could not be deleted. Please try again.",
        resourceData: [],
      });
    }
  }
);

// DEV ROUTE
// @desc   Create new expense claims in bulk
// @route  POST api/v1/actions/company/expense-claim/dev
// @access Private
const createNewExpenseClaimsBulkHandler = expressAsyncHandler(
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

    // filter out any null documents
    const filteredExpenseClaimDocuments = expenseClaimDocuments.filter(
      (expenseClaimDocument) => expenseClaimDocument
    );

    // check if any documents were created
    if (filteredExpenseClaimDocuments.length === 0) {
      response.status(400).json({
        message: "Expense claims creation failed",
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
const updateExpenseClaimsBulkHandler = expressAsyncHandler(
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

    // filter out any expense claims that were not created
    const successfullyCreatedExpenseClaims = updatedExpenseClaims.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedExpenseClaims.length === 0) {
      response.status(400).json({
        message: "Could not create any Expense Claims",
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
  createNewExpenseClaimsBulkHandler,
  createNewExpenseClaimHandler,
  deleteAllExpenseClaimsHandler,
  deleteExpenseClaimHandler,
  getExpenseClaimByIdHandler,
  getQueriedExpenseClaimsByUserHandler,
  getQueriedExpenseClaimsHandler,
  updateExpenseClaimByIdHandler,
  updateExpenseClaimsBulkHandler,
};
