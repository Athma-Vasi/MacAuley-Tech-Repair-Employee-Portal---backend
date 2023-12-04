import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { RepairNoteDocument, RepairNoteSchema } from "./repairNote.model";

import { RepairNoteModel } from "./repairNote.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";

async function getRepairNoteByIdService(
  repairNoteId: Types.ObjectId | string
): DatabaseResponseNullable<RepairNoteDocument> {
  try {
    const repairNote = await RepairNoteModel.findById(repairNoteId).lean().exec();
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: "getRepairNoteByIdService" });
  }
}

async function createNewRepairNoteService(
  repairNoteSchema: RepairNoteSchema
): Promise<RepairNoteDocument> {
  try {
    const repairNote = await RepairNoteModel.create(repairNoteSchema);
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewRepairNoteService" });
  }
}

async function getQueriedRepairNotesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RepairNoteDocument>): DatabaseResponse<RepairNoteDocument> {
  try {
    const repairNote = await RepairNoteModel.find(filter, projection, options)
      .lean()
      .exec();
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedRepairNotesService" });
  }
}

async function getQueriedTotalRepairNotesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<RepairNoteDocument>): Promise<number> {
  try {
    const totalRepairNotes = await RepairNoteModel.countDocuments(filter).lean().exec();
    return totalRepairNotes;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalRepairNotesService" });
  }
}

async function getQueriedRepairNotesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RepairNoteDocument>): DatabaseResponse<RepairNoteDocument> {
  try {
    const repairNotes = await RepairNoteModel.find(filter, projection, options)
      .lean()
      .exec();
    return repairNotes;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedRepairNotesByUserService" });
  }
}

async function updateRepairNoteByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<RepairNoteDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const repairNote = await RepairNoteModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: "updateRepairNoteStatusByIdService" });
  }
}

async function deleteRepairNoteByIdService(
  repairNoteId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await RepairNoteModel.deleteOne({
      _id: repairNoteId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteRepairNoteByIdService" });
  }
}

async function deleteAllRepairNotesService(): Promise<DeleteResult> {
  try {
    const deletedResult = await RepairNoteModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllRepairNotesService" });
  }
}

export {
  getRepairNoteByIdService,
  createNewRepairNoteService,
  getQueriedRepairNotesService,
  getQueriedTotalRepairNotesService,
  getQueriedRepairNotesByUserService,
  deleteRepairNoteByIdService,
  deleteAllRepairNotesService,
  updateRepairNoteByIdService,
};
