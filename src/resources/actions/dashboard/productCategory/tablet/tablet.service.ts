import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { TabletDocument, TabletModel, TabletSchema } from './tablet.model';

async function createNewTabletService(tabletSchema: TabletSchema): Promise<TabletDocument> {
  try {
    const newTablet = await TabletModel.create(tabletSchema);
    return newTablet;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewTabletService' });
  }
}

async function getQueriedTabletsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<TabletDocument>): DatabaseResponse<TabletDocument> {
  try {
    const tablets = await TabletModel.find(filter, projection, options).lean().exec();
    return tablets;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTabletService' });
  }
}

async function getQueriedTotalTabletsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<TabletDocument>): Promise<number> {
  try {
    const totalTablet = await TabletModel.countDocuments(filter).lean().exec();
    return totalTablet;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalTabletService' });
  }
}

async function getTabletByIdService(
  tabletId: Types.ObjectId | string
): DatabaseResponseNullable<TabletDocument> {
  try {
    const tablet = await TabletModel.findById(tabletId).select('-__v').lean().exec();
    return tablet;
  } catch (error: any) {
    throw new Error(error, { cause: 'getTabletByIdService' });
  }
}

async function updateTabletByIdService({
  fieldsToUpdate,
  tabletId,
}: {
  tabletId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof TabletDocument, TabletDocument[keyof TabletDocument]>;
}): DatabaseResponseNullable<TabletDocument> {
  try {
    const tablet = await TabletModel.findByIdAndUpdate(
      tabletId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return tablet;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateTabletByIdService' });
  }
}

async function deleteAllTabletsService(): Promise<DeleteResult> {
  try {
    const tablets = await TabletModel.deleteMany({}).lean().exec();
    return tablets;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllTabletsService' });
  }
}

async function returnAllTabletsUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const tablets = await TabletModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = tablets.flatMap((tablet) => tablet.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllTabletsUploadedFileIdsService' });
  }
}

async function deleteATabletService(tabletId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const tablet = await TabletModel.deleteOne({ _id: tabletId }).lean().exec();
    return tablet;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteATabletService' });
  }
}

export {
  createNewTabletService,
  getQueriedTabletsService,
  getQueriedTotalTabletsService,
  getTabletByIdService,
  updateTabletByIdService,
  deleteAllTabletsService,
  returnAllTabletsUploadedFileIdsService,
  deleteATabletService,
};
