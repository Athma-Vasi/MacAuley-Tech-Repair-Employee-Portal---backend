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
            fileExtension: FileExtension;
            fileName: string;
            fileSize: number;
            fileMimeType: string;
            fileEncoding: string;
        };
