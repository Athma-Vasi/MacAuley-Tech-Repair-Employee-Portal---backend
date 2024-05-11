import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
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
import createHttpError from "http-errors";

// @desc   Create a new repair note
// @route  POST /repair-ticket
// @access Private
const createNewRepairTicketController = expressAsyncController(
  async (
    request: CreateNewRepairTicketRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId, username },
      repairTicketSchema,
    } = request.body;

    const newRepairTicketSchema: RepairTicketSchema = {
      ...repairTicketSchema,
      userId,
      username,
    };

    const repairTicketDocument = await createNewRepairTicketService(
      newRepairTicketSchema
    );
    if (!repairTicketDocument) {
      return next(new createHttpError.InternalServerError("Repair note creation failed"));
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
      message: "Repair tickets found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairTicket,
    });
  }
);

// @desc   Get all repair ticket requests by user
// @route  GET api/v1/repairTicket
// @access Private
const getRepairTicketsByUserController = expressAsyncController(
  async (
    request: GetQueriedRepairTicketsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RepairTicketDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRepairTicketsService({
        filter: filterWithUserId,
      });
    }

    const repairTickets = await getQueriedRepairTicketsByUserService({
      filter: filterWithUserId as FilterQuery<RepairTicketDocument> | undefined,
      projection: projection as QueryOptions<RepairTicketDocument>,
      options: options as QueryOptions<RepairTicketDocument>,
    });

    if (!repairTickets.length) {
      response.status(200).json({
        message: "No repair ticket requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Repair ticket requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: repairTickets,
    });
  }
);

// @desc   Update repair ticket status
// @route  PATCH api/v1/repairTicket
// @access Private/Admin/Manager
const updateRepairTicketByIdController = expressAsyncController(
  async (
    request: UpdateRepairTicketByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>,
    next: NextFunction
  ) => {
    const { repairTicketId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const updatedRepairTicket = await updateRepairTicketByIdService({
      _id: repairTicketId,
      fields,
      updateOperator,
    });

    if (!updatedRepairTicket) {
      return next(
        new createHttpError.InternalServerError(
          "Repair ticket request status update failed"
        )
      );
    }

    response.status(200).json({
      message: "Repair ticket request status updated successfully",
      resourceData: [updatedRepairTicket],
    });
  }
);

// @desc   Get an repair ticket request
// @route  GET api/v1/repairTicket
// @access Private
const getRepairTicketByIdController = expressAsyncController(
  async (
    request: GetRepairTicketByIdRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>,
    next: NextFunction
  ) => {
    const { repairTicketId } = request.params;
    const repairTicket = await getRepairTicketByIdService(repairTicketId);
    if (!repairTicket) {
      return next(new createHttpError.NotFound("Repair ticket request not found"));
    }

    response.status(200).json({
      message: "Repair ticket request found successfully",
      resourceData: [repairTicket],
    });
  }
);

// @desc   Delete an repair ticket request by its id
// @route  DELETE api/v1/repairTicket
// @access Private
const deleteRepairTicketController = expressAsyncController(
  async (request: DeleteRepairTicketRequest, response: Response, next: NextFunction) => {
    const { repairTicketId } = request.params;

    const deletedResult: DeleteResult = await deleteRepairTicketByIdService(
      repairTicketId
    );
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Repair ticket request deletion failed")
      );
    }

    response.status(200).json({
      message: "Repair ticket request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all repair ticket requests
// @route   DELETE api/v1/request-resource/repairTicket
// @access  Private
const deleteAllRepairTicketsController = expressAsyncController(
  async (
    _request: DeleteAllRepairTicketsRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllRepairTicketsService();
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "All repair ticket requests deletion failed"
        )
      );
    }

    response.status(200).json({
      message: "All repair ticket requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new repair ticket requests in bulk
// @route  POST api/v1/repairTicket
// @access Private
const createNewRepairTicketsBulkController = expressAsyncController(
  async (
    request: CreateNewRepairTicketsBulkRequest,
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>,
    next: NextFunction
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

    const filteredRepairTicketDocuments = repairTicketDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredRepairTicketDocuments.length === 0) {
      response.status(400).json({
        message: "Repair ticket requests creation failed",
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
    response: Response<ResourceRequestServerResponse<RepairTicketDocument>>,
    next: NextFunction
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
