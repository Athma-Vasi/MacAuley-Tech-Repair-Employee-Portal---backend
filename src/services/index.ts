import type { FilterQuery, Model, QueryOptions } from "mongoose";
import { Err, ErrImpl, Ok, OkImpl } from "ts-results";
import { createHttpResultError, createHttpResultSuccess } from "../utils";
import type {
    ArrayOperators,
    DatabaseResponseResult,
    FieldOperators,
    HttpResult,
    QueryObjectParsedWithDefaults,
} from "../types";

async function getResourceByIdService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    resourceId: string,
    model: Model<Doc>,
) {
    try {
        const resource = await model.findById(resourceId)
            .lean()
            .exec();
        if (resource === null || resource === undefined) {
            return new Ok(
                createHttpResultError({ message: "Resource not found" }),
            );
        }

        return new Ok(createHttpResultSuccess({ data: [resource] }));
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error getting resource by id",
            }),
        );
    }
}

async function getResourceByFieldService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>({
    filter,
    model,
}: {
    filter: Record<string, unknown>;
    model: Model<Doc>;
}) {
    try {
        const resource = await model.findOne({ filter })
            .lean()
            .exec();
        if (resource === null || resource === undefined) {
            return new Ok(
                createHttpResultError({ status: 404 }),
            );
        }

        return new Ok(createHttpResultSuccess({ data: [resource] }));
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error getting resource by field",
            }),
        );
    }
}

async function createNewResourceService<
    Schema extends Record<string, unknown> = Record<string, unknown>,
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(schema: Schema, model: Model<Doc>) {
    try {
        const resource = await model.create(schema);
        return new Ok(createHttpResultSuccess({ data: [resource] }));
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error creating new resource",
            }),
        );
    }
}

async function createAndNotReturnResourceService<
    Schema extends Record<string, unknown> = Record<string, unknown>,
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(schema: Schema, model: Model<Doc>) {
    try {
        await model.create(schema);
        return new Ok(createHttpResultSuccess({ data: [true] }));
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error creating new resource",
            }),
        );
    }
}

async function getQueriedResourcesService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>({
    filter = {},
    model,
    options = {},
    projection = null,
}: QueryObjectParsedWithDefaults & {
    model: Model<Doc>;
}): DatabaseResponseResult<Doc> {
    try {
        const resources = await model.find(filter, projection, options)
            .lean()
            .exec();
        return new Ok(createHttpResultSuccess({ data: resources }));
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error getting queried resources",
            }),
        );
    }
}

async function getQueriedTotalResourcesService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    filter: Record<string, unknown>,
    model: Model<Doc>,
): Promise<
    | OkImpl<HttpResult<number>>
    | ErrImpl<HttpResult<unknown>>
> {
    try {
        const totalQueriedResources = await model.countDocuments(filter)
            .lean()
            .exec();
        return new Ok(
            createHttpResultSuccess({ data: [totalQueriedResources] }),
        );
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error getting total resources",
            }),
        );
    }
}

async function getQueriedResourcesByUserService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>({
    filter = {},
    model,
    options = {},
    projection = null,
}: QueryObjectParsedWithDefaults & {
    model: Model<Doc>;
}): DatabaseResponseResult<Doc> {
    try {
        const resources = await model.find(filter, projection, options)
            .lean()
            .exec();
        return new Ok(createHttpResultSuccess({ data: resources }));
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error getting resources by user",
            }),
        );
    }
}

async function updateResourceByIdService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>({
    resourceId,
    fields,
    updateOperator,
    model,
}: {
    resourceId: string;
    fields: Record<string, unknown>;
    model: Model<Doc>;
    updateOperator: FieldOperators | ArrayOperators;
}) {
    try {
        const updateString = `{ "${updateOperator}":  ${
            JSON.stringify(fields)
        } }`;
        const updateObject = JSON.parse(updateString);

        const resource = await model.findByIdAndUpdate(
            resourceId,
            updateObject,
            { new: true },
        )
            .lean()
            .exec();

        if (resource === null || resource === undefined) {
            return new Ok(
                createHttpResultError({
                    message: "Unable to update resource",
                }),
            );
        }

        return new Ok(createHttpResultSuccess({ data: [resource] }));
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error updating resource by id",
            }),
        );
    }
}

async function deleteResourceByIdService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(resourceId: string, model: Model<Doc>): DatabaseResponseResult {
    try {
        const { acknowledged, deletedCount } = await model.deleteOne({
            _id: resourceId,
        })
            .lean()
            .exec();

        return acknowledged && deletedCount === 1
            ? new Ok(createHttpResultSuccess({}))
            : new Ok(
                createHttpResultError({
                    message: "Unable to delete resource",
                }),
            );
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error deleting resource by id",
            }),
        );
    }
}

async function deleteManyResourcesService<
    Doc extends Record<string, unknown> = Record<string, unknown>,
>(
    { filter, model, options }: {
        filter?: FilterQuery<Doc>;
        options?: QueryOptions<Doc>;
        model: Model<Doc>;
    },
): DatabaseResponseResult {
    try {
        const totalResources = await model.countDocuments(filter, options);
        const { acknowledged, deletedCount } = await model.deleteMany(
            filter,
            options,
        )
            .lean()
            .exec();

        return acknowledged && deletedCount === totalResources
            ? new Ok(createHttpResultSuccess({}))
            : new Ok(
                createHttpResultError({
                    message: "Unable to delete some resources",
                }),
            );
    } catch (error: unknown) {
        return new Err(
            createHttpResultError({
                data: [error],
                message: "Error deleting resources",
            }),
        );
    }
}

export {
    createAndNotReturnResourceService,
    createNewResourceService,
    deleteManyResourcesService,
    deleteResourceByIdService,
    getQueriedResourcesByUserService,
    getQueriedResourcesService,
    getQueriedTotalResourcesService,
    getResourceByFieldService,
    getResourceByIdService,
    updateResourceByIdService,
};
