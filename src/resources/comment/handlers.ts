import { NextFunction, Response } from "express";
import { Model } from "mongoose";
import {
    createNewResourceService,
    updateResourceByIdService,
} from "../../services";
import {
    DBRecord,
    DocumentUpdateOperation,
    HttpResult,
    RequestAfterQueryParsing,
} from "../../types";
import {
    createErrorLogSchema,
    createHttpResultError,
    createHttpResultSuccess,
} from "../../utils";
import { ErrorLogModel } from "../errorLog";

function updateCommentHandler<Doc extends DBRecord = DBRecord>(
    model: Model<Doc>,
) {
    return async (
        request: RequestAfterQueryParsing & {
            body: {
                documentUpdates: Array<DocumentUpdateOperation<Doc>>;
            };
            params: {
                resourceId: string;
            };
        },
        response: Response<HttpResult<Doc>>,
        next: NextFunction,
    ) => {
        try {
            const { resourceId } = request.params;
            const { accessToken, documentUpdates } = request.body;

            const documentUpdatePromises = documentUpdates.map(
                async (
                    { fields, updateOperator }: DocumentUpdateOperation<Doc>,
                ) => {
                    const updateResourceResult =
                        await updateResourceByIdService({
                            fields,
                            model,
                            resourceId,
                            updateOperator,
                        });

                    if (updateResourceResult.err) {
                        await createNewResourceService(
                            createErrorLogSchema(
                                updateResourceResult.val,
                                request.body,
                            ),
                            ErrorLogModel,
                        );

                        response.status(200).json(
                            createHttpResultError({ status: 400 }),
                        );

                        return;
                    }

                    const unwrappedResult = updateResourceResult.safeUnwrap();

                    if (unwrappedResult.kind === "notFound") {
                        response.status(200).json(
                            createHttpResultError({ status: 404 }),
                        );

                        return;
                    }

                    const { data } = unwrappedResult;

                    if (data === undefined) {
                        response.status(200).json(
                            createHttpResultError({ status: 500 }),
                        );

                        return;
                    }

                    return data;
                },
            );

            const updatedDocumentsSettledResult = await Promise.allSettled(
                documentUpdatePromises,
            );

            const updatedDocuments = updatedDocumentsSettledResult.map(
                (settledResult) =>
                    settledResult.status === "fulfilled"
                        ? settledResult.value
                        : null,
            );

            if (updatedDocuments.some((document) => document === null)) {
                response.status(200).json(
                    createHttpResultError({ status: 500 }),
                );

                return;
            }

            response.status(200).json(
                createHttpResultSuccess({
                    accessToken,
                    data: updatedDocuments,
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

export { updateCommentHandler };
