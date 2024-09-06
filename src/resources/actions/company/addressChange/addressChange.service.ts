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
  addressChangeId: Types.ObjectId | string,
) {
  try {
    const addressChange = await AddressChangeModel.findById(addressChangeId)
      .lean()
      .exec();
    if (addressChange === null || addressChange === undefined) {
      return new Ok(
        createHttpResultSuccess({ message: "Address change not found" }),
      );
    }

    return new Ok(createHttpResultSuccess({ data: [addressChange] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting address change by id",
      }),
    );
  }
}

async function createNewAddressChangeService(
  addressChangeSchema: AddressChangeSchema,
) {
  try {
    const addressChange = await AddressChangeModel.create(addressChangeSchema);
    return new Ok(createHttpResultSuccess({ data: [addressChange] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error creating new address change",
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
    const addressChange = await AddressChangeModel.find(
      filter,
      projection,
      options,
    )
      .lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: addressChange }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting queried address changes",
      }),
    );
  }
}

async function getQueriedTotalAddressChangesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AddressChangeDocument>) {
  try {
    const totalAddressChanges = await AddressChangeModel.countDocuments(filter)
      .lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: [totalAddressChanges] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting total address changes",
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
    const addressChanges = await AddressChangeModel.find(
      filter,
      projection,
      options,
    )
      .lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: addressChanges }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error getting address changes by user",
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
    const addressChange = await AddressChangeModel.findByIdAndUpdate(
      _id,
      updateObject,
      {
        new: true,
      },
    )
      .lean()
      .exec();

    if (addressChange === null || addressChange === undefined) {
      return new Ok(
        createHttpResultSuccess({ message: "Address change not found" }),
      );
    }

    return new Ok(createHttpResultSuccess({ data: [addressChange] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error updating address change by id",
      }),
    );
  }
}

async function deleteAddressChangeByIdService(
  addressChangeId: Types.ObjectId | string,
) {
  try {
    const deletedResult = await AddressChangeModel.deleteOne({
      _id: addressChangeId,
    })
      .lean()
      .exec();

    return new Ok(createHttpResultSuccess({ data: [deletedResult] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error deleting address change by id",
      }),
    );
  }
}

async function deleteAllAddressChangesService() {
  try {
    const deletedResult = await AddressChangeModel.deleteMany({}).lean()
      .exec();
    return new Ok(createHttpResultSuccess({ data: [deletedResult] }));
  } catch (error: unknown) {
    return new Err(
      createHttpResultError({
        data: [error],
        message: "Error deleting all address changes",
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
