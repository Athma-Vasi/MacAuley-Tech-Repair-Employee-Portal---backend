import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type {
  Country,
  PhoneNumber,
  PostalCode,
  Province,
  StatesUS,
  UserRoles,
} from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewAddressChangeRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    addressChange: {
      contactNumber: PhoneNumber;
      addressLine: string;
      city: string;
      province?: Province;
      state?: StatesUS;
      postalCode: PostalCode;
      country: Country;

      acknowledgement: boolean;
    };
  };
}

interface DeleteAnAddressChangeRequest extends RequestAfterJWTVerification {
  params: {
    addressChangeId: string;
  };
}

type DeleteAllAddressChangesRequest = RequestAfterJWTVerification;

type GetQueriedAddressChangesByUserRequest = GetQueriedResourceRequest;

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

interface UpdateAddressChangeStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    addressChange: {
      requestStatus: RequestStatus;
    };
  };
  params: {
    addressChangeId: string;
  };
}

type GetQueriedAddressChangesRequest = GetQueriedResourceRequest;

export type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  GetQueriedAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  GetQueriedAddressChangesRequest,
  UpdateAddressChangeStatusByIdRequest,
};
