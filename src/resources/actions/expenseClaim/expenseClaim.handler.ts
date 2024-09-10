import type { Response } from "express";
import type { FileUploadDocument } from "../../fileUpload";

import { FileUploadModel } from "../../fileUpload";
import { ExpenseClaimDocument } from "./expenseClaim.model";
import {
  CreateNewResourceRequest,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
  GetResourceByIdRequest,
  HttpResult,
} from "../../../types";
import { FlattenMaps, Model, Require_id } from "mongoose";
import {
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
  removeUndefinedAndNullValues,
} from "../../../utils";
import {
  createNewResourceService,
  deleteResourceByIdService,
  getQueriedResourcesService,
  getQueriedTotalResourcesService,
  getResourceByIdService,
  updateResourceByIdService,
} from "../../../services";
import { createNewErrorLogService } from "../../errorLog";
import { Err } from "ts-results";

// @desc   Create a new expense claim after associated file uploads have been uploaded
// @route  POST api/v1/company/expense-claim
// @access Private
function createNewExpenseClaimHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(
  model: Model<Doc>,
) {
  return async (
    request: CreateNewResourceRequest<Doc>,
    response: Response<HttpResult>,
  ) => {
    try {
      const { schema } = request.body;

      const createResourceResult = await createNewResourceService(
        schema,
        model,
      );

      if (createResourceResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(
            createResourceResult.val,
            request.body,
          ),
        );

        response.status(200).json(createHttpResultError({ status: 400 }));
        return;
      }

      const newExpenseClaim = createResourceResult.safeUnwrap()
        .data[0] as unknown as ExpenseClaimDocument;

      // for each fileUploadId, grab the corresponding fileUpload document
      // and insert expenseClaim document id into fileUpload document

      const insertIdToDocumentResults = await Promise.all(
        newExpenseClaim.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUploadResult = await getResourceByIdService(
            uploadedFileId.toString(),
            FileUploadModel,
          );

          if (fileUploadResult.err) {
            await createNewErrorLogService(
              createErrorLogSchema(
                fileUploadResult.val,
                request.body,
              ),
            );

            return new Err(createHttpResultError({}));
          }

          const fileUpload = fileUploadResult.safeUnwrap()
            .data[0] as FileUploadDocument;

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
            await createNewErrorLogService(
              createErrorLogSchema(
                updatedFileUploadResult.val,
                request.body,
              ),
            );

            return new Err(createHttpResultError({}));
          }

          return updatedFileUploadResult;
        }),
      );

      if (insertIdToDocumentResults.some((result) => result.err)) {
        response.status(200).json(createHttpResultError({ status: 400 }));
        return;
      }

      response
        .status(201)
        .json(createResourceResult.safeUnwrap());
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          createHttpResultError({ data: [error] }),
          request.body,
        ),
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Get all expense claims
// @route  GET api/v1/company/expense-claim
// @access Private/Admin/Manager
function getQueriedExpenseClaimsHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetQueriedResourceRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      let { newQueryFlag, totalDocuments } = request.body;

      const {
        filter = {},
        projection = null,
        options = {},
      } = request.query;

      // only perform a countDocuments scan if a new query is being made
      if (newQueryFlag) {
        const totalResult = await getQueriedTotalResourcesService(
          filter,
          model,
        );

        if (totalResult.err) {
          await createNewErrorLogService(
            createErrorLogSchema(totalResult.val, request.body),
          );

          response
            .status(200)
            .json(createHttpResultError({ status: 400 }));
          return;
        }

        totalDocuments = totalResult.safeUnwrap().data?.[0] ?? 0;
      }

      const getResourcesResult = await getQueriedResourcesService({
        filter,
        model,
        options,
        projection,
      });

      if (getResourcesResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(getResourcesResult.val, request.body),
        );

        response
          .status(200)
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const resources = getResourcesResult.safeUnwrap()
        .data as unknown as Require_id<FlattenMaps<ExpenseClaimDocument>>[];

      const fileUploadsResultsArrays = await Promise.all(
        resources.map(async (resource) => {
          const fileUploadsResults = await Promise.all(
            resource.uploadedFilesIds.map(async (uploadedFileId) => {
              const fileUploadResult = await getResourceByIdService(
                uploadedFileId.toString(),
                FileUploadModel,
              );

              if (fileUploadResult.err) {
                await createNewErrorLogService(
                  createErrorLogSchema(fileUploadResult.val, request.body),
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
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const resourceServerResponseArray = resources.map(
        (resource, index) => {
          const fileUploadsResults = fileUploadsResultsArrays[index];
          const fileUploads = fileUploadsResults
            .map((fileUploadResult) =>
              fileUploadResult.err
                ? void 0
                : fileUploadResult.safeUnwrap().data[0]
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
            data: resourceServerResponseArray,
            pages: Math.ceil(totalDocuments / Number(options.limit)),
            totalDocuments,
          }),
        );
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          createHttpResultError({ data: [error] }),
          request.body,
        ),
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Get expense claims by user
// @route  GET api/v1/company/expense-claim/user
// @access Private
function getQueriedExpenseClaimsByUserHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetQueriedResourceByUserRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      const {
        userInfo: { userId },
      } = request.body;
      let { newQueryFlag, totalDocuments } = request.body;

      const { filter, projection, options } = request.query;

      const filterWithUserId = { ...filter, userId };

      // only perform a countDocuments scan if a new query is being made
      if (newQueryFlag) {
        const totalResult = await getQueriedTotalResourcesService(
          filterWithUserId,
          model,
        );

        if (totalResult.err) {
          await createNewErrorLogService(
            createErrorLogSchema(totalResult.val, request.body),
          );

          response
            .status(200)
            .json(createHttpResultError({ status: 400 }));
          return;
        }

        totalDocuments = totalResult.safeUnwrap().data?.[0] ?? 0;
      }

      const getResourcesResult = await getQueriedResourcesService({
        filter: filterWithUserId,
        model,
        options,
        projection,
      });

      if (getResourcesResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(getResourcesResult.val, request.body),
        );

        response
          .status(200)
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const resources = getResourcesResult.safeUnwrap()
        .data as unknown as Require_id<FlattenMaps<ExpenseClaimDocument>>[];

      const fileUploadsResultsArrays = await Promise.all(
        resources.map(async (resource) => {
          const fileUploadsResults = await Promise.all(
            resource.uploadedFilesIds.map(async (uploadedFileId) => {
              const fileUploadResult = await getResourceByIdService(
                uploadedFileId.toString(),
                FileUploadModel,
              );

              if (fileUploadResult.err) {
                await createNewErrorLogService(
                  createErrorLogSchema(fileUploadResult.val, request.body),
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
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const resourceServerResponseArray = resources.map(
        (resource, index) => {
          const fileUploadsResults = fileUploadsResultsArrays[index];
          const fileUploads = fileUploadsResults
            .map((fileUploadResult) =>
              fileUploadResult.err
                ? void 0
                : fileUploadResult.safeUnwrap().data[0]
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
            data: resourceServerResponseArray,
            pages: Math.ceil(totalDocuments / Number(options?.limit ?? 10)),
            totalDocuments,
          }),
        );
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          createHttpResultError({ data: [error] }),
          request.body,
        ),
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Get expense claim by id
// @route  GET api/v1/company/expense-claim/:resourceId
// @access Private/Admin/Manager
function getExpenseClaimByIdHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetResourceByIdRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      const { resourceId } = request.params;

      const getResourceResult = await getResourceByIdService(
        resourceId,
        model,
      );

      if (getResourceResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(getResourceResult.val, request.body),
        );

        response
          .status(200)
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const resource = getResourceResult.safeUnwrap()
        .data[0] as unknown as ExpenseClaimDocument;

      const fileUploadsResults = await Promise.all(
        resource.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUploadResult = await getResourceByIdService(
            uploadedFileId.toString(),
            FileUploadModel,
          );

          if (fileUploadResult.err) {
            await createNewErrorLogService(
              createErrorLogSchema(fileUploadResult.val, request.body),
            );

            return new Err(createHttpResultError({}));
          }

          return fileUploadResult;
        }),
      );

      if (fileUploadsResults.some((result) => result.err)) {
        response
          .status(200)
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const fileUploads = fileUploadsResults
        .map((fileUploadResult) =>
          fileUploadResult.err ? void 0 : fileUploadResult.safeUnwrap().data[0]
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
            data: [resourceServerResponse],
          }),
        );
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          createHttpResultError({ data: [error] }),
          request.body,
        ),
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Delete expense claim by id
// @route  DELETE api/v1/company/expense-claim/:resourceId
// @access Private/Admin/Manager
function deleteExpenseClaimByIdHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(
  model: Model<Doc>,
) {
  return async (
    request: GetResourceByIdRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      const { resourceId } = request.params;

      const getResourceResult = await getResourceByIdService(
        resourceId,
        model,
      );

      if (getResourceResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(getResourceResult.val, request.body),
        );

        response
          .status(200)
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const resource = getResourceResult.safeUnwrap()
        .data[0] as unknown as ExpenseClaimDocument;

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
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      const deleteResourceResult = await deleteResourceByIdService(
        resourceId,
        model,
      );

      if (deleteResourceResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(deleteResourceResult.val, request.body),
        );

        response
          .status(200)
          .json(createHttpResultError({ status: 400 }));
        return;
      }

      response
        .status(200)
        .json(createHttpResultSuccess({}));
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          createHttpResultError({ data: [error] }),
          request.body,
        ),
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
