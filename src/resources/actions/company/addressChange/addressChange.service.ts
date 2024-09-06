import type { Types } from "mongoose";

import type {
  AddressChangeDocument,
  AddressChangeSchema,
} from "./addressChange.model";

import { AddressChangeModel } from "./addressChange.model";
import {
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";

import {
  createHttpResultError,
  createHttpResultSuccess,
} from "../../../../utils";
import { Err, Ok } from "ts-results";

async function getAddressChangeByIdService(
  resourceId: Types.ObjectId | string,
) {
  try {
    const resource = await AddressChangeModel.findById(resourceId)
      .lean()
      .exec();
    if (resource === null || resource === undefined) {
      return new Ok(
        createHttpResultSuccess({ message: "Resource not found" }),
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

async function createNewAddressChangeService(
  schema: AddressChangeSchema,
) {
  try {
    const resource = await AddressChangeModel.create(schema);
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

async function getQueriedAddressChangesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AddressChangeDocument>) {
  try {
    const resources = await AddressChangeModel.find(
      filter,
      projection,
      options,
    )
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

async function getQueriedTotalAddressChangesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AddressChangeDocument>) {
  try {
    const totalQueriedResources = await AddressChangeModel.countDocuments(
      filter,
    )
      .lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: [totalQueriedResources] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting total resources",
      }),
    );
  }
}

async function getQueriedAddressChangesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AddressChangeDocument>) {
  try {
    const resources = await AddressChangeModel.find(
      filter,
      projection,
      options,
    )
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

async function updateAddressChangeByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<AddressChangeDocument>) {
  try {
    const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
    const updateObject = JSON.parse(updateString);
    const resource = await AddressChangeModel.findByIdAndUpdate(
      _id,
      updateObject,
      {
        new: true,
      },
    )
      .lean()
      .exec();

    if (resource === null || resource === undefined) {
      return new Ok(
        createHttpResultSuccess({ message: "Resource not found" }),
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

async function deleteAddressChangeByIdService(
  resourceId: Types.ObjectId | string,
) {
  try {
    const { acknowledged, deletedCount } = await AddressChangeModel.deleteOne({
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

async function deleteAllAddressChangesService() {
  try {
    const totalResources = await AddressChangeModel.countDocuments({});
    const { acknowledged, deletedCount } = await AddressChangeModel.deleteMany(
      {},
    ).lean()
      .exec();

    return acknowledged && deletedCount === totalResources
      ? new Ok(createHttpResultSuccess({}))
      : new Ok(
        createHttpResultError({
          message: "Unable to delete all resources",
        }),
      );
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error deleting all resources",
      }),
    );
  }
}

export {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  updateAddressChangeByIdService,
};
