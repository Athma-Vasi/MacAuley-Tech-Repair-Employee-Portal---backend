import type {
    CreateNewResourceRequest,
    DBRecord,
    GetQueriedResourceRequest,
    GetResourceByIdRequest,
    HttpResult,
    HttpServerResponse,
    UpdateResourceByIdRequest,
} from "../types";
import type { Model } from "mongoose";
import {
    createNewResourceService,
    deleteManyResourcesService,
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

function createNewResourceHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: CreateNewResourceRequest,
        response: Response<HttpResult>,
    ) => {
        try {
            const { accessToken, schema } = request.body;

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
                    createHttpResultError({ accessToken, status: 400 }),
                );
                return;
            }

            response
                .status(201)
                .json(
                    createHttpResultSuccess({ accessToken }),
                );
        } catch (error: unknown) {
            await createNewErrorLogService(
                createErrorLogSchema(
                    error,
                    request.body,
                ),
            );

            response.status(200).json(createHttpResultError({
                accessToken: request.body.accessToken ?? "",
            }));
        }
    };
}

function getQueriedResourcesHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: GetQueriedResourceRequest,
        response: HttpServerResponse,
    ) => {
        try {
            let { newQueryFlag, totalDocuments, accessToken } = request.body;

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
                    await createNewErrorLogService(
                        createErrorLogSchema(
                            totalResult.val,
                            request.body,
                        ),
                    );

                    response
                        .status(200)
                        .json(
                            createHttpResultError({ accessToken, status: 400 }),
                        );
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
                await createNewErrorLogService(
                    createErrorLogSchema(
                        getResourcesResult.val,
                        request.body,
                    ),
                );

                response
                    .status(200)
                    .json(createHttpResultError({ accessToken, status: 400 }));
                return;
            }

            response.status(200).json(
                createHttpResultSuccess({
                    accessToken,
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
                    error,
                    request.body,
                ),
            );

            response.status(200).json(
                createHttpResultError({
                    accessToken: request.body.accessToken ?? "",
                }),
            );
        }
    };
}

function getQueriedResourcesByUserHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: GetQueriedResourceRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const {
                accessToken,
                newQueryFlag,
                userInfo: { userId },
            } = request.body;
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
                    await createNewErrorLogService(
                        createErrorLogSchema(
                            totalResult.val,
                            request.body,
                        ),
                    );

                    response.status(200).json(
                        createHttpResultError({ accessToken, status: 400 }),
                    );
                    return;
                }

                totalDocuments = totalResult.safeUnwrap().data ?? 0;
            }

            const getResourcesResult = await getQueriedResourcesByUserService({
                filter,
                model,
                options,
                projection,
            });

            if (getResourcesResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(
                        getResourcesResult.val,
                        request.body,
                    ),
                );

                response.status(200).json(
                    createHttpResultError({ accessToken, status: 400 }),
                );
                return;
            }

            response.status(200).json(
                createHttpResultSuccess({
                    accessToken,
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
                    error,
                    request.body,
                ),
            );

            response.status(200).json(createHttpResultError({
                accessToken: request.body.accessToken ?? "",
            }));
        }
    };
}

function updateResourceByIdHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: UpdateResourceByIdRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const { resourceId } = request.params;
            const {
                accessToken,
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
                    createHttpResultError({ accessToken, status: 400 }),
                );
                return;
            }

            response
                .status(200)
                .json(
                    createHttpResultSuccess({
                        accessToken,
                        data: [updateResourceResult.safeUnwrap()],
                    }),
                );
        } catch (error: unknown) {
            await createNewErrorLogService(
                createErrorLogSchema(
                    error,
                    request.body,
                ),
            );

            response.status(200).json(createHttpResultError({
                accessToken: request.body.accessToken ?? "",
            }));
        }
    };
}

function getResourceByIdHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: GetResourceByIdRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const { accessToken } = request.body;
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
                    createHttpResultError({ accessToken, status: 404 }),
                );
                return;
            }

            response
                .status(200)
                .json(
                    createHttpResultSuccess({
                        accessToken,
                        data: [getResourceResult.safeUnwrap()],
                    }),
                );
        } catch (error: unknown) {
            await createNewErrorLogService(
                createErrorLogSchema(
                    error,
                    request.body,
                ),
            );

            response.status(200).json(createHttpResultError({
                accessToken: request.body.accessToken ?? "",
            }));
        }
    };
}

function deleteResourceByIdHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: GetResourceByIdRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const { accessToken } = request.body;
            const { resourceId } = request.params;

            const deletedResult = await deleteResourceByIdService(
                resourceId,
                model,
            );

            if (deletedResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(
                        deletedResult.val,
                        request.body,
                    ),
                );

                response.status(200).json(
                    createHttpResultError({ accessToken, status: 404 }),
                );
                return;
            }

            response.status(200).json(createHttpResultSuccess({ accessToken }));
        } catch (error: unknown) {
            await createNewErrorLogService(
                createErrorLogSchema(
                    error,
                    request.body,
                ),
            );

            response.status(200).json(createHttpResultError({
                accessToken: request.body.accessToken ?? "",
            }));
        }
    };
}

function deleteManyResourcesHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: GetQueriedResourceRequest,
        response: HttpServerResponse,
    ) => {
        try {
            const { accessToken } = request.body;
            const deletedResult = await deleteManyResourcesService({ model });

            if (deletedResult.err) {
                await createNewErrorLogService(
                    createErrorLogSchema(
                        deletedResult.val,
                        request.body,
                    ),
                );

                response.status(200).json(
                    createHttpResultError({ accessToken }),
                );
                return;
            }

            response.status(200).json(createHttpResultSuccess({ accessToken }));
        } catch (error: unknown) {
            await createNewErrorLogService(
                createErrorLogSchema(
                    error,
                    request.body,
                ),
            );

            response.status(200).json(createHttpResultError({
                accessToken: request.body.accessToken ?? "",
            }));
        }
    };
}

export {
    createNewResourceHandler,
    deleteManyResourcesHandler,
    deleteResourceByIdHandler,
    getQueriedResourcesByUserHandler,
    getQueriedResourcesHandler,
    getResourceByIdHandler,
    updateResourceByIdHandler,
};
