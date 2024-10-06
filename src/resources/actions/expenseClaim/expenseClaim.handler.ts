import type { Response } from "express";
import type { FileUploadDocument } from "../../fileUpload";

import { Model } from "mongoose";
import { Err } from "ts-results";
import {
  createNewResourceService,
  deleteResourceByIdService,
  getQueriedResourcesService,
  getQueriedTotalResourcesService,
  getResourceByIdService,
  updateResourceByIdService,
} from "../../../services";
import {
  CreateNewResourceRequest,
  DBRecord,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
  GetResourceByIdRequest,
  HttpResult,
} from "../../../types";
import {
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
  removeUndefinedAndNullValues,
} from "../../../utils";
import { ErrorLogModel } from "../../errorLog";
import { FileUploadModel } from "../../fileUpload";
import { ExpenseClaimDocument } from "./expenseClaim.model";

// @desc   Create a new expense claim after associated file uploads have been uploaded
// @route  POST api/v1/company/expense-claim
// @access Private
function createNewExpenseClaimHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: CreateNewResourceRequest<Doc>,
    response: Response<HttpResult>,
  ) => {
    try {
      const { accessToken, schema } = request.body;

      const createResourceResult = await createNewResourceService(
        schema,
        model,
      );

      if (createResourceResult.err) {
        await createNewResourceService(
          createErrorLogSchema(
            createResourceResult.val,
            request.body,
          ),
          ErrorLogModel,
        );

        response.status(200).json(createHttpResultError({}));
        return;
      }

      const newExpenseClaim = createResourceResult.safeUnwrap()
        .data as ExpenseClaimDocument | undefined;

      if (newExpenseClaim === undefined) {
        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      // for each fileUploadId, grab the corresponding fileUpload document
      // and insert expenseClaim document id into fileUpload document

      const insertIdToDocumentResults = await Promise.all(
        newExpenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUploadResult = await getResourceByIdService(
            uploadedFileId.toString(),
            FileUploadModel,
          );

          if (fileUploadResult.err) {
            await createNewResourceService(
              createErrorLogSchema(
                fileUploadResult.val,
                request.body,
              ),
              ErrorLogModel,
            );

            return new Err(createHttpResultError({}));
          }

          const fileUpload = fileUploadResult.safeUnwrap()
            .data as FileUploadDocument | undefined;

          if (fileUpload === undefined) {
            return new Err(createHttpResultError({}));
          }

          // insert expenseClaim document id into fileUpload document to
          // query for all fileUploads associated with an expenseClaim

          const updatedFileUploadResult = await updateResourceByIdService({
            resourceId: fileUpload._id.toString(),
            fields: {
              associatedDocumentId: newExpenseClaim._id,
              associatedResource: "Expense Claim",
            },
            model: FileUploadModel,
            updateOperator: "$set",
          });

          if (updatedFileUploadResult.err) {
            await createNewResourceService(
              createErrorLogSchema(
                updatedFileUploadResult.val,
                request.body,
              ),
              ErrorLogModel,
            );

            return new Err(createHttpResultError({}));
          }

          return updatedFileUploadResult;
        }),
      );

      if (insertIdToDocumentResults.some((result) => result.err)) {
        response.status(200).json(createHttpResultError({}));
        return;
      }

      response
        .status(200)
        .json(createHttpResultSuccess({ accessToken }));
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Get all expense claims
// @route  GET api/v1/company/expense-claim
// @access Private/Admin/Manager
function getQueriedExpenseClaimsHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetQueriedResourceRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      let { accessToken, newQueryFlag, totalDocuments } = request.body;

      const {
        filter,
        projection,
        options,
      } = request.query;

      // only perform a countDocuments scan if a new query is being made
      if (newQueryFlag) {
        const totalResult = await getQueriedTotalResourcesService({
          filter,
          model,
        });

        if (totalResult.err) {
          await createNewResourceService(
            createErrorLogSchema(totalResult.val, request.body),
            ErrorLogModel,
          );

          response
            .status(200)
            .json(createHttpResultError({}));
          return;
        }

        totalDocuments = totalResult.safeUnwrap().data ?? 0;
      }

      const getResourcesResult = await getQueriedResourcesService({
        filter,
        model,
        options,
        projection,
      });

      if (getResourcesResult.err) {
        await createNewResourceService(
          createErrorLogSchema(getResourcesResult.val, request.body),
          ErrorLogModel,
        );

        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const serviceResult = getResourcesResult.safeUnwrap();

      if (serviceResult.kind === "notFound") {
        response
          .status(200)
          .json(createHttpResultSuccess({ accessToken }));
        return;
      }

      const resources = serviceResult.data as ExpenseClaimDocument[];

      const fileUploadsResultsArrays = await Promise.all(
        resources.map(async (resource) => {
          const fileUploadsResults = await Promise.all(
            resource.uploadedFilesIds.map(async (uploadedFileId) => {
              const fileUploadResult = await getResourceByIdService(
                uploadedFileId.toString(),
                FileUploadModel,
              );

              if (fileUploadResult.err) {
                await createNewResourceService(
                  createErrorLogSchema(fileUploadResult.val, request.body),
                  ErrorLogModel,
                );

                return new Err(createHttpResultError({}));
              }

              return fileUploadResult;
            }),
          );

          return fileUploadsResults;
        }),
      );

      if (
        fileUploadsResultsArrays.some((results) =>
          results.some((result) => result.err)
        )
      ) {
        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const resourceServerResponseArray = resources.map(
        (resource, index) => {
          const fileUploadsResults = fileUploadsResultsArrays[index];
          const fileUploads = fileUploadsResults
            .map((fileUploadResult) =>
              fileUploadResult.err ? void 0 : fileUploadResult.safeUnwrap().data
            )
            .filter((fileUpload) => removeUndefinedAndNullValues(fileUpload));

          return {
            ...resource,
            fileUploads,
          };
        },
      );

      response
        .status(200)
        .json(
          createHttpResultSuccess({
            accessToken,
            data: resourceServerResponseArray,
            pages: Math.ceil(totalDocuments / Number(options?.limit ?? 10)),

            totalDocuments,
          }),
        );
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(
        createHttpResultError({}),
      );
    }
  };
}

// @desc   Get expense claims by user
// @route  GET api/v1/company/expense-claim/user
// @access Private
function getQueriedExpenseClaimsByUserHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetQueriedResourceByUserRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      const { accessToken, newQueryFlag, userInfo: { userId } } = request.body;
      let { totalDocuments } = request.body;

      const { filter, projection, options } = request.query;

      const filterWithUserId = { ...filter, userId };

      // only perform a countDocuments scan if a new query is being made
      if (newQueryFlag) {
        const totalResult = await getQueriedTotalResourcesService({
          filter: filterWithUserId,
          model,
        });

        if (totalResult.err) {
          await createNewResourceService(
            createErrorLogSchema(totalResult.val, request.body),
            ErrorLogModel,
          );

          response
            .status(200)
            .json(createHttpResultError({}));
          return;
        }

        totalDocuments = totalResult.safeUnwrap().data ?? 0;
      }

      const getResourcesResult = await getQueriedResourcesService({
        filter: filterWithUserId,
        model,
        options,
        projection,
      });

      if (getResourcesResult.err) {
        await createNewResourceService(
          createErrorLogSchema(getResourcesResult.val, request.body),
          ErrorLogModel,
        );

        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const serviceResult = getResourcesResult.safeUnwrap();

      if (serviceResult.kind === "notFound") {
        response
          .status(200)
          .json(createHttpResultSuccess({ accessToken }));
        return;
      }

      const resources = serviceResult.data as ExpenseClaimDocument[];

      const fileUploadsResultsArrays = await Promise.all(
        resources.map(async (resource) => {
          const fileUploadsResults = await Promise.all(
            resource.uploadedFilesIds.map(async (uploadedFileId) => {
              const fileUploadResult = await getResourceByIdService(
                uploadedFileId.toString(),
                FileUploadModel,
              );

              if (fileUploadResult.err) {
                await createNewResourceService(
                  createErrorLogSchema(fileUploadResult.val, request.body),
                  ErrorLogModel,
                );

                return new Err(createHttpResultError({}));
              }

              return fileUploadResult;
            }),
          );

          return fileUploadsResults;
        }),
      );

      if (
        fileUploadsResultsArrays.some((results) =>
          results.some((result) => result.err)
        )
      ) {
        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const resourceServerResponseArray = resources.map(
        (resource, index) => {
          const fileUploadsResults = fileUploadsResultsArrays[index];
          const fileUploads = fileUploadsResults
            .map((fileUploadResult) =>
              fileUploadResult.err ? void 0 : fileUploadResult.safeUnwrap().data
            )
            .filter((fileUpload) => removeUndefinedAndNullValues(fileUpload));

          return {
            ...resource,
            fileUploads,
          };
        },
      );

      response
        .status(200)
        .json(
          createHttpResultSuccess({
            accessToken,
            data: resourceServerResponseArray,
            pages: Math.ceil(totalDocuments / Number(options?.limit ?? 10)),

            totalDocuments,
          }),
        );
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Get expense claim by id
// @route  GET api/v1/company/expense-claim/:resourceId
// @access Private/Admin/Manager
function getExpenseClaimByIdHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetResourceByIdRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      const { accessToken } = request.body;
      const { resourceId } = request.params;

      const getResourceResult = await getResourceByIdService(
        resourceId,
        model,
      );

      if (getResourceResult.err) {
        await createNewResourceService(
          createErrorLogSchema(getResourceResult.val, request.body),
          ErrorLogModel,
        );

        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const serviceResult = getResourceResult.safeUnwrap();

      if (serviceResult.kind === "notFound") {
        response
          .status(200)
          .json(createHttpResultSuccess({ accessToken }));
        return;
      }

      const resource = serviceResult.data as ExpenseClaimDocument;

      const fileUploadsResults = await Promise.all(
        resource.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUploadResult = await getResourceByIdService(
            uploadedFileId.toString(),
            FileUploadModel,
          );

          if (fileUploadResult.err) {
            await createNewResourceService(
              createErrorLogSchema(fileUploadResult.val, request.body),
              ErrorLogModel,
            );

            return new Err(createHttpResultError({}));
          }

          return fileUploadResult;
        }),
      );

      if (fileUploadsResults.some((result) => result.err)) {
        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const fileUploads = fileUploadsResults
        .map((fileUploadResult) =>
          fileUploadResult.err ? void 0 : fileUploadResult.safeUnwrap().data
        )
        .filter((fileUpload) => removeUndefinedAndNullValues(fileUpload));

      const resourceServerResponse = {
        ...resource,
        fileUploads,
      };

      response
        .status(200)
        .json(
          createHttpResultSuccess({
            accessToken,
            data: [resourceServerResponse],
          }),
        );
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Delete expense claim by id
// @route  DELETE api/v1/company/expense-claim/:resourceId
// @access Private/Admin/Manager
function deleteExpenseClaimByIdHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetResourceByIdRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      const { accessToken } = request.body;
      const { resourceId } = request.params;

      const getResourceResult = await getResourceByIdService(
        resourceId,
        model,
      );

      if (getResourceResult.err) {
        await createNewResourceService(
          createErrorLogSchema(getResourceResult.val, request.body),
          ErrorLogModel,
        );

        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const serviceResult = getResourceResult.safeUnwrap();

      if (serviceResult.kind === "notFound") {
        response
          .status(200)
          .json(createHttpResultSuccess({ accessToken }));
        return;
      }

      const resource = serviceResult.data as ExpenseClaimDocument;

      const uploadedFilesIds = [...resource.uploadedFilesIds];

      const deleteFileUploadsResults = await Promise.all(
        uploadedFilesIds.map(async (uploadedFileId) =>
          await deleteResourceByIdService(
            uploadedFileId.toString(),
            FileUploadModel,
          )
        ),
      );

      if (deleteFileUploadsResults.some((result) => result.err)) {
        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      const deleteResourceResult = await deleteResourceByIdService(
        resourceId,
        model,
      );

      if (deleteResourceResult.err) {
        await createNewResourceService(
          createErrorLogSchema(deleteResourceResult.val, request.body),
          ErrorLogModel,
        );

        response
          .status(200)
          .json(createHttpResultError({}));
        return;
      }

      response
        .status(200)
        .json(createHttpResultSuccess({ accessToken }));
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

export {
  createNewExpenseClaimHandler,
  deleteExpenseClaimByIdHandler,
  getExpenseClaimByIdHandler,
  getQueriedExpenseClaimsByUserHandler,
  getQueriedExpenseClaimsHandler,
};
