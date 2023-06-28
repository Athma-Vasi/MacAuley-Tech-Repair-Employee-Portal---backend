import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';
import type { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';
import type { Countries, PhoneNumber, PostalCodes } from '../../../user';

import { AddressChangeModel } from './addressChange.model';

async function getAddressChangeByIdService(addressChangeId: Types.ObjectId) {
  try {
    const addressChange = await AddressChangeModel.findById(addressChangeId).lean().exec();
    return addressChange;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAddressChangeByIdService' });
  }
}

type CreateNewAddressChangeServiceInput = {
  userId: Types.ObjectId;
  username: string;
  email: string;
  contactNumber: PhoneNumber;
  newAddress: {
    addressLine1: string;
    city: string;
    province: string;
    state: string;
    postalCode: PostalCodes;
    country: Countries;
  };
};

async function createNewAddressChangeService(input: CreateNewAddressChangeServiceInput) {
  try {
    const addressChange = await AddressChangeModel.create(input);
    return addressChange;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewAddressChangeService' });
  }
}

async function getAllAddressChangesService(): Promise<
  (FlattenMaps<AddressChangeDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
  try {
    const addressChanges = await AddressChangeModel.find({}).lean().exec();
    return addressChanges;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllAddressChangesService' });
  }
}

async function getAddressChangesByUserService(userId: Types.ObjectId): Promise<
  (FlattenMaps<AddressChangeDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
  try {
    const addressChanges = await AddressChangeModel.find({ userId }).lean().exec();
    return addressChanges;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAddressChangesByUserService' });
  }
}

async function deleteAddressChangeByIdService(
  addressChangeId: Types.ObjectId
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

export {
  getAddressChangeByIdService,
  createNewAddressChangeService,
  getAllAddressChangesService,
  getAddressChangesByUserService,
  deleteAddressChangeByIdService,
};
