import type { FlattenMaps, Types } from 'mongoose';
import type { NoteSchema } from './note.model';

import { NoteModel } from './note.model';

type CheckNoteExistsServiceInput = {
  noteId?: string;
  title?: string;
};

async function checkNoteExistsService({
  noteId,
  title,
}: CheckNoteExistsServiceInput): Promise<boolean> {
  try {
    // lean is used to return a plain javascript object instead of a mongoose document
    // exec is used when passing an argument and returning a promise and also provides better error handling

    if (noteId) {
      const note = await NoteModel.findById(noteId).lean().exec();
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
  userId: Types.ObjectId;
  title: string;
  text: string;
};

async function createNewNoteService({ userId, title, text }: CreateNewNoteServiceInput) {
  try {
    const newNoteObject = {
      userId,
      title,
      text,
      completed: false,
    };

    const newNote = await NoteModel.create(newNoteObject);

    return newNote;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewNoteService' });
  }
}

async function deleteNoteService(id: string): Promise<
  | (FlattenMaps<NoteSchema> & {
      _id: Types.ObjectId;
    })
  | null
> {
  try {
    const result = await NoteModel.findByIdAndDelete(id).lean().exec();
    return result;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteNoteService' });
  }
}

async function getNotesByUserService(user: string): Promise<
  (FlattenMaps<NoteSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    const notes = await NoteModel.find({ user }).lean().exec();
    return notes;
  } catch (error: any) {
    throw new Error(error, { cause: 'getNotesByUserService' });
  }
}

async function getAllNotesService(): Promise<
  (FlattenMaps<NoteSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    const allNotes = await NoteModel.find({}).lean().exec();
    return allNotes;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllNotesService' });
  }
}

type UpdateNoteServiceInput = {
  noteId: string;
  userId: Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
};

async function updateNoteService({
  noteId,
  userId,
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
    const noteFieldsToUpdateObj = {
      noteId,
      userId,
      title,
      text,
      completed,
    };

    const updatedNote = await NoteModel.findByIdAndUpdate(noteId, noteFieldsToUpdateObj, {
      new: true,
    })
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
  getNotesByUserService,
  updateNoteService,
};
