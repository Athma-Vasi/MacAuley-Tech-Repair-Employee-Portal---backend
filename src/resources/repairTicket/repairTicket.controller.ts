import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewRepairTicketRequest,
  CreateNewRepairTicketsBulkRequest,
  DeleteAllRepairTicketsRequest,
  DeleteRepairTicketRequest,
  GetQueriedRepairTicketsByUserRequest,
  GetQueriedRepairTicketsRequest,
  GetRepairTicketByIdRequest,
  UpdateRepairTicketByIdRequest,
  UpdateRepairTicketsBulkRequest,
} from "./repairTicket.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../types";
import type { RepairTicketDocument, RepairTicketSchema } from "./repairTicket.model";

import {
  createNewRepairTicketService,
  deleteRepairTicketByIdService,
  deleteAllRepairTicketsService,
  getQueriedRepairTicketsService,
  getRepairTicketByIdService,
  getQueriedRepairTicketsByUserService,
  getQueriedTotalRepairTicketsService,
  updateRepairTicketByIdService,
} from "./repairTicket.service";
import { removeUndefinedAndNullValues } from "../../utils";
import { getUserByIdService } from "../user";

// @desc   Create a new repair note
// @route  POST /repair-ticket
// @access Private
const createNewRepairTicketController = expressAsyncController(
  async (
    request: CreateNewRepairTicketRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      repairTicketSchema,
    } = request.body;

    // create new repair note object
    const newRepairTicketSchema: RepairTicketSchema = {
      ...repairTicketSchema,
      userId,
      username,
    };

    // create new repair note
    const repairTicketDocument = await createNewRepairTicketService(
      newRepairTicketSchema
    );
    if (!repairTicketDocument) {
      response.status(400).json({
        message: "New repair note could not be created. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `New repair note for ${repairTicketDocument.repairCategory} created successfully`,
      resourceData: [repairTicketDocument],
    });
  }
);

// @desc   Get all repairTickets
// @route  GET api/v1/repairTicket
// @access Private/Admin/Manager
const getQueriedRepairTicketsController = expressAsyncController(
  async (
    request: GetQueriedRepairTicketsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRepairTicketsService({
        filter: filter as FilterQuery<RepairTicketDocument> | undefined,
      });
    }

    // get all repairTickets
    const repairTicket = await getQueriedRepairTicketsService({
      filter: filter as FilterQuery<RepairTicketDocument> | undefined,
      projection: projection as QueryOptions<RepairTicketDocument>,
      options: options as QueryOptions<RepairTicketDocument>,
    });

    if (!repairTicket.length) {
      response.status(200).json({
        message: "No repairTickets that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairTickets found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairTicket,
    });
  }
);

// @desc   Get all repairTicket requests by user
// @route  GET api/v1/repairTicket
// @access Private
const getRepairTicketsByUserController = expressAsyncController(
  async (
    request: GetQueriedRepairTicketsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    // anyone can view their own repairTicket requests
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
      totalDocuments = await getQueriedTotalRepairTicketsService({
        filter: filterWithUserId,
      });
    }

    // get all repairTicket requests by user
    const repairTickets = await getQueriedRepairTicketsByUserService({
      filter: filterWithUserId as FilterQuery<RepairTicketDocument> | undefined,
      projection: projection as QueryOptions<RepairTicketDocument>,
      options: options as QueryOptions<RepairTicketDocument>,
    });

    if (!repairTickets.length) {
      response.status(200).json({
        message: "No repairTicket requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairTicket requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairTickets,
    });
  }
);

// @desc   Update repairTicket status
// @route  PATCH api/v1/repairTicket
// @access Private/Admin/Manager
const updateRepairTicketByIdController = expressAsyncController(
  async (
    request: UpdateRepairTicketByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    const { repairTicketId } = request.params;
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

    // update repairTicket request status
    const updatedRepairTicket = await updateRepairTicketByIdService({
      _id: repairTicketId,
      fields,
      updateOperator,
    });

    if (!updatedRepairTicket) {
      response.status(400).json({
        message: "RepairTicket request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairTicket request status updated successfully",
      resourceData: [updatedRepairTicket],
    });
  }
);

// @desc   Get an repairTicket request
// @route  GET api/v1/repairTicket
// @access Private
const getRepairTicketByIdController = expressAsyncController(
  async (
    request: GetRepairTicketByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    const { repairTicketId } = request.params;
    const repairTicket = await getRepairTicketByIdService(repairTicketId);
    if (!repairTicket) {
      response
        .status(404)
        .json({ message: "RepairTicket request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "RepairTicket request found successfully",
      resourceData: [repairTicket],
    });
  }
);

// @desc   Delete an repairTicket request by its id
// @route  DELETE api/v1/repairTicket
// @access Private
const deleteRepairTicketController = expressAsyncController(
  async (request: DeleteRepairTicketRequest, response: Response) => {
    const { repairTicketId } = request.params;

    // delete repairTicket request by id
    const deletedResult: DeleteResult = await deleteRepairTicketByIdService(
      repairTicketId
    );

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "RepairTicket request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "RepairTicket request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all repairTicket requests
// @route   DELETE api/v1/request-resource/repairTicket
// @access  Private
const deleteAllRepairTicketsController = expressAsyncController(
  async (_request: DeleteAllRepairTicketsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllRepairTicketsService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All repairTicket requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All repairTicket requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new repairTicket requests in bulk
// @route  POST api/v1/repairTicket
// @access Private
const createNewRepairTicketsBulkController = expressAsyncController(
  async (
    request: CreateNewRepairTicketsBulkRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    const { repairTicketSchemas } = request.body;

    const repairTicketDocuments = await Promise.all(
      repairTicketSchemas.map(async (repairTicketSchema) => {
        const repairTicketDocument = await createNewRepairTicketService(
          repairTicketSchema
        );
        return repairTicketDocument;
      })
    );

    // filter out any null documents
    const filteredRepairTicketDocuments = repairTicketDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredRepairTicketDocuments.length === 0) {
      response.status(400).json({
        message: "RepairTicket requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      repairTicketSchemas.length - filteredRepairTicketDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredRepairTicketDocuments.length
      } RepairTicket requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }`,
      resourceData: filteredRepairTicketDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Repair Notes in bulk
// @route  PATCH api/v1/repairTicket
// @access Private
const updateRepairTicketsBulkController = expressAsyncController(
  async (
    request: UpdateRepairTicketsBulkRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    const { repairTicketFields } = request.body;

    const updatedRepairTickets = await Promise.all(
      repairTicketFields.map(async (repairTicketField) => {
        const {
          documentUpdate: { fields, updateOperator },
          repairTicketId,
        } = repairTicketField;

        const updatedRepairTicket = await updateRepairTicketByIdService({
          _id: repairTicketId,
          fields,
          updateOperator,
        });

        return updatedRepairTicket;
      })
    );

    // filter out any repairTickets that were not created
    const successfullyCreatedRepairTickets = updatedRepairTickets.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedRepairTickets.length === 0) {
      response.status(400).json({
        message: "Could not create any Repair Notes",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedRepairTickets.length
      } Repair Notes. ${
        repairTicketFields.length - successfullyCreatedRepairTickets.length
      } Repair Notes failed to be created.`,
      resourceData: successfullyCreatedRepairTickets,
    });
  }
);

export {
  createNewRepairTicketController,
  getQueriedRepairTicketsController,
  getRepairTicketsByUserController,
  getRepairTicketByIdController,
  deleteRepairTicketController,
  deleteAllRepairTicketsController,
  updateRepairTicketByIdController,
  createNewRepairTicketsBulkController,
  updateRepairTicketsBulkController,
};
