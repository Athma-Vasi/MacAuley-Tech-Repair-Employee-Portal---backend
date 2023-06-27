import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  GetAllPrinterIssuesRequest,
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  GetAPrinterIssueRequest,
  GetPrinterIssuesFromUserRequest,
  DeleteAllPrinterIssuesRequest,
  UpdatePrinterIssueRequest,
} from './printerIssue.types';

import {
  createNewPrinterIssueService,
  deleteAllPrinterIssuesService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getAllPrinterIssuesService,
  getPrinterIssuesFromUserService,
  updatePrinterIssueService,
} from './printerIssue.service';
import { getUserByIdService } from '../../../user';

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

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', printerIssueData: [] });
      return;
    }

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
        printerIssueData: [newPrinterIssue],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be created', printerIssueData: [] });
    }
  }
);

// @desc   Get all printer issues
// @route  GET /printerIssues
// @access Private
const getAllPrinterIssuesHandler = expressAsyncHandler(
  async (request: GetAllPrinterIssuesRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', printerIssueData: [] });
      return;
    }

    // only managers/admins can view all printer issues
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can get all printer issues',
        printerIssueData: [],
      });
      return;
    }
    const printerIssues = await getAllPrinterIssuesService();
    if (printerIssues.length === 0) {
      response.status(404).json({ message: 'No printer issues found', printerIssues: [] });
    } else {
      response
        .status(200)
        .json({ message: 'Printer issues found', printerIssueData: printerIssues });
    }
  }
);

// @desc   Delete a printer issue
// @route  DELETE /printerIssues/:printerIssueId
// @access Private
const deletePrinterIssueHandler = expressAsyncHandler(
  async (request: DeletePrinterIssueRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', printerIssueData: [] });
      return;
    }

    // only managers/admins can delete a printer issue
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can delete a printer issue',
        printerIssueData: [],
      });
      return;
    }

    const { printerIssueId } = request.params;
    const printerIssue = await deletePrinterIssueService(printerIssueId);

    if (printerIssue) {
      response
        .status(200)
        .json({ message: 'Printer issue deleted successfully', printerIssueData: [printerIssue] });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be deleted', printerIssueData: [] });
    }
  }
);

// @desc   Get a printer issue
// @route  GET /printerIssues/:printerIssueId
// @access Private
const getAPrinterIssueHandler = expressAsyncHandler(
  async (request: GetAPrinterIssueRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', printerIssueData: [] });
      return;
    }

    // only managers/admins can view a printer issue not belonging to them
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can view a printer issue not belonging to them',
        printerIssueData: [],
      });
      return;
    }

    const { printerIssueId } = request.params;
    const printerIssue = await getAPrinterIssueService(printerIssueId);

    if (printerIssue) {
      response
        .status(200)
        .json({ message: 'Printer issue found', printerIssueData: [printerIssue] });
    } else {
      response.status(404).json({ message: 'Printer issue not found', printerIssueData: [] });
    }
  }
);

// @desc   Get all printer issues from a user
// @route  GET /printerIssues/user
// @access Private
const getPrinterIssuesByUserHandler = expressAsyncHandler(
  async (request: GetPrinterIssuesFromUserRequest, response: Response) => {
    // anyone can view their own printer issues
    const {
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', printerIssueData: [] });
      return;
    }

    const printerIssues = await getPrinterIssuesFromUserService(userId);
    if (printerIssues.length === 0) {
      response.status(404).json({ message: 'No printer issues found', printerIssueData: [] });
    } else {
      response
        .status(200)
        .json({ message: 'Printer issues found', printerIssueData: printerIssues });
    }
  }
);

// @desc   Delete all printer issues
// @route  DELETE /printerIssues
// @access Private
const deleteAllPrinterIssuesHandler = expressAsyncHandler(
  async (request: DeleteAllPrinterIssuesRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', printerIssueData: [] });
      return;
    }

    // only managers/admin can delete all printer issues
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can delete all printer issues',
        printerIssueData: [],
      });
      return;
    }

    const deletedResult = await deleteAllPrinterIssuesService();

    if (deletedResult.acknowledged) {
      response.status(200).json({
        message: 'All printer issues deleted successfully',
        printerIssueData: [],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issues could not be deleted', printerIssueData: [] });
    }
  }
);

// @desc   Update a printer issue
// @route  PUT /printerIssues/:printerIssueId
// @access Private
const updatePrinterIssueHandler = expressAsyncHandler(
  async (request: UpdatePrinterIssueRequest, response: Response) => {
    // anyone can update their own printer issue
    const {
      userInfo: { userId, username },
      title,
      contactEmail,
      contactNumber,
      printerIssueDescription,
      printerMake,
      printerModel,
      printerSerialNumber,
      urgency,
      additionalInformation,
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', printerIssueData: [] });
      return;
    }

    const { printerIssueId } = request.params;
    // check if printer issue exists
    const printerIssue = await getAPrinterIssueService(printerIssueId);
    if (!printerIssue) {
      response.status(404).json({ message: 'Printer issue not found', printerIssueData: [] });
      return;
    }

    // check if user is the owner of the printer issue
    if (printerIssue.userId !== userId) {
      response.status(403).json({
        message:
          'You are not authorized to update as you are not the originator of this printer issue',
        printerIssueData: [],
      });
      return;
    }

    const updatedPrinterIssue = await updatePrinterIssueService({
      printerIssueId,
      userId,
      username,
      title,
      contactEmail,
      contactNumber,
      printerIssueDescription,
      printerMake,
      printerModel,
      printerSerialNumber,
      urgency,
      additionalInformation,
    });

    if (updatedPrinterIssue) {
      response.status(200).json({
        message: 'Printer issue updated successfully',
        printerIssueData: [updatedPrinterIssue],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Printer issue could not be updated', printerIssueData: [] });
    }
  }
);

export {
  createNewPrinterIssueHandler,
  getAllPrinterIssuesHandler,
  deletePrinterIssueHandler,
  deleteAllPrinterIssuesHandler,
  getAPrinterIssueHandler,
  getPrinterIssuesByUserHandler,
  updatePrinterIssueHandler,
};
