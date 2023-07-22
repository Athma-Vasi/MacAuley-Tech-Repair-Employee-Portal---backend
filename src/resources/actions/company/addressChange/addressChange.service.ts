import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';

import { AddressChangeModel } from './addressChange.model';
import {
  DatabaseResponse,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../../../types';

async function getAddressChangeByIdService(addressChangeId: Types.ObjectId | string) {
  try {
    const addressChange = await AddressChangeModel.findById(addressChangeId).lean().exec();
    return addressChange;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAddressChangeByIdService' });
  }
}

async function createNewAddressChangeService(
  input: AddressChangeSchema
): Promise<AddressChangeDocument> {
  try {
    const addressChange = await AddressChangeModel.create(input);
    return addressChange;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewAddressChangeService' });
  }
}

async function getQueriedAddressChangesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AddressChangeDocument>): DatabaseResponse<AddressChangeDocument> {
  try {
    const addressChange = await AddressChangeModel.find(filter, projection, options).lean().exec();
    return addressChange;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedAddressChangesService' });
  }
}

async function getQueriedTotalAddressChangesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AddressChangeDocument>): Promise<number> {
  try {
    const totalAddressChanges = await AddressChangeModel.countDocuments(filter).lean().exec();
    return totalAddressChanges;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalAddressChangesService' });
  }
}

async function getAddressChangesByUserService(
  userId: Types.ObjectId | string
): DatabaseResponse<AddressChangeDocument> {
  try {
    const addressChanges = await AddressChangeModel.find({ userId }).lean().exec();
    return addressChanges;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAddressChangesByUserService' });
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
    throw new Error(error, { cause: 'deleteAddressChangeByIdService' });
  }
}

async function deleteAllAddressChangesService(): Promise<DeleteResult> {
  try {
    const deletedResult = await AddressChangeModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllAddressChangesService' });
  }
}

export {
  getAddressChangeByIdService,
  createNewAddressChangeService,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  getAddressChangesByUserService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
};
