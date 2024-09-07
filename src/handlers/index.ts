import type {
    CreateNewResourceRequest,
    GetQueriedResourceRequest,
    GetResourceByIdRequest,
    HttpResult,
    HttpServerResponse,
    UpdateResourceByIdRequest,
} from "../types";
import type { FlattenMaps, Model, Require_id } from "mongoose";
import {
    createNewResourceService,
    deleteAllResourcesService,
    deleteResourceByIdService,
    getQueriedResourcesByUserService,
    getQueriedResourcesService,
    getQueriedTotalResourcesService,
    getResourceByIdService,
    updateResourceByIdService,
} from "../services";
import { createNewErrorLogService } from "../resources/errorLog";
import {
    createErrorLogSchema,
    createHttpResultError,
    createHttpResultSuccess,
} from "../utils";
import type { Response } from "express";

function createNewResourceHandler<
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

                response.status(200).json(
                    createHttpResultError({ status: 400 }),
                );
                return;
            }

            response
                .status(201)
                .json(
                    createResourceResult.safeUnwrap(),
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

function getQueriedResourcesHandler<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    model: Model<Doc>,
) {
    return async (
        request: GetQueriedResourceRequest,
        response: HttpServerResponse<Doc>,
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

            response.status(200).json(
                createHttpResultSuccess({
                    data: getResourcesResult.safeUnwrap().data,
                    pages: Math.ceil(
                        totalDocuments / Number(options?.limit ?? 10),
                    ),
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

function getQueriedResourcesByUserHandler<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    model: Model<Doc>,
) {
    return async (
        request: GetQueriedResourceRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const {
                userInfo: { userId },
                newQueryFlag,
            } = request.body;
            let { totalDocuments } = request.body;

            const { filter = {}, projection = null, options = {} } =
                request.query;
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

                    response.status(200).json(
                        createHttpResultError({ status: 400 }),
                    );
                    return;
                }

                totalDocuments = totalResult.safeUnwrap().data?.[0] ?? 0;
            }

            const getResourcesResult = await getQueriedResourcesByUserService({
                filter,
                model,
                options,
                projection,
            });

            if (getResourcesResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(getResourcesResult.val, request.body),
                );

                response.status(200).json(
                    createHttpResultError({ status: 400 }),
                );
                return;
            }

            response.status(200).json(
                createHttpResultSuccess({
                    data: getResourcesResult.safeUnwrap().data,
                    pages: Math.ceil(
                        totalDocuments / Number(options?.limit ?? 10),
                    ),
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

function updateResourceByIdHandler<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    model: Model<Doc>,
) {
    return async (
        request: UpdateResourceByIdRequest<Doc>,
        response: HttpServerResponse<Doc>,
    ) => {
        try {
            const { resourceId } = request.params;
            const {
                documentUpdate: { fields, updateOperator },
            } = request.body;

            const updateResourceResult = await updateResourceByIdService({
                fields,
                model,
                resourceId,
                updateOperator,
            });

            if (updateResourceResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(
                        updateResourceResult.val,
                        request.body,
                    ),
                );

                response.status(200).json(
                    createHttpResultError({ status: 400 }),
                );
                return;
            }

            response
                .status(200)
                .json(
                    updateResourceResult.safeUnwrap() as HttpResult<
                        Require_id<FlattenMaps<Doc>>
                    >,
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

function getResourceByIdHandler<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    model: Model<Doc>,
) {
    return async (
        request: GetResourceByIdRequest,
        response: HttpServerResponse<Doc>,
    ) => {
        try {
            const { resourceId } = request.params;

            const getResourceResult = await getResourceByIdService(
                resourceId,
                model,
            );

            if (getResourceResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(
                        getResourceResult.val,
                        request.body,
                    ),
                );

                response.status(200).json(
                    createHttpResultError({ status: 404 }),
                );
                return;
            }

            response
                .status(200)
                .json(
                    getResourceResult.safeUnwrap() as HttpResult<
                        Require_id<FlattenMaps<Doc>>
                    >,
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

function deleteResourceByIdHandler<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    model: Model<Doc>,
) {
    return async (
        request: GetResourceByIdRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const { resourceId } = request.params;

            const deletedResult = await deleteResourceByIdService(
                resourceId,
                model,
            );

            if (deletedResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(deletedResult.val, request.body),
                );

                response.status(200).json(
                    createHttpResultError({ status: 404 }),
                );
                return;
            }

            response.status(200).json(createHttpResultSuccess({}));
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

function deleteAllResourcesHandler<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    model: Model<Doc>,
) {
    return async (
        request: GetQueriedResourceRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const deletedResult = await deleteAllResourcesService(model);

            if (deletedResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(deletedResult.val, request.body),
                );

                response.status(200).json(createHttpResultError({}));
                return;
            }

            response.status(200).json(createHttpResultSuccess({}));
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
    createNewResourceHandler,
    deleteAllResourcesHandler,
    deleteResourceByIdHandler,
    getQueriedResourcesByUserHandler,
    getQueriedResourcesHandler,
    getResourceByIdHandler,
    updateResourceByIdHandler,
};
