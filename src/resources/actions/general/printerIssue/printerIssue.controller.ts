import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  GetAllPrinterIssuesRequest,
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  GetAPrinterIssueRequest,
  GetPrinterIssuesFromUserRequest,
} from './printerIssue.types';
import {
  createNewPrinterIssueService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getAllPrinterIssuesService,
  getPrinterIssuesFromUserService,
} from './printerIssue.service';

// @desc   Create new printer issue
// @route  POST /printerIssues
// @access Private
const createNewPrinterIssueHandler = expressAsyncHandler(
  async (request: CreateNewPrinterIssueRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      title,
      contactNumber,
      contactEmail,
      printerMake,
      printerModel,
      printerSerialNumber,
      printerIssueDescription,
      urgency,
      additionalInformation,
    } = request.body;

    const newPrinterIssueObject = {
      userId,
      title,
      username,
      contactNumber,
      contactEmail,
      printerMake,
      printerModel,
      printerSerialNumber,
      printerIssueDescription,
      urgency,
      additionalInformation,
    };
    const newPrinterIssue = await createNewPrinterIssueService(newPrinterIssueObject);

    if (newPrinterIssue) {
      response.status(201).json({
        message: 'Printer issue created successfully',
        printerIssue: newPrinterIssue,
      });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be created', printerIssue: {} });
    }
  }
);

// @desc   Get all printer issues
// @route  GET /printerIssues
// @access Private
const getAllPrinterIssuesHandler = expressAsyncHandler(
  async (request: GetAllPrinterIssuesRequest, response: Response) => {
    const printerIssues = await getAllPrinterIssuesService();
    if (printerIssues.length === 0) {
      response.status(404).json({ message: 'No printer issues found', printerIssues: [] });
    } else {
      response.status(200).json({ message: 'Printer issues found', printerIssues });
    }
  }
);

// @desc   Delete a printer issue
// @route  DELETE /printerIssues/:printerIssueId
// @access Private
const deletePrinterIssueHandler = expressAsyncHandler(
  async (request: DeletePrinterIssueRequest, response: Response) => {
    const { printerIssueId } = request.params;
    const printerIssue = await deletePrinterIssueService(printerIssueId);

    if (printerIssue) {
      response.status(200).json({ message: 'Printer issue deleted successfully', printerIssue });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be deleted', printerIssue: {} });
    }
  }
);

// @desc   Get a printer issue
// @route  GET /printerIssues/:printerIssueId
// @access Private
const getAPrinterIssueHandler = expressAsyncHandler(
  async (request: GetAPrinterIssueRequest, response: Response) => {
    const { printerIssueId } = request.params;
    const printerIssue = await getAPrinterIssueService(printerIssueId);

    if (printerIssue) {
      response.status(200).json({ message: 'Printer issue found', printerIssue });
    } else {
      response.status(404).json({ message: 'Printer issue not found', printerIssue: {} });
    }
  }
);

// @desc   Get all printer issues from a user
// @route  GET /printerIssues/user
// @access Private
const getPrinterIssuesByUserHandler = expressAsyncHandler(
  async (request: GetPrinterIssuesFromUserRequest, response: Response) => {
    const {
      userInfo: { userId },
    } = request.body;
    const printerIssues = await getPrinterIssuesFromUserService(userId);
    if (printerIssues.length === 0) {
      response.status(404).json({ message: 'No printer issues found', printerIssues: [] });
    } else {
      response.status(200).json({ message: 'Printer issues found', printerIssues });
    }
  }
);

export {
  createNewPrinterIssueHandler,
  getAllPrinterIssuesHandler,
  deletePrinterIssueHandler,
  getAPrinterIssueHandler,
  getPrinterIssuesByUserHandler,
};
