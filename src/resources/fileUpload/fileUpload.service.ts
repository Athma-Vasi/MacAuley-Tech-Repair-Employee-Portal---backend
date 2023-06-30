import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  AssociatedResourceKind,
  FileExtension,
  FileUploadDocument,
  FileUploadSchema,
} from './fileUpload.model';

import { FileUploadModel } from './fileUpload.model';

type CreateNewFileUploadServiceInput = {
  userId: Types.ObjectId;
  username: string;
  uploadedFile: Express.Multer.File;
  fileName: string;
  fileExtension: FileExtension;
  fileSize: string;
  fileMimeType: string;
  fileEncoding: string;
};

async function createNewFileUploadService(
  newFileUploadObject: CreateNewFileUploadServiceInput
): Promise<FileUploadDocument> {
  try {
    const newFileUpload = await FileUploadModel.create(newFileUploadObject);
    return newFileUpload;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewFileUploadService' });
  }
}

async function getFileUploadById(fileUploadId: Types.ObjectId) {
  try {
    const fileUpload = await FileUploadModel.findById(fileUploadId).lean().exec();
    return fileUpload;
  } catch (error: any) {
    throw new Error(error, { cause: 'getFileUploadById' });
  }
}

type InsertAssociatedResourceDocumentIdServiceInput = CreateNewFileUploadServiceInput & {
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
      .lean()
      .exec();
    return updatedFileUpload;
  } catch (error: any) {
    throw new Error(error, { cause: 'insertAssociatedResourceDocumentIdService' });
  }
}

async function deleteFileUploadService(fileUploadId: Types.ObjectId): Promise<DeleteResult> {
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

async function getAllFileUploadsService(): Promise<Array<FileUploadDocument>> {
  try {
    const fileUploads = await FileUploadModel.find({}).lean().exec();
    return fileUploads;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllFileUploadsService' });
  }
}

export {
  createNewFileUploadService,
  getFileUploadById,
  insertAssociatedResourceDocumentIdService,
  deleteFileUploadService,
  deleteAllFileUploadsService,
  getAllFileUploadsService,
};