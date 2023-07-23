import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  AssociatedResourceKind,
  FileExtension,
  FileUploadDocument,
  FileUploadSchema,
} from './fileUpload.model';

import { FileUploadModel } from './fileUpload.model';
import {
  DatabaseResponse,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../types';

async function createNewFileUploadService(
  newFileUploadObject: FileUploadSchema
): Promise<FileUploadDocument> {
  try {
    const newFileUpload = await FileUploadModel.create(newFileUploadObject);
    return newFileUpload;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewFileUploadService' });
  }
}

async function getQueriedFileUploadsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<FileUploadDocument>): DatabaseResponse<FileUploadDocument> {
  try {
    const fileUploads = await FileUploadModel.find(filter, projection, options).lean().exec();
    return fileUploads;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedFileUploadsService' });
  }
}

async function getQueriedTotalFileUploadsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<FileUploadDocument>): Promise<number> {
  try {
    const totalFileUploads = await FileUploadModel.countDocuments(filter).lean().exec();
    return totalFileUploads;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalFileUploadsService' });
  }
}

async function getQueriedFileUploadsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<FileUploadDocument>): DatabaseResponse<FileUploadDocument> {
  try {
    const fileUploads = await FileUploadModel.find(filter, projection, options).lean().exec();
    return fileUploads;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedFileUploadsByUserService' });
  }
}

async function getFileUploadByIdService(fileUploadId: Types.ObjectId | string) {
  try {
    const fileUpload = await FileUploadModel.findById(fileUploadId).lean().exec();
    return fileUpload;
  } catch (error: any) {
    throw new Error(error, { cause: 'getFileUploadByIdService' });
  }
}

type InsertAssociatedResourceDocumentIdServiceInput = {
  userId: Types.ObjectId;
  username: string;
  uploadedFile: Buffer;
  fileName: string;
  fileExtension: FileExtension;
  fileSize: number;
  fileMimeType: string;
  fileEncoding: string;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  associatedDocumentId: Types.ObjectId;
  associatedResource: AssociatedResourceKind;
  __v: number;
};

async function insertAssociatedResourceDocumentIdService(
  input: InsertAssociatedResourceDocumentIdServiceInput
) {
  try {
    const updatedFileUpload = await FileUploadModel.findOneAndReplace({ _id: input._id }, input, {
      new: true,
    })
      .select('-__v')
      .lean()
      .exec();
    return updatedFileUpload;
  } catch (error: any) {
    throw new Error(error, { cause: 'insertAssociatedResourceDocumentIdService' });
  }
}

async function deleteFileUploadByIdService(
  fileUploadId: string | Types.ObjectId
): Promise<DeleteResult> {
  try {
    const deleteResult = await FileUploadModel.deleteOne({ _id: fileUploadId }).exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteFileUploadService' });
  }
}

async function deleteAllFileUploadsService(): Promise<DeleteResult> {
  try {
    const deleteResult = await FileUploadModel.deleteMany({}).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllFileUploadsService' });
  }
}

async function deleteAllFileUploadsByAssociatedResourceService(
  associatedResource: AssociatedResourceKind
): Promise<DeleteResult> {
  try {
    const deleteResult = await FileUploadModel.deleteMany({ associatedResource }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllFileUploadsByAssociatedResourceService' });
  }
}

export {
  createNewFileUploadService,
  getFileUploadByIdService,
  insertAssociatedResourceDocumentIdService,
  deleteFileUploadByIdService,
  deleteAllFileUploadsService,
  getQueriedFileUploadsService,
  getQueriedTotalFileUploadsService,
  getQueriedFileUploadsByUserService,
  deleteAllFileUploadsByAssociatedResourceService,
};
