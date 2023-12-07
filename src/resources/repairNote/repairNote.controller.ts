import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewRepairNoteRequest,
  CreateNewRepairNotesBulkRequest,
  DeleteAllRepairNotesRequest,
  DeleteRepairNoteRequest,
  GetQueriedRepairNotesByParentResourceIdRequest,
  GetQueriedRepairNotesByUserRequest,
  GetQueriedRepairNotesRequest,
  GetRepairNoteByIdRequest,
  UpdateRepairNoteByIdRequest,
  UpdateRepairNotesBulkRequest,
} from "./repairNote.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../types";
import type { RepairNoteDocument, RepairNoteSchema } from "./repairNote.model";

import {
  createNewRepairNoteService,
  deleteRepairNoteByIdService,
  deleteAllRepairNotesService,
  getQueriedRepairNotesService,
  getRepairNoteByIdService,
  getQueriedRepairNotesByUserService,
  getQueriedTotalRepairNotesService,
  updateRepairNoteByIdService,
} from "./repairNote.service";
import mongoose from "mongoose";
import { removeUndefinedAndNullValues } from "../../utils";
import { getUserByIdService } from "../user";

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
      repairNoteFields,
    } = request.body;

    // create new repair note object
    const repairNoteSchema: RepairNoteSchema = {
      ...repairNoteFields,
      userId,
      username,
      workOrderId: new mongoose.Types.ObjectId(),
    };

    // create new repair note
    const repairNoteDocument = await createNewRepairNoteService(repairNoteSchema);
    if (!repairNoteDocument) {
      response.status(400).json({
        message: "New repair note could not be created. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `New repair note for ${repairNoteDocument.customerName} created successfully`,
      resourceData: [repairNoteDocument],
    });
  }
);

// @desc   Get all repairNotes
// @route  GET api/v1/repairNote
// @access Private/Admin/Manager
const getQueriedRepairNotesHandler = expressAsyncHandler(
  async (
    request: GetQueriedRepairNotesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRepairNotesService({
        filter: filter as FilterQuery<RepairNoteDocument> | undefined,
      });
    }

    // get all repairNotes
    const repairNote = await getQueriedRepairNotesService({
      filter: filter as FilterQuery<RepairNoteDocument> | undefined,
      projection: projection as QueryOptions<RepairNoteDocument>,
      options: options as QueryOptions<RepairNoteDocument>,
    });

    if (!repairNote.length) {
      response.status(200).json({
        message: "No repairNotes that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairNotes found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairNote,
    });
  }
);

// @desc   Get all repairNote requests by user
// @route  GET api/v1/repairNote
// @access Private
const getRepairNotesByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedRepairNotesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    // anyone can view their own repairNote requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRepairNotesService({
        filter: filterWithUserId,
      });
    }

    // get all repairNote requests by user
    const repairNotes = await getQueriedRepairNotesByUserService({
      filter: filterWithUserId as FilterQuery<RepairNoteDocument> | undefined,
      projection: projection as QueryOptions<RepairNoteDocument>,
      options: options as QueryOptions<RepairNoteDocument>,
    });

    if (!repairNotes.length) {
      response.status(200).json({
        message: "No repairNote requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairNote requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairNotes,
    });
  }
);

// @desc   Update repairNote status
// @route  PATCH api/v1/repairNote
// @access Private/Admin/Manager
const updateRepairNoteByIdHandler = expressAsyncHandler(
  async (
    request: UpdateRepairNoteByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const { repairNoteId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update repairNote request status
    const updatedRepairNote = await updateRepairNoteByIdService({
      _id: repairNoteId,
      fields,
      updateOperator,
    });

    if (!updatedRepairNote) {
      response.status(400).json({
        message: "RepairNote request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairNote request status updated successfully",
      resourceData: [updatedRepairNote],
    });
  }
);

// @desc   Get an repairNote request
// @route  GET api/v1/repairNote
// @access Private
const getRepairNoteByIdHandler = expressAsyncHandler(
  async (
    request: GetRepairNoteByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const { repairNoteId } = request.params;
    const repairNote = await getRepairNoteByIdService(repairNoteId);
    if (!repairNote) {
      response
        .status(404)
        .json({ message: "RepairNote request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "RepairNote request found successfully",
      resourceData: [repairNote],
    });
  }
);

// @desc   Delete an repairNote request by its id
// @route  DELETE api/v1/repairNote
// @access Private
const deleteRepairNoteHandler = expressAsyncHandler(
  async (request: DeleteRepairNoteRequest, response: Response) => {
    const { repairNoteId } = request.params;

    // delete repairNote request by id
    const deletedResult: DeleteResult = await deleteRepairNoteByIdService(repairNoteId);

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "RepairNote request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairNote request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all repairNote requests
// @route   DELETE api/v1/request-resource/repairNote
// @access  Private
const deleteAllRepairNotesHandler = expressAsyncHandler(
  async (_request: DeleteAllRepairNotesRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllRepairNotesService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All repairNote requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All repairNote requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new repairNote requests in bulk
// @route  POST api/v1/repairNote
// @access Private
const createNewRepairNotesBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewRepairNotesBulkRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const { repairNoteSchemas } = request.body;

    const repairNoteDocuments = await Promise.all(
      repairNoteSchemas.map(async (repairNoteSchema) => {
        const repairNoteDocument = await createNewRepairNoteService(repairNoteSchema);
        return repairNoteDocument;
      })
    );

    // filter out any null documents
    const filteredRepairNoteDocuments = repairNoteDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredRepairNoteDocuments.length === 0) {
      response.status(400).json({
        message: "RepairNote requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      repairNoteSchemas.length - filteredRepairNoteDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredRepairNoteDocuments.length
      } RepairNote requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredRepairNoteDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Repair Notes in bulk
// @route  PATCH api/v1/repairNote
// @access Private
const updateRepairNotesBulkHandler = expressAsyncHandler(
  async (
    request: UpdateRepairNotesBulkRequest,
    response: Response<ResourceRequestServerResponse<RepairNoteDocument>>
  ) => {
    const { repairNoteFields } = request.body;

    const updatedRepairNotes = await Promise.all(
      repairNoteFields.map(async (repairNoteField) => {
        const {
          documentUpdate: { fields, updateOperator },
          repairNoteId,
        } = repairNoteField;

        const updatedRepairNote = await updateRepairNoteByIdService({
          _id: repairNoteId,
          fields,
          updateOperator,
        });

        return updatedRepairNote;
      })
    );

    // filter out any repairNotes that were not created
    const successfullyCreatedRepairNotes = updatedRepairNotes.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedRepairNotes.length === 0) {
      response.status(400).json({
        message: "Could not create any Repair Notes",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedRepairNotes.length
      } Repair Notes. ${
        repairNoteFields.length - successfullyCreatedRepairNotes.length
      } Repair Notes failed to be created.`,
      resourceData: successfullyCreatedRepairNotes,
    });
  }
);

export {
  createNewRepairNoteHandler,
  getQueriedRepairNotesHandler,
  getRepairNotesByUserHandler,
  getRepairNoteByIdHandler,
  deleteRepairNoteHandler,
  deleteAllRepairNotesHandler,
  updateRepairNoteByIdHandler,
  createNewRepairNotesBulkHandler,
  updateRepairNotesBulkHandler,
};
