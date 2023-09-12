import expressAsyncHandler from 'express-async-handler';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type {
  GetQueriedPrinterIssuesRequest,
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  GetAPrinterIssueRequest,
  GetQueriedPrinterIssuesByUserRequest,
  DeleteAllPrinterIssuesRequest,
  UpdatePrinterIssueStatusByIdRequest,
} from './printerIssue.types';

import {
  createNewPrinterIssueService,
  deleteAllPrinterIssuesService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getQueriedPrinterIssuesService,
  getQueriedPrinterIssuesByUserService,
  updatePrinterIssueByIdService,
  getQueriedTotalPrinterIssuesService,
} from './printerIssue.service';
import { PrinterIssueDocument, PrinterIssueSchema } from './printerIssue.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create new printer issue
// @route  POST /printerIssues
// @access Private
const createNewPrinterIssueHandler = expressAsyncHandler(
  async (
    request: CreateNewPrinterIssueRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      printerIssue: {
        title,
        contactNumber,
        contactEmail,
        dateOfOccurrence,
        timeOfOccurrence,
        printerMake,
        printerModel,
        printerSerialNumber,
        printerIssueDescription,
        urgency,
        additionalInformation,
      },
    } = request.body;

    const newPrinterIssueObject: PrinterIssueSchema = {
      userId,
      username,
      action: 'general',
      category: 'printer issue',
      title,
      contactNumber,
      contactEmail,
      dateOfOccurrence,
      timeOfOccurrence,
      printerMake,
      printerModel,
      printerSerialNumber,
      printerIssueDescription,
      urgency,
      additionalInformation,
      requestStatus: 'pending',
    };
    const newPrinterIssue = await createNewPrinterIssueService(newPrinterIssueObject);

    if (newPrinterIssue) {
      response.status(201).json({
        message: `Printer issue: ${title} created successfully`,
        resourceData: [newPrinterIssue],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be created', resourceData: [] });
    }
  }
);

// @desc   Get all printer issues
// @route  GET /printerIssues
// @access Private
const getQueriedPrinterIssuesHandler = expressAsyncHandler(
  async (
    request: GetQueriedPrinterIssuesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPrinterIssuesService({
        filter: filter as FilterQuery<PrinterIssueDocument> | undefined,
      });
    }

    // get all printer issues
    const printerIssues = await getQueriedPrinterIssuesService({
      filter: filter as FilterQuery<PrinterIssueDocument> | undefined,
      projection: projection as QueryOptions<PrinterIssueDocument>,
      options: options as QueryOptions<PrinterIssueDocument>,
    });
    if (printerIssues.length === 0) {
      response.status(200).json({
        message: 'No printer issues that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found printer issues',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: printerIssues,
      });
    }
  }
);

// @desc   Get all printer issues from a user
// @route  GET /printerIssues/user
// @access Private
const getQueriedPrinterIssuesByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedPrinterIssuesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PrinterIssueDocument>>
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
      totalDocuments = await getQueriedTotalPrinterIssuesService({
        filter: filterWithUserId,
      });
    }

    // get all printer issues
    const printerIssues = await getQueriedPrinterIssuesByUserService({
      filter: filterWithUserId,
      projection: projection as QueryOptions<PrinterIssueDocument>,
      options: options as QueryOptions<PrinterIssueDocument>,
    });

    if (printerIssues.length === 0) {
      response.status(200).json({
        message: 'No printer issues that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found printer issues',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: printerIssues,
      });
    }
  }
);

// @desc   Get a printer issue
// @route  GET /printerIssues/:printerIssueId
// @access Private
const getAPrinterIssueHandler = expressAsyncHandler(
  async (
    request: GetAPrinterIssueRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const { printerIssueId } = request.params;
    const printerIssue = await getAPrinterIssueService(printerIssueId);

    if (printerIssue) {
      response.status(200).json({ message: 'Printer issue found', resourceData: [printerIssue] });
    } else {
      response.status(404).json({ message: 'Printer issue not found', resourceData: [] });
    }
  }
);

// @desc   Delete a printer issue
// @route  DELETE /printerIssues/:printerIssueId
// @access Private
const deletePrinterIssueHandler = expressAsyncHandler(
  async (
    request: DeletePrinterIssueRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const { printerIssueId } = request.params;
    const printerIssue: DeleteResult = await deletePrinterIssueService(printerIssueId);

    if (printerIssue.deletedCount === 1) {
      response
        .status(200)
        .json({ message: 'Printer issue deleted successfully', resourceData: [] });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be deleted', resourceData: [] });
    }
  }
);

// @desc   Delete all printer issues
// @route  DELETE /printerIssues
// @access Private
const deleteAllPrinterIssuesHandler = expressAsyncHandler(
  async (
    request: DeleteAllPrinterIssuesRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const deletedResult: DeleteResult = await deleteAllPrinterIssuesService();

    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'All printer issues deleted successfully',
        resourceData: [],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issues could not be deleted', resourceData: [] });
    }
  }
);

// @desc   Update a printer issue
// @route  PUT /printerIssues/:printerIssueId
// @access Private
const updatePrinterIssueByIdHandler = expressAsyncHandler(
  async (
    request: UpdatePrinterIssueStatusByIdRequest,
    response: Response<ResourceRequestServerResponse<PrinterIssueDocument>>
  ) => {
    const {
      printerIssue: { requestStatus },
    } = request.body;
    const { printerIssueId } = request.params;

    // check if printer issue exists
    const printerIssue = await getAPrinterIssueService(printerIssueId);
    if (!printerIssue) {
      response.status(404).json({ message: 'Printer issue not found', resourceData: [] });
      return;
    }

    const updatedPrinterIssue = await updatePrinterIssueByIdService({
      printerIssueId,
      requestStatus,
    });

    if (updatedPrinterIssue) {
      response.status(200).json({
        message: 'Printer issue updated successfully',
        resourceData: [updatedPrinterIssue],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be updated', resourceData: [] });
    }
  }
);

export {
  createNewPrinterIssueHandler,
  getQueriedPrinterIssuesHandler,
  deletePrinterIssueHandler,
  deleteAllPrinterIssuesHandler,
  getAPrinterIssueHandler,
  getQueriedPrinterIssuesByUserHandler,
  updatePrinterIssueByIdHandler,
};
