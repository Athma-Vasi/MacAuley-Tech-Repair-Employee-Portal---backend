import { NextFunction, Response } from "express";
import {
    DatabaseResponse,
    GetQueriedResourceRequest,
    HttpResult,
} from "../types";
import { FlattenMaps, Model, Require_id } from "mongoose";
import {
    getQueriedResourcesService,
    getQueriedTotalResourcesService,
} from "../services";
import { createNewErrorLogService } from "../resources/errorLog";
import {
    createErrorLogSchema,
    createHttpResultError,
    createHttpResultSuccess,
} from "../utils";

async function getQueriedResourcesHandler<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    model: Model<Doc>,
) {
    return async (
        request: GetQueriedResourceRequest,
        response: Response<Awaited<HttpResult<Require_id<FlattenMaps<Doc>>>>>,
        next: NextFunction,
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
                    .json(
                        createHttpResultError({
                            message: getResourcesResult.val.message,
                        }),
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
        } catch (error: unknown) {}
    };
}
