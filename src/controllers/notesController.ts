import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import {
  checkNoteExistsService,
  createNewNoteService,
  deleteNoteService,
  getAllNotesService,
  getUserByIdService,
  updateNoteService,
} from '../services';

import {
  CreateNewNoteRequest,
  DeleteNoteRequest,
  GetAllNotesRequest,
  UpdateNoteRequest,
} from '../types';

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNoteHandler = expressAsyncHandler(
  async (request: CreateNewNoteRequest, response: Response) => {
    const { user, title, text } = request.body;

    // confirm that user, title, and text are not empty
    if (!user || !title || !text) {
      response.status(400).json({ message: 'User, Title, and Text fields are required' });
      return;
    }

    // check if user exists
    const isUser = await getUserByIdService(user);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    // check if note with same title already exists
    const isDuplicateNote = await checkNoteExistsService({ title });
    if (isDuplicateNote) {
      response.status(400).json({ message: 'Note with same title already exists' });
      return;
    }

    // create new note if all checks pass successfully
    const createdNote = await createNewNoteService({ user, title, text });

    if (createdNote) {
      response.status(201).json({ message: `Note ${title} created successfully` });
    } else {
      response.status(400).json({ message: 'Note creation failed' });
    }
  }
);

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNoteHandler = expressAsyncHandler(
  async (request: DeleteNoteRequest, response: Response) => {
    const { id } = request.body;

    // confirm that id is not empty
    if (!id) {
      response.status(400).json({ message: 'Id field is required' });
      return;
    }

    // confirm that note exists
    const isNote = await checkNoteExistsService({ id });
    if (!isNote) {
      response.status(400).json({ message: 'Note does not exist' });
      return;
    }

    // delete note if all checks pass successfully
    const deletedNote = await deleteNoteService(id);
    if (deletedNote) {
      response.status(200).json({ message: `Note ${id} deleted successfully` });
    } else {
      response.status(400).json({ message: 'Note deletion failed' });
    }
  }
);

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotesHandler = expressAsyncHandler(
  async (request: GetAllNotesRequest, response: Response) => {
    const allNotes = await getAllNotesService();

    // if no notes are found, return type is an empty array
    if (allNotes.length === 0) {
      response.status(404).json({ message: 'No notes found' });
      return;
    }

    // add username to each note before sending response
    const allNotesWithUsername = await Promise.all(
      allNotes.map(async (note) => {
        const user = await getUserByIdService(note.user);
        if (!user) {
          return { ...note, username: 'unknown' };
        }

        return { ...note, username: user?.username };
      })
    );

    response.status(200).json(allNotesWithUsername);
  }
);

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNoteHandler = expressAsyncHandler(
  async (request: UpdateNoteRequest, response: Response) => {
    const { id, user, title, text, completed } = request.body;

    // confirm that id, user, title, and text are not empty
    if (!id || !user || !title || !text) {
      response.status(400).json({ message: 'Id, User, Title, and Text fields are required' });
      return;
    }

    // confirm that completed exists and is a boolean
    if (completed === undefined || typeof completed !== 'boolean') {
      response
        .status(400)
        .json({ message: 'Completed field is required and must be of type boolean' });
      return;
    }

    // check if note exists
    const isNote = await checkNoteExistsService({ id });
    if (!isNote) {
      response.status(400).json({ message: 'Note does not exist' });
      return;
    }

    // check if note with same title already exists
    const isDuplicateNote = await checkNoteExistsService({ title });
    if (isDuplicateNote) {
      response.status(400).json({ message: 'Note with same title already exists' });
      return;
    }

    // check if user exists
    const isUser = await getUserByIdService(user);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    // update note if all checks pass successfully
    const updatedNote = await updateNoteService({ id, user, title, text, completed });
    if (updatedNote) {
      response.status(201).json({ message: `Note ${title} updated successfully` });
    } else {
      response.status(400).json({ message: 'Note update failed' });
    }
  }
);

export { createNewNoteHandler, deleteNoteHandler, getAllNotesHandler, updateNoteHandler };
