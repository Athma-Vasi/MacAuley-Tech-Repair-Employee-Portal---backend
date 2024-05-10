import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
  UpdateDocumentByIdServiceInput,
} from "../../../types";
import {
  ComputerCaseDocument,
  ComputerCaseModel,
  ComputerCaseSchema,
} from "./computerCase.model";
import createHttpError from "http-errors";

async function createNewComputerCaseService(
  computerCaseSchema: ComputerCaseSchema
): Promise<ComputerCaseDocument> {
  try {
    const newComputerCase = await ComputerCaseModel.create(computerCaseSchema);
    return newComputerCase;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewComputerCaseService");
  }
}

async function getQueriedComputerCasesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ComputerCaseDocument>): DatabaseResponse<ComputerCaseDocument> {
  try {
    const accessories = await ComputerCaseModel.find(filter, projection, options)
      .lean()
      .exec();
    return accessories;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedComputerCasesService");
  }
}

async function getQueriedTotalComputerCasesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<ComputerCaseDocument>): Promise<number> {
  try {
    const totalComputerCases = await ComputerCaseModel.countDocuments(filter)
      .lean()
      .exec();
    return totalComputerCases;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalComputerCasesService");
  }
}

async function getComputerCaseByIdService(
  computerCaseId: Types.ObjectId | string
): DatabaseResponseNullable<ComputerCaseDocument> {
  try {
    const computerCase = await ComputerCaseModel.findById(computerCaseId)

      .lean()
      .exec();
    return computerCase;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getComputerCaseByIdService");
  }
}

async function updateComputerCaseByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<ComputerCaseDocument>): DatabaseResponseNullable<ComputerCaseDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const computerCase = await ComputerCaseModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return computerCase;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateComputerCaseByIdService");
  }
}

async function deleteAllComputerCasesService(): Promise<DeleteResult> {
  try {
    const accessories = await ComputerCaseModel.deleteMany({}).lean().exec();
    return accessories;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllComputerCasesService");
  }
}

async function returnAllComputerCasesUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const accessories = await ComputerCaseModel.find({})
      .select("uploadedFilesIds")
      .lean()
      .exec();
    const uploadedFileIds = accessories.flatMap(
      (computerCase) => computerCase.uploadedFilesIds
    );
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, {
      cause: "returnAllComputerCasesUploadedFileIdsService",
    });
  }
}

async function deleteAComputerCaseService(
  computerCaseId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const computerCase = await ComputerCaseModel.deleteOne({
      _id: computerCaseId,
    })
      .lean()
      .exec();
    return computerCase;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAComputerCaseService");
  }
}

export {
  createNewComputerCaseService,
  getQueriedComputerCasesService,
  getQueriedTotalComputerCasesService,
  getComputerCaseByIdService,
  updateComputerCaseByIdService,
  deleteAllComputerCasesService,
  returnAllComputerCasesUploadedFileIdsService,
  deleteAComputerCaseService,
};
