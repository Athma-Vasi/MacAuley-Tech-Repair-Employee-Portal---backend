import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { PrinterIssueDocument, Urgency } from './printerIssue.model';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type { Action } from '../..';

import { PrinterIssueModel } from './printerIssue.model';
import { PhoneNumber } from '../../../user';

type CreateNewPrinterIssueInput = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsGeneral;
  title: string;
  contactNumber: PhoneNumber;
  contactEmail: string;
  dateOfOccurrence: string;
  timeOfOccurrence: string;
  printerMake: string;
  printerModel: string;
  printerSerialNumber: string;
  printerIssueDescription: string;
  urgency: Urgency;
  additionalInformation: string;
};

async function createNewPrinterIssueService(input: CreateNewPrinterIssueInput) {
  try {
    const newPrinterIssue = await PrinterIssueModel.create(input);
    return newPrinterIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewPrinterIssueService' });
  }
}

type UpdatePrinterIssueInput = CreateNewPrinterIssueInput & {
  printerIssueId: Types.ObjectId;
};

async function updatePrinterIssueService(input: UpdatePrinterIssueInput): Promise<
  | (FlattenMaps<PrinterIssueDocument> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
> {
  try {
    const updatedPrinterIssue = await PrinterIssueModel.findByIdAndUpdate(
      input.printerIssueId,
      input,
      { new: true }
    )
      .lean()
      .exec();
    return updatedPrinterIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'updatePrinterIssueService' });
  }
}

async function getAllPrinterIssuesService(): Promise<
  (FlattenMaps<PrinterIssueDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
  try {
    const allPrinterIssues = await PrinterIssueModel.find({}).lean().exec();
    return allPrinterIssues;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllPrinterIssuesService' });
  }
}

async function deletePrinterIssueService(id: Types.ObjectId): Promise<
  | (FlattenMaps<PrinterIssueDocument> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
> {
  try {
    const deletedPrinterIssue = await PrinterIssueModel.findByIdAndDelete(id).lean().exec();
    return deletedPrinterIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'deletePrinterIssueService' });
  }
}

async function getAPrinterIssueService(id: Types.ObjectId): Promise<
  | (FlattenMaps<PrinterIssueDocument> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
> {
  try {
    const printerIssue = await PrinterIssueModel.findById(id).lean().exec();
    return printerIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAPrinterIssueService' });
  }
}

async function getPrinterIssuesFromUserService(userId: Types.ObjectId): Promise<
  (FlattenMaps<PrinterIssueDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
  try {
    const printerIssues = await PrinterIssueModel.find({ userId }).lean().exec();
    return printerIssues;
  } catch (error: any) {
    throw new Error(error, { cause: 'getPrinterIssuesFromUserService' });
  }
}

async function deleteAllPrinterIssuesService(): Promise<DeleteResult> {
  try {
    const deletedPrinterIssues = await PrinterIssueModel.deleteMany({}).lean().exec();
    return deletedPrinterIssues;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllPrinterIssuesService' });
  }
}

export {
  createNewPrinterIssueService,
  getAllPrinterIssuesService,
  deletePrinterIssueService,
  deleteAllPrinterIssuesService,
  getAPrinterIssueService,
  getPrinterIssuesFromUserService,
  updatePrinterIssueService,
};
