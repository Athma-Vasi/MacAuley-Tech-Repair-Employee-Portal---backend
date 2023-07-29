import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { PrinterIssueDocument, PrinterIssueSchema } from './printerIssue.model';

import { PrinterIssueModel } from './printerIssue.model';
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  RequestStatus,
} from '../../../../types';

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

async function updatePrinterIssueByIdService({
  printerIssueId,
  requestStatus,
}: {
  printerIssueId: string | Types.ObjectId;
  requestStatus: RequestStatus;
}): DatabaseResponseNullable<PrinterIssueDocument> {
  try {
    const updatedPrinterIssue = await PrinterIssueModel.findByIdAndUpdate(
      printerIssueId,
      { requestStatus },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return updatedPrinterIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'updatePrinterIssueByIdService' });
  }
}

async function getQueriedPrinterIssuesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PrinterIssueDocument>): DatabaseResponse<PrinterIssueDocument> {
  try {
    const allPrinterIssues = await PrinterIssueModel.find(filter, projection, options)
      .lean()
      .exec();
    return allPrinterIssues;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedPrinterIssuesService' });
  }
}

async function getQueriedTotalPrinterIssuesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<PrinterIssueDocument>): Promise<number> {
  try {
    const totalPrinterIssues = await PrinterIssueModel.countDocuments(filter).lean().exec();
    return totalPrinterIssues;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalPrinterIssuesService' });
  }
}

async function getQueriedPrinterIssuesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PrinterIssueDocument>): DatabaseResponse<PrinterIssueDocument> {
  try {
    const printerIssues = await PrinterIssueModel.find(filter, projection, options).lean().exec();
    return printerIssues;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedPrinterIssuesByUserService' });
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

async function deletePrinterIssueService(id: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deletedPrinterIssue = await PrinterIssueModel.deleteOne({ _id: id }).lean().exec();
    return deletedPrinterIssue;
  } catch (error: any) {
    throw new Error(error, { cause: 'deletePrinterIssueService' });
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
  getQueriedPrinterIssuesService,
  deletePrinterIssueService,
  deleteAllPrinterIssuesService,
  getAPrinterIssueService,
  getQueriedTotalPrinterIssuesService,
  getQueriedPrinterIssuesByUserService,
  updatePrinterIssueByIdService,
};
