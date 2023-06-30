import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { AssociatedResourceKind, FileExtension, FileUploadDocument } from './fileUpload.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewFileUploadRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    fileUpload: {
      associatedDocumentId: Types.ObjectId;
      associatedResource: AssociatedResourceKind;
      uploadedFile: Express.Multer.File;
      fileExtension: FileExtension;
      fileName: string;
      fileSize: number;
      fileMimeType: string;
      fileEncoding: string;
    };
  };
}

interface DeleteAFileUploadRequest extends RequestAfterJWTVerification {
  params: {
    fileUploadId: Types.ObjectId;
  };
}

type DeleteAllFileUploadsRequest = RequestAfterJWTVerification;

type GetAllFileUploadsRequest = RequestAfterJWTVerification;

type GetFileUploadsByUserRequest = RequestAfterJWTVerification;

interface GetFileUploadByIdRequest extends RequestAfterJWTVerification {
  params: { fileUploadId: Types.ObjectId };
}

type FileUploadServerResponse = {
  message: string;
  fileUploadData: Array<FileUploadDocument>;
};

export type {
  CreateNewFileUploadRequest,
  DeleteAFileUploadRequest,
  DeleteAllFileUploadsRequest,
  GetAllFileUploadsRequest,
  GetFileUploadsByUserRequest,
  GetFileUploadByIdRequest,
  FileUploadServerResponse,
};
