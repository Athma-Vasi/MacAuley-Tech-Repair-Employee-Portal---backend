import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from './auth';
import { UserRoles } from '../user';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) to the request body
interface CreateNewNoteRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    // below are the fields required to be sent with post request
    // user: Types.ObjectId;
    title: string;
    text: string;
  };
}

interface DeleteNoteRequest extends RequestAfterJWTVerification {
  body: {
    noteId: Types.ObjectId;
  };
}

type GetAllNotesRequest = RequestAfterJWTVerification;

interface GetNotesFromUserIdRequest extends RequestAfterJWTVerification {
  params: {
    userId: Types.ObjectId;
  };
}
interface UpdateNoteRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    // below are the fields required to be sent with post request
    noteId: Types.ObjectId;
    // user: Types.ObjectId;
    title: string;
    text: string;
    completed: boolean;
  };
}

// rome-ignore lint/suspicious/noEmptyInterface: <temporary>
interface GetAllNotesReturn {}

/**
 *
 *
 *
 */

export type {
  // note requests
  CreateNewNoteRequest,
  DeleteNoteRequest,
  GetAllNotesRequest,
  UpdateNoteRequest,
  GetNotesFromUserIdRequest,

  // note return types from service
  GetAllNotesReturn,
};
