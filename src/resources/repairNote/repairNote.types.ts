import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import { UserRoles } from '../user';
import { RepairNoteSchema } from './repairNote.model';
import { GetQueriedResourceRequest } from '../../types';

interface CreateNewRepairNoteRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    repairNote: Omit<RepairNoteSchema, 'workOrderId'>;
  };
}

interface DeleteARepairNoteRequest extends RequestAfterJWTVerification {
  params: {
    repairNoteId: string;
  };
}

type DeleteAllRepairNotesRequest = RequestAfterJWTVerification;

type GetQueriedRepairNotesByUserRequest = GetQueriedResourceRequest;

type GetQueriedRepairNotesRequest = GetQueriedResourceRequest;

interface GetRepairNoteByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { repairNoteId: string };
}

interface UpdateRepairNoteByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    repairNoteFields: Partial<RepairNoteSchema>;
  };
}

export type {
  CreateNewRepairNoteRequest,
  DeleteARepairNoteRequest,
  DeleteAllRepairNotesRequest,
  GetQueriedRepairNotesByUserRequest,
  GetRepairNoteByIdRequest,
  GetQueriedRepairNotesRequest,
  UpdateRepairNoteByIdRequest,
};
