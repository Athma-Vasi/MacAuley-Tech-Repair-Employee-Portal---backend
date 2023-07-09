import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { PrinterIssueDocument, PrinterIssueSchema } from './printerIssue.model';

import { PrinterIssueModel } from './printerIssue.model';
import { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

async function createNewPrinterIssueService(
  input: PrinterIssueSchema
): Promise<PrinterIssueDocument> {
  try {
    const newPrinterIssue = await PrinterIssueModel.create(input);
    return newPrinterIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewPrinterIssueService' });
  }
}

type UpdatePrinterIssueInput = PrinterIssueSchema & {
  printerIssueId: string;
};

async function updatePrinterIssueService(
  input: UpdatePrinterIssueInput
): DatabaseResponseNullable<PrinterIssueDocument> {
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

async function getAllPrinterIssuesService(): DatabaseResponse<PrinterIssueDocument> {
  try {
    const allPrinterIssues = await PrinterIssueModel.find({}).lean().exec();
    return allPrinterIssues;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllPrinterIssuesService' });
  }
}

async function deletePrinterIssueService(id: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deletedPrinterIssue = await PrinterIssueModel.deleteOne({ _id: id }).lean().exec();
    return deletedPrinterIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'deletePrinterIssueService' });
  }
}

async function getAPrinterIssueService(
  id: Types.ObjectId | string
): DatabaseResponseNullable<PrinterIssueDocument> {
  try {
    const printerIssue = await PrinterIssueModel.findById(id).lean().exec();
    return printerIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAPrinterIssueService' });
  }
}

async function getPrinterIssuesFromUserService(
  userId: Types.ObjectId
): DatabaseResponse<PrinterIssueDocument> {
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
