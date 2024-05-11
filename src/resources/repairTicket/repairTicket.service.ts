import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { RepairTicketDocument, RepairTicketSchema } from "./repairTicket.model";

import { RepairTicketModel } from "./repairTicket.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";
import createHttpError from "http-errors";

async function getRepairTicketByIdService(
  repairTicketId: Types.ObjectId | string
): DatabaseResponseNullable<RepairTicketDocument> {
  try {
    const repairTicket = await RepairTicketModel.findById(repairTicketId).lean().exec();
    return repairTicket;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getRepairTicketByIdService");
  }
}

async function createNewRepairTicketService(
  repairTicketSchema: RepairTicketSchema
): Promise<RepairTicketDocument> {
  try {
    const repairTicket = await RepairTicketModel.create(repairTicketSchema);
    return repairTicket;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewRepairTicketService");
  }
}

async function getQueriedRepairTicketsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RepairTicketDocument>): DatabaseResponse<RepairTicketDocument> {
  try {
    const repairTicket = await RepairTicketModel.find(filter, projection, options)
      .lean()
      .exec();

    console.log("repairTicket", repairTicket);
    return repairTicket;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedRepairTicketsService");
  }
}

async function getQueriedTotalRepairTicketsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<RepairTicketDocument>): Promise<number> {
  try {
    const totalRepairTickets = await RepairTicketModel.countDocuments(filter)
      .lean()
      .exec();
    return totalRepairTickets;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalRepairTicketsService");
  }
}

async function getQueriedRepairTicketsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RepairTicketDocument>): DatabaseResponse<RepairTicketDocument> {
  try {
    const repairTickets = await RepairTicketModel.find(filter, projection, options)
      .lean()
      .exec();
    return repairTickets;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedRepairTicketsByUserService");
  }
}

async function updateRepairTicketByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<RepairTicketDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const repairTicket = await RepairTicketModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return repairTicket;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateRepairTicketStatusByIdService");
  }
}

async function deleteRepairTicketByIdService(
  repairTicketId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await RepairTicketModel.deleteOne({
      _id: repairTicketId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteRepairTicketByIdService");
  }
}

async function deleteAllRepairTicketsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await RepairTicketModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllRepairTicketsService");
  }
}

export {
  getRepairTicketByIdService,
  createNewRepairTicketService,
  getQueriedRepairTicketsService,
  getQueriedTotalRepairTicketsService,
  getQueriedRepairTicketsByUserService,
  deleteRepairTicketByIdService,
  deleteAllRepairTicketsService,
  updateRepairTicketByIdService,
};
