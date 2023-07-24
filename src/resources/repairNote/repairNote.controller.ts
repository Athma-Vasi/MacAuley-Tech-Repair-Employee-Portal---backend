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
      repairNote: {
        // part information
        partName,
        partSerialId,
        dateReceived,
        descriptionOfIssue,
        initialInspectionNotes,

        // customer information
        customerName,
        customerPhone,
        customerEmail,
        customerAddressLine,
        customerCity,
        customerState,
        customerProvince,
        customerCountry,
        customerPostalCode,

        // repair information
        requiredRepairs,
        partsNeeded,
        partsNeededModels,
        partUnderWarranty,
        estimatedRepairCost,
        estimatedRepairCostCurrency,
        estimatedCompletionDate,
        repairPriority,
        workOrderId,
      },
    } = request.body;

    // create new repair note object
    const newRepairNoteObject: RepairNoteInitialSchema = {
      userId,
      username,
      // part information
      partName,
      partSerialId,
      dateReceived,
      descriptionOfIssue,
      initialInspectionNotes,

      // customer information
      customerName,
      customerPhone,
      customerEmail,
      customerAddressLine,
      customerCity,
      customerState,
      customerProvince,
      customerCountry,
      customerPostalCode,

      // repair information
      requiredRepairs,
      partsNeeded,
      partsNeededModels,
      partUnderWarranty,
      estimatedRepairCost,
      estimatedRepairCostCurrency,
      estimatedCompletionDate,
      repairPriority,
      workOrderId,

      // ongoing and final (updated) repair note state added after
    };

    // create new repair note
    const newRepairNote = await createNewRepairNoteService(newRepairNoteObject);

    if (!newRepairNote) {
      response
        .status(400)
        .json({ message: 'New repair note could not be created', resourceData: [] });
      return;
    }
    // return new repair note
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
    if (repairNotes.length === 0) {
      response.status(404).json({
        message: 'No repair notes that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found repair notes',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: repairNotes.length,
        resourceData: repairNotes,
      });
    }
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
    if (repairNotes.length === 0) {
      response.status(404).json({
        message: 'No repair notes that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found repair notes',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: repairNotes.length,
        resourceData: repairNotes,
      });
    }
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
      response.status(404).json({
        message: 'Repair note not found',
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found repair note',
        resourceData: [repairNote],
      });
    }
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
      response.status(404).json({
        message: 'Repair note not found',
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully deleted repair note',
        resourceData: [],
      });
    }
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
    if (deleteResult.deletedCount > 0) {
      response.status(200).json({
        message: 'Successfully deleted all repair notes',
        resourceData: [],
      });
    } else {
      response.status(404).json({
        message: 'All repair notes could not be deleted. Please try again!',
        resourceData: [],
      });
    }
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
    const {
      userInfo: { userId, username },
      repairNote: {
        // part information
        partName,
        partSerialId,
        dateReceived,
        descriptionOfIssue,
        initialInspectionNotes,

        // customer information
        customerName,
        customerPhone,
        customerEmail,
        customerAddressLine,
        customerCity,
        customerState,
        customerProvince,
        customerCountry,
        customerPostalCode,

        // repair information
        requiredRepairs,
        partsNeeded,
        partsNeededModels,
        partUnderWarranty,
        estimatedRepairCost,
        estimatedRepairCostCurrency,
        estimatedCompletionDate,
        repairPriority,
        workOrderId,

        // ongoing and final (updated) repair note state
        repairNotes,
        testingResults,
        finalRepairCost,
        finalRepairCostCurrency,
        repairStatus,
      },
    } = request.body;

    // create new repair note object
    const updatedRepairNoteObject: RepairNoteSchema = {
      userId,
      username,
      // part information
      partName,
      partSerialId,
      dateReceived,
      descriptionOfIssue,
      initialInspectionNotes,

      // customer information
      customerName,
      customerPhone,
      customerEmail,
      customerAddressLine,
      customerCity,
      customerState,
      customerProvince,
      customerCountry,
      customerPostalCode,

      // repair information
      requiredRepairs,
      partsNeeded,
      partsNeededModels,
      partUnderWarranty,
      estimatedRepairCost,
      estimatedRepairCostCurrency,
      estimatedCompletionDate,
      repairPriority,
      workOrderId,

      // ongoing and final (updated) repair note state
      repairNotes,
      testingResults,
      finalRepairCost,
      finalRepairCostCurrency,
      repairStatus,
    };

    // update repair note by id
    const updatedRepairNote = await updateRepairNoteByIdService(
      repairNoteId,
      updatedRepairNoteObject
    );
    if (!updatedRepairNote) {
      response.status(404).json({
        message: 'Repair note not found',
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully updated repair note',
        resourceData: [updatedRepairNote],
      });
    }
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
