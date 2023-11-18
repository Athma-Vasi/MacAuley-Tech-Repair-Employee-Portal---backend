import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { AssociatedResourceKind, FileUploadDocument } from './fileUpload.model';
import type { UserRoles } from '../user';
import { FileInfoObject, GetQueriedResourceRequest } from '../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface RequestAfterFileInfoExtraction extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
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
    sessionId: Types.ObjectId;
    fileUploadId: string;
    associatedDocumentId: Types.ObjectId;
    associatedResource: AssociatedResourceKind;
  };
}

interface DeleteAFileUploadRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    associatedDocumentId: Types.ObjectId;
  };
  params: {
    fileUploadId: string;
  };
}

interface DeleteAllFileUploadsRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
}

type GetAllFileUploadsRequest = GetQueriedResourceRequest;

type GetFileUploadsByUserRequest = GetQueriedResourceRequest;

interface GetFileUploadByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { fileUploadId: string };
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
