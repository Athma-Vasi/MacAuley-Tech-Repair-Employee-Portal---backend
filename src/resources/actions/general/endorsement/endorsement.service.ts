import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { EmployeeAttributes, EndorsementDocument } from './endorsement.model';
import type { ActionsGeneral } from '../../general';

import { EndorsementModel } from './endorsement.model';

type CreateNewEndorsementInput = {
  userId: Types.ObjectId;
  section: 'company' | 'general';
  title: ActionsGeneral;
  username: string;
  userToBeEndorsed: string;
  summaryOfEndorsement: string;
  attributeEndorsed: EmployeeAttributes;
};

async function createNewEndorsementService(input: CreateNewEndorsementInput) {
  try {
    const newEndorsement = await EndorsementModel.create(input);

    return newEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewEndorsementService' });
  }
}

async function deleteEndorsementService(id: Types.ObjectId): Promise<
  | (FlattenMaps<EndorsementDocument> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
> {
  try {
    const deletedEndorsement = await EndorsementModel.findByIdAndDelete(id).lean().exec();

    return deletedEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteEndorsementService' });
  }
}

async function getAllEndorsementsService(): Promise<
  (FlattenMaps<EndorsementDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
  try {
    const allEndorsements = await EndorsementModel.find({}).lean().exec();

    return allEndorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllEndorsementsService' });
  }
}

async function getAnEndorsementService(id: Types.ObjectId): Promise<
  | (FlattenMaps<EndorsementDocument> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
> {
  try {
    const endorsement = await EndorsementModel.findById({ _id: id }).lean().exec();
    return endorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnEndorsementService' });
  }
}

async function getEndorsementsByUserService(userId: Types.ObjectId): Promise<
  (FlattenMaps<EndorsementDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
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

type UpdateAnEndorsementInput = CreateNewEndorsementInput & {
  endorsementId: Types.ObjectId;
};

async function updateAnEndorsementService(input: UpdateAnEndorsementInput): Promise<
  | (FlattenMaps<EndorsementDocument> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
> {
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
