import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewPrinterIssueRequest,
  CreateNewPrinterIssuesBulkRequest,
  DeleteAllPrinterIssuesRequest,
  DeletePrinterIssueRequest,
  GetPrinterIssueByIdRequest,
  GetQueriedPrinterIssuesByUserRequest,
  GetQueriedPrinterIssuesRequest,
  UpdatePrinterIssueByIdRequest,
  UpdatePrinterIssuesBulkRequest,
} from "./printerIssue.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { PrinterIssueDocument } from "./printerIssue.model";

import {
  createNewPrinterIssueService,
  deleteAllPrinterIssuesService,
  deletePrinterIssueByIdService,
  getPrinterIssueByIdService,
  getQueriedPrinterIssuesByUserService,
  getQueriedPrinterIssuesService,
  getQueriedTotalPrinterIssuesService,
  updatePrinterIssueByIdService,
} from "./printerIssue.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";

// @desc   Create a new printerIssue
// @route  POST api/v1/actions/general/printer-issue
// @access Private
const createNewPrinterIssueController = expressAsyncController(
  async (
    request: CreateNewPrinterIssueRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const { printerIssueSchema } = request.body;

    const printerIssueDocument = await createNewPrinterIssueService(printerIssueSchema);

    if (!printerIssueDocument) {
      response.status(400).json({
        message: "New printerIssue could not be created",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${printerIssueDocument.title} printerIssue`,
      resourceData: [printerIssueDocument],
    });
  }
);

// @desc   Get all printerIssues
// @route  GET api/v1/actions/general/printer-issue
// @access Private/Admin/Manager
const getQueriedPrinterIssuesController = expressAsyncController(
  async (
    request: GetQueriedPrinterIssuesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPrinterIssuesService({
        filter: filter as FilterQuery<PrinterIssueDocument> | undefined,
      });
    }

    // get all printerIssues
    const printerIssue = await getQueriedPrinterIssuesService({
      filter: filter as FilterQuery<PrinterIssueDocument> | undefined,
      projection: projection as QueryOptions<PrinterIssueDocument>,
      options: options as QueryOptions<PrinterIssueDocument>,
    });

    if (!printerIssue.length) {
      response.status(200).json({
        message: "No printerIssues that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "PrinterIssues found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: printerIssue,
    });
  }
);

// @desc   Get all printerIssue requests by user
// @route  GET api/v1/actions/general/printer-issue
// @access Private
const getPrinterIssuesByUserController = expressAsyncController(
  async (
    request: GetQueriedPrinterIssuesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    // anyone can view their own printerIssue requests
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
      totalDocuments = await getQueriedTotalPrinterIssuesService({
        filter: filterWithUserId,
      });
    }

    // get all printerIssue requests by user
    const printerIssues = await getQueriedPrinterIssuesByUserService({
      filter: filterWithUserId as FilterQuery<PrinterIssueDocument> | undefined,
      projection: projection as QueryOptions<PrinterIssueDocument>,
      options: options as QueryOptions<PrinterIssueDocument>,
    });

    if (!printerIssues.length) {
      response.status(200).json({
        message: "No printerIssue requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "PrinterIssue requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: printerIssues,
    });
  }
);

// @desc   Update printerIssue status
// @route  PATCH api/v1/actions/general/printer-issue
// @access Private/Admin/Manager
const updatePrinterIssueByIdController = expressAsyncController(
  async (
    request: UpdatePrinterIssueByIdRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const { printerIssueId } = request.params;
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

    // update printerIssue request status
    const updatedPrinterIssue = await updatePrinterIssueByIdService({
      _id: printerIssueId,
      fields,
      updateOperator,
    });

    if (!updatedPrinterIssue) {
      response.status(400).json({
        message: "PrinterIssue request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "PrinterIssue request status updated successfully",
      resourceData: [updatedPrinterIssue],
    });
  }
);

// @desc   Get an printerIssue request
// @route  GET api/v1/actions/general/printer-issue
// @access Private
const getPrinterIssueByIdController = expressAsyncController(
  async (
    request: GetPrinterIssueByIdRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const { printerIssueId } = request.params;
    const printerIssue = await getPrinterIssueByIdService(printerIssueId);
    if (!printerIssue) {
      response
        .status(404)
        .json({ message: "PrinterIssue request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "PrinterIssue request found successfully",
      resourceData: [printerIssue],
    });
  }
);

// @desc   Delete an printerIssue request by its id
// @route  DELETE api/v1/actions/general/printer-issue
// @access Private
const deletePrinterIssueController = expressAsyncController(
  async (request: DeletePrinterIssueRequest, response: Response) => {
    const { printerIssueId } = request.params;

    // delete printerIssue request by id
    const deletedResult: DeleteResult = await deletePrinterIssueByIdService(
      printerIssueId
    );

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "PrinterIssue request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "PrinterIssue request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all printerIssue requests
// @route   DELETE api/v1/actions/general/request-resource/printerIssue
// @access  Private
const deleteAllPrinterIssuesController = expressAsyncController(
  async (_request: DeleteAllPrinterIssuesRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllPrinterIssuesService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All printerIssue requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All printerIssue requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new printerIssue requests in bulk
// @route  POST api/v1/actions/general/printer-issue
// @access Private
const createNewPrinterIssuesBulkController = expressAsyncController(
  async (
    request: CreateNewPrinterIssuesBulkRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const { printerIssueSchemas } = request.body;

    const printerIssueDocuments = await Promise.all(
      printerIssueSchemas.map(async (printerIssueSchema) => {
        const printerIssueDocument = await createNewPrinterIssueService(
          printerIssueSchema
        );
        return printerIssueDocument;
      })
    );

    // filter out any null documents
    const filteredPrinterIssueDocuments = printerIssueDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredPrinterIssueDocuments.length === 0) {
      response.status(400).json({
        message: "PrinterIssue requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      printerIssueSchemas.length - filteredPrinterIssueDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredPrinterIssueDocuments.length
      } PrinterIssue requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredPrinterIssueDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Printer Issues in bulk
// @route  PATCH api/v1/actions/general/printer-issue
// @access Private
const updatePrinterIssuesBulkController = expressAsyncController(
  async (
    request: UpdatePrinterIssuesBulkRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const { printerIssueFields } = request.body;

    const updatedPrinterIssues = await Promise.all(
      printerIssueFields.map(async (printerIssueField) => {
        const {
          documentUpdate: { fields, updateOperator },
          printerIssueId,
        } = printerIssueField;

        const updatedPrinterIssue = await updatePrinterIssueByIdService({
          _id: printerIssueId,
          fields,
          updateOperator,
        });

        return updatedPrinterIssue;
      })
    );

    // filter out any printerIssues that were not created
    const successfullyCreatedPrinterIssues = updatedPrinterIssues.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedPrinterIssues.length === 0) {
      response.status(400).json({
        message: "Could not create any Printer Issues",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedPrinterIssues.length
      } Printer Issues. ${
        printerIssueFields.length - successfullyCreatedPrinterIssues.length
      } Printer Issues failed to be created.`,
      resourceData: successfullyCreatedPrinterIssues,
    });
  }
);

export {
  createNewPrinterIssueController,
  getQueriedPrinterIssuesController,
  getPrinterIssuesByUserController,
  getPrinterIssueByIdController,
  deletePrinterIssueController,
  deleteAllPrinterIssuesController,
  updatePrinterIssueByIdController,
  createNewPrinterIssuesBulkController,
  updatePrinterIssuesBulkController,
};
