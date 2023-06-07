import { Request } from 'express';
import { Types } from 'mongoose';

interface CreateNewNoteRequest extends Request {
  body: {
    user: Types.ObjectId;
    title: string;
    text: string;
  };
}

interface DeleteNoteRequest extends Request {}

// converted to type alias instead of interface because an interface declaring no members is equivalent to its supertype and rome doesn't like that
type GetAllNotesRequest = Request;

interface UpdateNoteRequest extends Request {}

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
