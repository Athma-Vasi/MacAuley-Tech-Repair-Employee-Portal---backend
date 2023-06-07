import { FlattenMaps, Schema, Types } from 'mongoose';

import { NoteModel, NoteSchema, NoteDocument, UserModel, UserSchema } from '../models';
import { th } from 'date-fns/locale';

type Note = {
  user: Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
};

type CheckNoteExistsServiceInput = {
  id?: Types.ObjectId;
  title?: string;
};

async function checkNoteExistsService({
  id,
  title,
}: CheckNoteExistsServiceInput): Promise<boolean> {
  try {
    // lean is used to return a plain javascript object instead of a mongoose document
    // exec is used when passing an argument and returning a promise and also provides better error handling

    if (id) {
      const note = await NoteModel.findOne({ id }).lean().exec();
      return note ? true : false;
    }

    if (title) {
      const note = await NoteModel.findOne({ title }).lean().exec();
      return note ? true : false;
    }

    return false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkNoteExistsService' });
  }
}

type CreateNewNoteServiceInput = {
  user: Types.ObjectId;
  title: string;
  text: string;
};

async function createNewNoteService({ user, title, text }: CreateNewNoteServiceInput) {
  try {
    const newNoteObject = {
      user,
      title,
      text,
    };

    const newNote = await NoteModel.create(newNoteObject);
    return newNote;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewNoteService' });
  }
}

async function deleteNoteService(id: Types.ObjectId) {
  try {
    const result = await NoteModel.deleteOne(id);
    return result;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteNoteService' });
  }
}

async function getAllNotesService(): Promise<
  (FlattenMaps<NoteSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    const allNotes = await NoteModel.find({}).lean();
    return allNotes;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllNotesService' });
  }
}

type UpdateNoteServiceInput = {
  id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
};

async function updateNoteService({
  id,
  user,
  title,
  text,
  completed,
}: UpdateNoteServiceInput): Promise<
  | (FlattenMaps<NoteSchema> & {
      _id: Types.ObjectId;
    })
  | null
> {
  try {
    const updatedNote = await NoteModel.findOneAndUpdate(
      { id },
      { user, title, text, completed },
      { new: true }
    )
      .lean()
      .exec();
    return updatedNote;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateNoteService' });
  }
}

export {
  createNewNoteService,
  checkNoteExistsService,
  deleteNoteService,
  getAllNotesService,
  updateNoteService,
};
