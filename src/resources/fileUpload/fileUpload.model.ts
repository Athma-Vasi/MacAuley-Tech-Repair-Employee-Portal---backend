import { Schema, Types, model } from 'mongoose';
import type { ActionsCompany } from '../actions/company';
import type { ActionsGeneral } from '../actions/general';
import type { ActionsOutreach } from '../actions/outreach';

type FileExtension =
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'pdf'
  | 'docx'
  | 'doc'
  | 'xlsx'
  | 'xls'
  | 'ppt'
  | 'pptx'
  | 'csv'
  | 'txt'
  | 'log';

type AssociatedResourceKind = ActionsCompany | ActionsGeneral | ActionsOutreach | 'user' | 'note';

type FileUploadSchema = {
  userId: Types.ObjectId;
  uploadedFile: Buffer;
  username: string;
  fileExtension: FileExtension;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  fileEncoding: string;
};

type FileUploadDocument = FileUploadSchema & {
  _id: Types.ObjectId;
  // some fileUploads may not be associated with any resource
  associatedResource?: AssociatedResourceKind | undefined;
  // some fileUploads may not be associated with any document
  associatedDocumentId?: Types.ObjectId | undefined;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const fileUploadSchema = new Schema<FileUploadSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
      index: true,
    },
    uploadedFile: {
      type: Buffer,
      required: [true, 'Uploaded file is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },

    fileExtension: {
      type: String,
      required: [true, 'File extension is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    fileMimeType: {
      type: String,
      required: [true, 'File MIME type is required'],
    },
    fileEncoding: {
      type: String,
      required: [true, 'File encoding is required'],
    },
  },
  {
    timestamps: true,
  }
);

const FileUploadModel = model<FileUploadDocument>('FileUpload', fileUploadSchema);

export { FileUploadModel };
export type { FileUploadSchema, FileUploadDocument, FileExtension, AssociatedResourceKind };
