import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { Country, PostalCode, Province, StatesUS, UserRoles } from '../../../user';
import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';
import { RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewAddressChangeRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    newAddress: {
      addressLine: string;
      city: string;
      province: Province;
      state: StatesUS;
      postalCode: PostalCode;
      country: Country;
    };
    acknowledgement: boolean;
    requestStatus: RequestStatus;
  };
}

interface DeleteAnAddressChangeRequest extends RequestAfterJWTVerification {
  params: {
    addressChangeId: string;
  };
}

type DeleteAllAddressChangesRequest = RequestAfterJWTVerification;

type GetAddressChangesByUserRequest = RequestAfterJWTVerification;

interface GetAddressChangeByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    addressChangeId: string;
  };
}

type AddressChangeServerResponse = {
  message: string;
  addressChangeData: Array<Omit<AddressChangeDocument, '__v'>>;
};

type QueriedAddressChangesServerResponse = {
  message: string;
  pages: number;
  totalDocuments: number;
  addressChangesData: Array<Partial<AddressChangeDocument>>;
};

export type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  GetAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  QueriedAddressChangesServerResponse,
  AddressChangeServerResponse,
};
