import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { DesktopComputerSchema } from './desktopComputer.model';

interface CreateNewDesktopComputerRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    desktopComputerFields: Omit<DesktopComputerSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewDesktopComputerBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    desktopComputerSchemas: DesktopComputerSchema[];
  };
}

interface DeleteADesktopComputerRequest extends RequestAfterJWTVerification {
  params: { desktopComputerId: string };
}

type DeleteAllDesktopComputersRequest = RequestAfterJWTVerification;

type GetQueriedDesktopComputersRequest = GetQueriedResourceRequest;

interface GetDesktopComputerByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { desktopComputerId: string };
}

interface UpdateDesktopComputerByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    desktopComputerFields: Record<
      keyof DesktopComputerSchema,
      DesktopComputerSchema[keyof DesktopComputerSchema]
    >;
  };
  params: { desktopComputerId: string };
}

export type {
  CreateNewDesktopComputerRequest,
  CreateNewDesktopComputerBulkRequest,
  DeleteADesktopComputerRequest,
  DeleteAllDesktopComputersRequest,
  GetDesktopComputerByIdRequest,
  GetQueriedDesktopComputersRequest,
  UpdateDesktopComputerByIdRequest,
};
