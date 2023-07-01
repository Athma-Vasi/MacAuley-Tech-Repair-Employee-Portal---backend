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

async function getFileUploadByIdService(fileUploadId: Types.ObjectId) {
  try {
    const fileUpload = await FileUploadModel.findById(fileUploadId).lean().exec();
    return fileUpload;
  } catch (error: any) {
    throw new Error(error, { cause: 'getFileUploadByIdService' });
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

async function deleteFileUploadByIdService(fileUploadId: Types.ObjectId): Promise<DeleteResult> {
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

async function getAllFileUploadsService(): Promise<Array<FileUploadDocument>> {
  try {
    const fileUploads = await FileUploadModel.find({}).lean().exec();
    return fileUploads;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllFileUploadsService' });
  }
}

async function getFileUploadsByUserService(
  userId: Types.ObjectId
): Promise<Array<FileUploadDocument>> {
  try {
    const fileUploads = await FileUploadModel.find({ userId }).lean().exec();
    return fileUploads;
  } catch (error: any) {
    throw new Error(error, { cause: 'getFileUploadsByUserService' });
  }
}

export {
  createNewFileUploadService,
  getFileUploadByIdService,
  insertAssociatedResourceDocumentIdService,
  deleteFileUploadByIdService,
  deleteAllFileUploadsService,
  getAllFileUploadsService,
  getFileUploadsByUserService,
  deleteAllFileUploadsByAssociatedResourceService,
};
