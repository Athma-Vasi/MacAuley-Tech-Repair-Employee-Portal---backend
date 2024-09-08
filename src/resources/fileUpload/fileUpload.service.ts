import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type {
  AssociatedResourceKind,
  FileExtension,
  FileUploadDocument,
  FileUploadSchema,
} from "./fileUpload.model";

import { FileUploadModel } from "./fileUpload.model";
import {
  DatabaseResponseResult,
  DatabaseResponseResultNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from "../../types";
import createHttpError from "http-errors";

async function createNewFileUploadService(
  newFileUploadObject: FileUploadSchema,
): Promise<FileUploadDocument> {
  try {
    const newFileUpload = await FileUploadModel.create(newFileUploadObject);
    return newFileUpload;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewFileUploadService");
  }
}

async function getQueriedFileUploadsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<
  FileUploadDocument
>): DatabaseResponseResult<
  FileUploadDocument
> {
  try {
    const fileUploads = await FileUploadModel.find(filter, projection, options)
      .lean()
      .exec();
    return fileUploads;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "getQueriedFileUploadsService",
    );
  }
}

async function getQueriedTotalFileUploadsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<FileUploadDocument>): Promise<
  number
> {
  try {
    const totalFileUploads = await FileUploadModel.countDocuments(filter).lean()
      .exec();
    return totalFileUploads;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "getQueriedTotalFileUploadsService",
    );
  }
}

async function getQueriedFileUploadsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<
  FileUploadDocument
>): DatabaseResponseResult<
  FileUploadDocument
> {
  try {
    const fileUploads = await FileUploadModel.find(filter, projection, options)
      .lean()
      .exec();
    return fileUploads;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "getQueriedFileUploadsByUserService",
    );
  }
}

async function getFileUploadByIdService(
  fileUploadId: Types.ObjectId | string,
): DatabaseResponseResultNullable<FileUploadDocument> {
  try {
    const fileUpload = await FileUploadModel.findById(fileUploadId).lean()
      .exec();
    return fileUpload;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getFileUploadByIdService");
  }
}

async function insertAssociatedResourceDocumentIdService(
  input: FileUploadDocument,
): DatabaseResponseResultNullable<FileUploadDocument> {
  try {
    const updatedFileUpload = await FileUploadModel.findOneAndReplace(
      { _id: input._id },
      input,
      {
        new: true,
      },
    )
      .lean()
      .exec();
    return updatedFileUpload;
  } catch (error: unknown) {
    throw new createHttpError.InternalServerError(
      "insertAssociatedResourceDocumentIdService",
    );
  }
}

async function deleteFileUploadByIdService(
  fileUploadId: string | Types.ObjectId,
): Promise<DeleteResult> {
  try {
    const deleteResult = await FileUploadModel.deleteOne({
      _id: fileUploadId,
    }).exec();
    return deleteResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteFileUploadService");
  }
}

async function deleteAllFileUploadsService(): Promise<DeleteResult> {
  try {
    const deleteResult = await FileUploadModel.deleteMany({}).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "deleteAllFileUploadsService",
    );
  }
}

export {
  createNewFileUploadService,
  deleteAllFileUploadsService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
  getQueriedFileUploadsByUserService,
  getQueriedFileUploadsService,
  getQueriedTotalFileUploadsService,
  insertAssociatedResourceDocumentIdService,
};
