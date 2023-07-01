import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { AssociatedResourceKind, FileExtension, FileUploadDocument } from './fileUpload.model';
import type { UserRoles } from '../user';
import { FileInfoObject, FileUploadObject } from '../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface RequestAfterFileInfoExtraction extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    fileUploads: Array<FileInfoObject>;
  };
}

type CreateNewFileUploadRequest = RequestAfterFileInfoExtraction;

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

interface DeleteAllFileUploadsRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
}

type GetAllFileUploadsRequest = RequestAfterJWTVerification;

interface GetFileUploadsByUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
}

interface GetFileUploadByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { fileUploadId: Types.ObjectId };
}

type FileUploadServerResponse = {
  message: string;
  documentId?: Types.ObjectId | undefined;
  fileUploads?: Array<FileUploadDocument> | undefined;
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
