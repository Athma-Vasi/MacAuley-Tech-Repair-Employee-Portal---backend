import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { PrinterIssueDocument, PrinterIssueSchema } from "./printerIssue.model";

import { PrinterIssueModel } from "./printerIssue.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";
import createHttpError from "http-errors";

async function getPrinterIssueByIdService(
  printerIssueId: Types.ObjectId | string
): DatabaseResponseNullable<PrinterIssueDocument> {
  try {
    const printerIssue = await PrinterIssueModel.findById(printerIssueId).lean().exec();
    return printerIssue;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getPrinterIssueByIdService");
  }
}

async function createNewPrinterIssueService(
  printerIssueSchema: PrinterIssueSchema
): Promise<PrinterIssueDocument> {
  try {
    const printerIssue = await PrinterIssueModel.create(printerIssueSchema);
    return printerIssue;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewPrinterIssueService");
  }
}

async function getQueriedPrinterIssuesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PrinterIssueDocument>): DatabaseResponse<PrinterIssueDocument> {
  try {
    const printerIssue = await PrinterIssueModel.find(filter, projection, options)
      .lean()
      .exec();
    return printerIssue;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedPrinterIssuesService");
  }
}

async function getQueriedTotalPrinterIssuesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<PrinterIssueDocument>): Promise<number> {
  try {
    const totalPrinterIssues = await PrinterIssueModel.countDocuments(filter)
      .lean()
      .exec();
    return totalPrinterIssues;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalPrinterIssuesService");
  }
}

async function getQueriedPrinterIssuesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PrinterIssueDocument>): DatabaseResponse<PrinterIssueDocument> {
  try {
    const printerIssues = await PrinterIssueModel.find(filter, projection, options)
      .lean()
      .exec();
    return printerIssues;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedPrinterIssuesByUserService");
  }
}

async function updatePrinterIssueByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<PrinterIssueDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const printerIssue = await PrinterIssueModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return printerIssue;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updatePrinterIssueStatusByIdService");
  }
}

async function deletePrinterIssueByIdService(
  printerIssueId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await PrinterIssueModel.deleteOne({
      _id: printerIssueId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deletePrinterIssueByIdService");
  }
}

async function deleteAllPrinterIssuesService(): Promise<DeleteResult> {
  try {
    const deletedResult = await PrinterIssueModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllPrinterIssuesService");
  }
}

export {
  getPrinterIssueByIdService,
  createNewPrinterIssueService,
  getQueriedPrinterIssuesService,
  getQueriedTotalPrinterIssuesService,
  getQueriedPrinterIssuesByUserService,
  deletePrinterIssueByIdService,
  deleteAllPrinterIssuesService,
  updatePrinterIssueByIdService,
};
