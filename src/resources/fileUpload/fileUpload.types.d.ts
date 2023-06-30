import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { AssociatedResourceKind, FileExtension, FileUploadDocument } from './fileUpload.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface RequestAfterFileInfoExtraction extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    fileUploads: Array<{
      uploadedFile: Express.Multer.File;
      fileName: string;
      fileExtension: FileExtension;
      fileSize: string;
      fileMimeType: string;
      fileEncoding: string;
    }>;
  };
}

type CreateNewFileUploadRequest = RequestAfterJWTVerification;

interface InsertAssociatedDocumentIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    fileUploadId: Types.ObjectId;
    associatedDocumentId: Types.ObjectId;
    associatedResource: AssociatedResourceKind;
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
  documentId?: Types.ObjectId | undefined;
};

export type {
  CreateNewFileUploadRequest,
  InsertAssociatedDocumentIdRequest,
  DeleteAFileUploadRequest,
  DeleteAllFileUploadsRequest,
  GetAllFileUploadsRequest,
  GetFileUploadsByUserRequest,
  GetFileUploadByIdRequest,
  FileUploadServerResponse,
};
