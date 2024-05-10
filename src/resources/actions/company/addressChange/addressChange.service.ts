import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { AddressChangeDocument, AddressChangeSchema } from "./addressChange.model";

import { AddressChangeModel } from "./addressChange.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";
import createHttpError from "http-errors";

async function getAddressChangeByIdService(
  addressChangeId: Types.ObjectId | string
): DatabaseResponseNullable<AddressChangeDocument> {
  try {
    const addressChange = await AddressChangeModel.findById(addressChangeId)
      .lean()
      .exec();
    return addressChange;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getAddressChangeByIdService");
  }
}

async function createNewAddressChangeService(
  addressChangeSchema: AddressChangeSchema
): Promise<AddressChangeDocument> {
  try {
    const addressChange = await AddressChangeModel.create(addressChangeSchema);
    return addressChange;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in createNewAddressChangeService"
    );
  }
}

async function getQueriedAddressChangesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AddressChangeDocument>): DatabaseResponse<AddressChangeDocument> {
  try {
    const addressChange = await AddressChangeModel.find(filter, projection, options)
      .lean()
      .exec();
    return addressChange;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in getQueriedAddressChangesService"
    );
  }
}

async function getQueriedTotalAddressChangesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AddressChangeDocument>): Promise<number> {
  try {
    const totalAddressChanges = await AddressChangeModel.countDocuments(filter)
      .lean()
      .exec();
    return totalAddressChanges;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in getQueriedTotalAddressChangesService"
    );
  }
}

async function getQueriedAddressChangesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AddressChangeDocument>): DatabaseResponse<AddressChangeDocument> {
  try {
    const addressChanges = await AddressChangeModel.find(filter, projection, options)
      .lean()
      .exec();
    return addressChanges;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in getQueriedAddressChangesByUserService"
    );
  }
}

async function updateAddressChangeByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<AddressChangeDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const addressChange = await AddressChangeModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return addressChange;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in updateAddressChangeByIdService"
    );
  }
}

async function deleteAddressChangeByIdService(
  addressChangeId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await AddressChangeModel.deleteOne({ _id: addressChangeId })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in deleteAddressChangeByIdService"
    );
  }
}

async function deleteAllAddressChangesService(): Promise<DeleteResult> {
  try {
    const deletedResult = await AddressChangeModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in deleteAllAddressChangesService"
    );
  }
}

export {
  getAddressChangeByIdService,
  createNewAddressChangeService,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  getQueriedAddressChangesByUserService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  updateAddressChangeByIdService,
};
