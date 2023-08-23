import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewRepairNoteRequest,
  DeleteARepairNoteRequest,
  DeleteAllRepairNotesRequest,
  GetQueriedRepairNotesByUserRequest,
  GetQueriedRepairNotesRequest,
  GetRepairNoteByIdRequest,
  UpdateRepairNoteByIdRequest,
} from './repairNote.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../types';
import type {
  RepairNoteDocument,
  RepairNoteInitialSchema,
  RepairNoteSchema,
} from './repairNote.model';

import {
  createNewRepairNoteService,
  deleteRepairNoteByIdService,
  deleteAllRepairNotesService,
  getQueriedRepairNotesService,
  getRepairNoteByIdService,
  getQueriedRepairNotesByUserService,
  getQueriedTotalRepairNotesService,
  updateRepairNoteByIdService,
} from './repairNote.service';
import mongoose from 'mongoose';

// @desc   Create a new repair note
// @route  POST /repair-note
// @access Private
const createNewRepairNoteHandler = expressAsyncHandler(
  async (
    request: CreateNewRepairNoteRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      repairNote,
    } = request.body;

    // create new repair note object
    const newRepairNoteObject: RepairNoteSchema = {
      ...repairNote,
      userId,
      username,
      workOrderId: new mongoose.Types.ObjectId(),
    };

    // create new repair note
    const newRepairNote = await createNewRepairNoteService(newRepairNoteObject);
    if (!newRepairNote) {
      response.status(400).json({
        message: 'New repair note could not be created. Please try again!',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: 'New repair note created successfully',
      resourceData: [newRepairNote],
    });
  }
);

// @desc    Get all repair notes
// @route   GET /repair-note
// @access  Private
const getQueriedRepairNotesHandler = expressAsyncHandler(
  async (
    request: GetQueriedRepairNotesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRepairNotesService({
        filter: filter as FilterQuery<RepairNoteDocument> | undefined,
      });
    }

    // get all repair notes
    const repairNotes = await getQueriedRepairNotesService({
      filter: filter as FilterQuery<RepairNoteDocument> | undefined,
      projection: projection as QueryOptions<RepairNoteDocument>,
      options: options as QueryOptions<RepairNoteDocument>,
    });
    if (!repairNotes.length) {
      response.status(200).json({
        message: 'No repair notes that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found repair notes',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairNotes,
    });
  }
);

// @desc    Get all repair notes by user
// @route   GET /repair-note/user
// @access  Private
const getQueriedRepairNotesByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedRepairNotesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRepairNotesService({
        filter: filterWithUserId as FilterQuery<RepairNoteDocument> | undefined,
      });
    }

    // get all repair notes
    const repairNotes = await getQueriedRepairNotesByUserService({
      filter: filterWithUserId as FilterQuery<RepairNoteDocument> | undefined,
      projection: projection as QueryOptions<RepairNoteDocument>,
      options: options as QueryOptions<RepairNoteDocument>,
    });
    if (!repairNotes.length) {
      response.status(200).json({
        message: 'No repair notes that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found repair notes',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairNotes,
    });
  }
);

// @desc    Get a repair note by id
// @route   GET /repair-note/:repairNoteId
// @access  Private
const getRepairNoteByIdHandler = expressAsyncHandler(
  async (
    request: GetRepairNoteByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const { repairNoteId } = request.params;

    // get repair note by id
    const repairNote = await getRepairNoteByIdService(repairNoteId);
    if (!repairNote) {
      response.status(200).json({
        message: 'Repair note not found',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found repair note',
      resourceData: [repairNote],
    });
  }
);

// @desc    Delete a repair note by id
// @route   DELETE /repair-note/:repairNoteId
// @access  Private
const deleteRepairNoteByIdHandler = expressAsyncHandler(
  async (
    request: DeleteARepairNoteRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const { repairNoteId } = request.params;

    // delete repair note by id
    const deleteResult = await deleteRepairNoteByIdService(repairNoteId);
    if (!deleteResult) {
      response.status(400).json({
        message: 'Unable to delete repair note. Please try again!',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully deleted repair note',
      resourceData: [],
    });
  }
);

// @desc    Delete all repair notes
// @route   DELETE /repair-note
// @access  Private
const deleteAllRepairNotesHandler = expressAsyncHandler(
  async (
    _request: DeleteAllRepairNotesRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    // delete all repair notes
    const deleteResult = await deleteAllRepairNotesService();
    if (deleteResult.deletedCount) {
      response.status(200).json({
        message: 'Successfully deleted all repair notes',
        resourceData: [],
      });
      return;
    }

    response.status(400).json({
      message: 'All repair notes could not be deleted. Please try again!',
      resourceData: [],
    });
  }
);

// @desc    Update a repair note by id
// @route   PUT /repair-note/:repairNoteId
// @access  Private
const updateRepairNoteByIdHandler = expressAsyncHandler(
  async (
    request: UpdateRepairNoteByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const { repairNoteId } = request.params;
    const { repairNoteFields } = request.body;

    // update repair note by id
    const updatedRepairNote = await updateRepairNoteByIdService(repairNoteId, repairNoteFields);
    if (!updatedRepairNote) {
      response.status(400).json({
        message: 'Unable to update repair note. Please try again!',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully updated repair note',
      resourceData: [updatedRepairNote],
    });
  }
);

export {
  createNewRepairNoteHandler,
  getQueriedRepairNotesHandler,
  getQueriedRepairNotesByUserHandler,
  getRepairNoteByIdHandler,
  deleteRepairNoteByIdHandler,
  deleteAllRepairNotesHandler,
  updateRepairNoteByIdHandler,
};
