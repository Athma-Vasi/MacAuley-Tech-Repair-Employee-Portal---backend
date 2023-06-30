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

export { createNewFileUploadService };
