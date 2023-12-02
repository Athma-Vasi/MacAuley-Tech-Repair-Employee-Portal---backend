import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { PurchaseDocument, PurchaseSchema } from "./purchase.model";
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";

import { PurchaseModel } from "./purchase.model";

async function createNewPurchaseService(
  purchaseSchema: PurchaseSchema
): Promise<PurchaseDocument> {
  try {
    const purchase = await PurchaseModel.create(purchaseSchema);
    return purchase;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewPurchaseService" });
  }
}

async function getAllPurchasesService(): DatabaseResponse<PurchaseDocument> {
  try {
    const purchases = await PurchaseModel.find({})

      .lean()
      .exec();
    return purchases;
  } catch (error: any) {
    throw new Error(error, { cause: "getAllPurchasesService" });
  }
}

async function getQueriedPurchasesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PurchaseDocument>): DatabaseResponse<PurchaseDocument> {
  try {
    const purchases = await PurchaseModel.find(filter, projection, options)

      .lean()
      .exec();
    return purchases;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedPurchasesService" });
  }
}

async function getQueriedTotalPurchasesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<PurchaseDocument>): Promise<number> {
  try {
    const totalPurchases = await PurchaseModel.countDocuments(filter).lean().exec();
    return totalPurchases;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalPurchasesService" });
  }
}

async function getQueriedPurchasesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PurchaseDocument>): DatabaseResponse<PurchaseDocument> {
  try {
    const purchases = await PurchaseModel.find(filter, projection, options)

      .lean()
      .exec();
    return purchases;
  } catch (error: any) {
    throw new Error(error, {
      cause: "getQueriedPurchasesByUserService",
    });
  }
}

async function getPurchaseByIdService(
  purchaseId: Types.ObjectId | string
): DatabaseResponseNullable<PurchaseDocument> {
  try {
    const purchase = await PurchaseModel.findById(purchaseId)

      .lean()
      .exec();
    return purchase;
  } catch (error: any) {
    throw new Error(error, { cause: "getPurchaseByIdService" });
  }
}

async function updatePurchaseByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<PurchaseDocument>): DatabaseResponseNullable<PurchaseDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const purchase = await PurchaseModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return purchase;
  } catch (error: any) {
    throw new Error(error, { cause: "updatePurchaseByIdService" });
  }
}

async function deleteAPurchaseService(
  purchaseId: string | Types.ObjectId
): Promise<DeleteResult> {
  try {
    const purchase = await PurchaseModel.deleteOne({
      _id: purchaseId,
    })
      .lean()
      .exec();
    return purchase;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAPurchaseService" });
  }
}

async function deleteAllPurchasesService(): Promise<DeleteResult> {
  try {
    const purchases = await PurchaseModel.deleteMany({}).lean().exec();
    return purchases;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllPurchasesService" });
  }
}

export {
  createNewPurchaseService,
  getAllPurchasesService,
  getPurchaseByIdService,
  deleteAPurchaseService,
  deleteAllPurchasesService,
  getQueriedPurchasesService,
  getQueriedPurchasesByUserService,
  getQueriedTotalPurchasesService,
  updatePurchaseByIdService,
};
