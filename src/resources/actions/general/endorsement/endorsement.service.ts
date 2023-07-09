import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { EndorsementDocument, EndorsementSchema } from './endorsement.model';

import { EndorsementModel } from './endorsement.model';
import { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

async function createNewEndorsementService(input: EndorsementSchema): Promise<EndorsementDocument> {
  try {
    const newEndorsement = await EndorsementModel.create(input);
    return newEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewEndorsementService' });
  }
}

async function deleteEndorsementService(
  id: Types.ObjectId | string
): DatabaseResponseNullable<EndorsementDocument> {
  try {
    const deletedEndorsement = await EndorsementModel.findByIdAndDelete(id).lean().exec();
    return deletedEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteEndorsementService' });
  }
}

async function getAllEndorsementsService(): DatabaseResponse<EndorsementDocument> {
  try {
    const allEndorsements = await EndorsementModel.find({}).lean().exec();
    return allEndorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllEndorsementsService' });
  }
}

async function getAnEndorsementService(
  id: Types.ObjectId | string
): DatabaseResponseNullable<EndorsementDocument> {
  try {
    const endorsement = await EndorsementModel.findById({ _id: id }).lean().exec();
    return endorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnEndorsementService' });
  }
}

async function getEndorsementsByUserService(
  userId: Types.ObjectId | string
): DatabaseResponse<EndorsementDocument> {
  try {
    const endorsements = await EndorsementModel.find({ userId }).lean().exec();
    return endorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getEndorsementsByUserService' });
  }
}

async function deleteAllEndorsementsService(): Promise<DeleteResult> {
  try {
    const deletedEndorsements = await EndorsementModel.deleteMany({}).lean().exec();
    return deletedEndorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllEndorsementsService' });
  }
}

type UpdateAnEndorsementInput = EndorsementSchema & {
  endorsementId: string;
};
async function updateAnEndorsementService(
  input: UpdateAnEndorsementInput
): DatabaseResponseNullable<EndorsementDocument> {
  try {
    const updatedEndorsement = await EndorsementModel.findByIdAndUpdate(
      input.endorsementId,
      input,
      { new: true }
    )
      .lean()
      .exec();
    return updatedEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateAnEndorsementService' });
  }
}

export {
  createNewEndorsementService,
  deleteEndorsementService,
  deleteAllEndorsementsService,
  getAllEndorsementsService,
  getEndorsementsByUserService,
  getAnEndorsementService,
  updateAnEndorsementService,
};
