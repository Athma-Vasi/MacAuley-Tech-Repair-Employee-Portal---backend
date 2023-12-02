import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { RMADocument, RMASchema } from "./rma.model";
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";

import { RMAModel } from "./rma.model";

async function createNewRMAService(rmaSchema: RMASchema): Promise<RMADocument> {
  try {
    const rma = await RMAModel.create(rmaSchema);
    return rma;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewRMAService" });
  }
}

async function getAllRMAsService(): DatabaseResponse<RMADocument> {
  try {
    const rmas = await RMAModel.find({})

      .lean()
      .exec();
    return rmas;
  } catch (error: any) {
    throw new Error(error, { cause: "getAllRMAsService" });
  }
}

async function getQueriedRMAsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RMADocument>): DatabaseResponse<RMADocument> {
  try {
    const rmas = await RMAModel.find(filter, projection, options)

      .lean()
      .exec();
    return rmas;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedRMAsService" });
  }
}

async function getQueriedTotalRMAsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<RMADocument>): Promise<number> {
  try {
    const totalRMAs = await RMAModel.countDocuments(filter).lean().exec();
    return totalRMAs;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalRMAsService" });
  }
}

async function getQueriedRMAsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RMADocument>): DatabaseResponse<RMADocument> {
  try {
    const rmas = await RMAModel.find(filter, projection, options)

      .lean()
      .exec();
    return rmas;
  } catch (error: any) {
    throw new Error(error, {
      cause: "getQueriedRMAsByUserService",
    });
  }
}

async function getRMAByIdService(
  rmaId: Types.ObjectId | string
): DatabaseResponseNullable<RMADocument> {
  try {
    const rma = await RMAModel.findById(rmaId)

      .lean()
      .exec();
    return rma;
  } catch (error: any) {
    throw new Error(error, { cause: "getRMAByIdService" });
  }
}

async function updateRMAByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<RMADocument>): DatabaseResponseNullable<RMADocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const rma = await RMAModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return rma;
  } catch (error: any) {
    throw new Error(error, { cause: "updateRMAByIdService" });
  }
}

async function deleteARMAService(rmaId: string | Types.ObjectId): Promise<DeleteResult> {
  try {
    const rma = await RMAModel.deleteOne({
      _id: rmaId,
    })
      .lean()
      .exec();
    return rma;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteARMAService" });
  }
}

async function deleteAllRMAsService(): Promise<DeleteResult> {
  try {
    const rmas = await RMAModel.deleteMany({}).lean().exec();
    return rmas;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllRMAsService" });
  }
}

export {
  createNewRMAService,
  getAllRMAsService,
  getRMAByIdService,
  deleteARMAService,
  deleteAllRMAsService,
  getQueriedRMAsService,
  getQueriedRMAsByUserService,
  getQueriedTotalRMAsService,
  updateRMAByIdService,
};
