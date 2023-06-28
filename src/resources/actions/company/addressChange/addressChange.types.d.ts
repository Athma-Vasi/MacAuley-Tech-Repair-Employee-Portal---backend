import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { Country, PostalCode, UserRoles } from '../../../user';
import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';

interface CreateNewAddressChangeRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    newAddress: {
      addressLine1: string;
      city: string;
      province: string;
      state: string;
      postalCode: PostalCode;
      country: Country;
    };
    acknowledgement: boolean;
  };
}

interface DeleteAnAddressChangeRequest extends RequestAfterJWTVerification {
  params: {
    addressChangeId: Types.ObjectId;
  };
}

type DeleteAllAddressChangesRequest = RequestAfterJWTVerification;

type GetAllAddressChangesRequest = RequestAfterJWTVerification;

type GetAddressChangesByUserRequest = RequestAfterJWTVerification;

interface GetAnAddressChangeRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    addressChangeId: Types.ObjectId;
  };
}

type AddressChangeServerResponse = {
  message: string;
  addressChangeData: Array<AddressChangeDocument>;
};

export type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  GetAllAddressChangesRequest,
  GetAddressChangesByUserRequest,
  GetAnAddressChangeRequest,
  AddressChangeServerResponse,
};
