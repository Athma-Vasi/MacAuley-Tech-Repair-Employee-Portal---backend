import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { RepairNoteDocument, RepairNoteSchema } from './repairNote.model';
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../types';

import { RepairNoteModel } from './repairNote.model';

async function createNewRepairNoteService(input: RepairNoteSchema): Promise<RepairNoteDocument> {
  try {
    const repairNote = await RepairNoteModel.create(input);
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewRepairNoteService' });
  }
}

async function getQueriedRepairNotesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RepairNoteDocument>): DatabaseResponse<RepairNoteDocument> {
  try {
    const repairNotes = await RepairNoteModel.find(filter, projection, options).lean().exec();
    return repairNotes;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedRepairNotesService' });
  }
}

async function getQueriedTotalRepairNotesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<RepairNoteDocument>): Promise<number> {
  try {
    const totalRepairNotes = await RepairNoteModel.countDocuments(filter).lean().exec();
    return totalRepairNotes;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalRepairNotesService' });
  }
}

async function getQueriedRepairNotesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RepairNoteDocument>): DatabaseResponse<RepairNoteDocument> {
  try {
    const repairNotes = await RepairNoteModel.find(filter, projection, options).lean().exec();
    return repairNotes;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedRepairNotesByUserService' });
  }
}

async function getRepairNoteByIdService(repairNoteId: Types.ObjectId | string) {
  try {
    const repairNote = await RepairNoteModel.find({ _id: repairNoteId })
      .select('-__v')
      .lean()
      .exec();
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: 'getRepairNoteByIdService' });
  }
}

async function updateRepairNoteByIdService(
  repairNoteId: Types.ObjectId | string,
  update: Partial<RepairNoteSchema>
): Promise<DatabaseResponseNullable<RepairNoteDocument>> {
  try {
    const repairNote = await RepairNoteModel.findByIdAndUpdate(
      repairNoteId,
      { $set: update },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateRepairNoteByIdService' });
  }
}

async function deleteRepairNoteByIdService(
  repairNoteId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const repairNote = await RepairNoteModel.deleteOne({ _id: repairNoteId }).exec();
    return repairNote;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteRepairNoteByIdService' });
  }
}

async function deleteAllRepairNotesService(): Promise<DeleteResult> {
  try {
    const repairNotes = await RepairNoteModel.deleteMany({}).exec();
    return repairNotes;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllRepairNotesService' });
  }
}

export {
  createNewRepairNoteService,
  getQueriedRepairNotesService,
  getQueriedTotalRepairNotesService,
  getQueriedRepairNotesByUserService,
  getRepairNoteByIdService,
  updateRepairNoteByIdService,
  deleteRepairNoteByIdService,
  deleteAllRepairNotesService,
};
