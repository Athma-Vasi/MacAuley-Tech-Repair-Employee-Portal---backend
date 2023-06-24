import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from './auth';

interface CreateNewNoteRequest extends RequestAfterJWTVerification {
  body: {
    user: Types.ObjectId;
    title: string;
    text: string;
  };
}

interface DeleteNoteRequest extends RequestAfterJWTVerification {
  body: {
    id: Types.ObjectId;
  };
}

// converted to type alias instead of interface because an interface declaring no members is equivalent to its supertype and rome doesn't like that
type GetAllNotesRequest = RequestAfterJWTVerification;

interface GetNotesFromUserIdRequest extends RequestAfterJWTVerification {
  params: {
    userId: Types.ObjectId;
  };
}
interface UpdateNoteRequest extends RequestAfterJWTVerification {
  body: {
    id: Types.ObjectId;
    user: Types.ObjectId;
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
