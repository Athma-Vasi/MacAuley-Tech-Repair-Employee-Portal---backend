import { Request } from 'express';
import { Types } from 'mongoose';

import { RequestAfterJWTVerification } from './auth';

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

interface UpdateNoteRequest extends RequestAfterJWTVerification {
  body: {
    id: Types.ObjectId;
    user: Types.ObjectId;
    title: string;
    text: string;
    completed: boolean;
  };
}

interface GetAllNotesReturn {}

/**
 *
 *
 *
 */

export {
  // note requests
  CreateNewNoteRequest,
  DeleteNoteRequest,
  GetAllNotesRequest,
  UpdateNoteRequest,

  // note return types from service
  GetAllNotesReturn,
};
