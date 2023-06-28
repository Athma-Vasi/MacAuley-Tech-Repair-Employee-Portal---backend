import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';
import type { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

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
  contactNumber: string;
  newAddress: {
    addressLine1: string;
    city: string;
    province: string;
    state: string;
    postalCode: string;
    country: string;
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

export { getAddressChangeByIdService, createNewAddressChangeService };
