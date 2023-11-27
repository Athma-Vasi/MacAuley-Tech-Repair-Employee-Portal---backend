import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { PurchaseOnlineDocument, PurchaseOnlineSchema } from './purchaseOnline.model';
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../../types';

import { PurchaseOnlineModel } from './purchaseOnline.model';

async function createNewPurchaseOnlineService(
  purchaseOnlineSchema: PurchaseOnlineSchema
): Promise<PurchaseOnlineDocument> {
  try {
    const purchaseOnline = await PurchaseOnlineModel.create(purchaseOnlineSchema);
    return purchaseOnline;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewPurchaseOnlineService' });
  }
}

async function getAllPurchasesOnlineService(): DatabaseResponse<PurchaseOnlineDocument> {
  try {
    const purchaseOnlines = await PurchaseOnlineModel.find({})
      .select(['-__v', '-paymentInformation'])
      .lean()
      .exec();
    return purchaseOnlines;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllPurchasesOnlineService' });
  }
}

async function getQueriedPurchaseOnlinesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PurchaseOnlineDocument>): DatabaseResponse<PurchaseOnlineDocument> {
  try {
    const purchaseOnlines = await PurchaseOnlineModel.find(filter, projection, options)
      .select(['-__v', '-paymentInformation'])
      .lean()
      .exec();
    return purchaseOnlines;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedPurchaseOnlinesService' });
  }
}

async function getQueriedTotalPurchaseOnlinesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<PurchaseOnlineDocument>): Promise<number> {
  try {
    const totalPurchaseOnlines = await PurchaseOnlineModel.countDocuments(filter).lean().exec();
    return totalPurchaseOnlines;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalPurchaseOnlinesService' });
  }
}

async function getQueriedPurchaseOnlinesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PurchaseOnlineDocument>): DatabaseResponse<PurchaseOnlineDocument> {
  try {
    const purchaseOnlines = await PurchaseOnlineModel.find(filter, projection, options)
      .select(['-__v', '-paymentInformation'])
      .lean()
      .exec();
    return purchaseOnlines;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedPurchaseOnlinesByUserService' });
  }
}

async function getPurchaseOnlineByIdService(
  purchaseOnlineId: Types.ObjectId | string
): DatabaseResponseNullable<PurchaseOnlineDocument> {
  try {
    const purchaseOnline = await PurchaseOnlineModel.findById(purchaseOnlineId)
      .select(['-__v', '-paymentInformation'])
      .lean()
      .exec();
    return purchaseOnline;
  } catch (error: any) {
    throw new Error(error, { cause: 'getPurchaseOnlineByIdService' });
  }
}

async function updatePurchaseOnlineByIdService({
  purchaseOnlineId,
  purchaseOnlineFields,
}: {
  purchaseOnlineId: Types.ObjectId | string;
  purchaseOnlineFields: Partial<PurchaseOnlineSchema>;
}): DatabaseResponseNullable<PurchaseOnlineDocument> {
  try {
    const purchaseOnline = await PurchaseOnlineModel.findByIdAndUpdate(
      purchaseOnlineId,
      { ...purchaseOnlineFields },
      { new: true }
    )
      .select(['-__v', '-paymentInformation'])
      .lean()
      .exec();
    return purchaseOnline;
  } catch (error: any) {
    throw new Error(error, { cause: 'updatePurchaseOnlineByIdService' });
  }
}

async function deleteAPurchaseOnlineService(purchaseOnlineId: string): Promise<DeleteResult> {
  try {
    const purchaseOnline = await PurchaseOnlineModel.deleteOne({ _id: purchaseOnlineId })
      .lean()
      .exec();
    return purchaseOnline;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAPurchaseOnlineService' });
  }
}

async function deleteAllPurchaseOnlinesService(): Promise<DeleteResult> {
  try {
    const purchaseOnlines = await PurchaseOnlineModel.deleteMany({}).lean().exec();
    return purchaseOnlines;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllPurchaseOnlinesService' });
  }
}

export {
  createNewPurchaseOnlineService,
  getAllPurchasesOnlineService,
  getPurchaseOnlineByIdService,
  deleteAPurchaseOnlineService,
  deleteAllPurchaseOnlinesService,
  getQueriedPurchaseOnlinesService,
  getQueriedPurchaseOnlinesByUserService,
  getQueriedTotalPurchaseOnlinesService,
  updatePurchaseOnlineByIdService,
};
