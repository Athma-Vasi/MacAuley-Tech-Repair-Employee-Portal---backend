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
  async (request: DeleteNoteRequest, response: Response) => {}
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
  async (request: UpdateNoteRequest, response: Response) => {}
);

export { createNewNoteHandler, deleteNoteHandler, getAllNotesHandler, updateNoteHandler };
