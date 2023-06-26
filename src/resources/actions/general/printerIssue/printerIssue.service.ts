import type { FlattenMaps, Types } from 'mongoose';
import type { PrinterIssueDocument, PrinterIssueUrgency } from './printerIssue.model';
import type { ActionsGeneral } from '../actionsGeneral.types';

import { PrinterIssueModel } from './printerIssue.model';

type CreateNewPrinterIssueInput = {
  userId: Types.ObjectId;
  username: string;
  title: ActionsGeneral;
  contactNumber: string;
  contactEmail: string;
  printerMake: string;
  printerModel: string;
  printerSerialNumber: string;
  printerIssueDescription: string;
  urgency: PrinterIssueUrgency;
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

export {
  createNewPrinterIssueService,
  getAllPrinterIssuesService,
  deletePrinterIssueService,
  getAPrinterIssueService,
  getPrinterIssuesFromUserService,
};
