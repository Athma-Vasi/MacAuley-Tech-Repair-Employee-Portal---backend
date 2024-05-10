import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
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
import createHttpError from "http-errors";

// @desc   Create a new printerIssue
// @route  POST api/v1/actions/general/printer-issue
// @access Private
const createNewPrinterIssueController = expressAsyncController(
  async (
    request: CreateNewPrinterIssueRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>,
    next: NextFunction
  ) => {
    const { printerIssueSchema } = request.body;

    const printerIssueDocument = await createNewPrinterIssueService(printerIssueSchema);

    if (!printerIssueDocument) {
      return next(
        new createHttpError.InternalServerError("Printer Issue document creation failed")
      );
    }

    response.status(201).json({
      message: `Successfully created ${printerIssueDocument.title} Printer Issue`,
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
    response: Response<GetQueriedResourceRequestServerResponse<PrinterIssueDocument>>,
    next: NextFunction
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

    const printerIssue = await getQueriedPrinterIssuesService({
      filter: filter as FilterQuery<PrinterIssueDocument> | undefined,
      projection: projection as QueryOptions<PrinterIssueDocument>,
      options: options as QueryOptions<PrinterIssueDocument>,
    });

    if (!printerIssue.length) {
      response.status(200).json({
        message: "No printer issues that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Printer issues found successfully",
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
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPrinterIssuesService({
        filter: filterWithUserId,
      });
    }

    const printerIssues = await getQueriedPrinterIssuesByUserService({
      filter: filterWithUserId as FilterQuery<PrinterIssueDocument> | undefined,
      projection: projection as QueryOptions<PrinterIssueDocument>,
      options: options as QueryOptions<PrinterIssueDocument>,
    });

    if (!printerIssues.length) {
      response.status(200).json({
        message: "No printer issue requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Printer issue requests found successfully",
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
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>,
    next: NextFunction
  ) => {
    const { printerIssueId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const updatedPrinterIssue = await updatePrinterIssueByIdService({
      _id: printerIssueId,
      fields,
      updateOperator,
    });

    if (!updatedPrinterIssue) {
      return next(
        new createHttpError.InternalServerError(
          "Printer issue request status update failed"
        )
      );
    }

    response.status(200).json({
      message: "Printer issue request status updated successfully",
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
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>,
    next: NextFunction
  ) => {
    const { printerIssueId } = request.params;
    const printerIssue = await getPrinterIssueByIdService(printerIssueId);
    if (!printerIssue) {
      return next(new createHttpError.NotFound("Printer issue request not found"));
    }

    response.status(200).json({
      message: "Printer issue request found successfully",
      resourceData: [printerIssue],
    });
  }
);

// @desc   Delete an printerIssue request by its id
// @route  DELETE api/v1/actions/general/printer-issue
// @access Private
const deletePrinterIssueController = expressAsyncController(
  async (request: DeletePrinterIssueRequest, response: Response, next: NextFunction) => {
    const { printerIssueId } = request.params;

    const deletedResult: DeleteResult = await deletePrinterIssueByIdService(
      printerIssueId
    );
    if (!deletedResult.deletedCount) {
      return next(new createHttpError.NotFound("Printer issue request not found"));
    }

    response.status(200).json({
      message: "Printer issue request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all printerIssue requests
// @route   DELETE api/v1/actions/general/request-resource/printerIssue
// @access  Private
const deleteAllPrinterIssuesController = expressAsyncController(
  async (
    _request: DeleteAllPrinterIssuesRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllPrinterIssuesService();
    if (!deletedResult.deletedCount) {
      return next(new createHttpError.NotFound("No printer issue requests found"));
    }

    response.status(200).json({
      message: "All printer issue requests deleted successfully",
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

    const filteredPrinterIssueDocuments = printerIssueDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredPrinterIssueDocuments.length === 0) {
      response.status(400).json({
        message: "Printer issue requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      printerIssueSchemas.length - filteredPrinterIssueDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredPrinterIssueDocuments.length
      } Printer issue requests.${
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
        message: "Could not create any Printer issues",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedPrinterIssues.length
      } Printer issues. ${
        printerIssueFields.length - successfullyCreatedPrinterIssues.length
      } Printer issues failed to be created.`,
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
