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
