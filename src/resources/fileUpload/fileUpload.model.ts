import { Schema, Types, model } from 'mongoose';

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

type AssociatedResourceKind = 'Expense Claim';

type FileUploadSchema = {
  userId: Types.ObjectId;
  associatedDocumentId: Types.ObjectId;
  uploadedFile: Express.Multer.File;
  username: string;
  associatedResource: AssociatedResourceKind;
  fileExtension: FileExtension;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  fileEncoding: string;
};

type FileUploadDocument = FileUploadSchema & {
  _id: Types.ObjectId;
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
    associatedDocumentId: {
      type: Schema.Types.ObjectId,
      // in this API, no files are uploaded by themselves, all are associated with a document
      required: [true, 'Associated document Id is required'],
      index: true,
    },
    uploadedFile: {
      type: Object, // Express.Multer.File
      required: [true, 'Uploaded file is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      index: true,
    },
    associatedResource: {
      type: String,
      required: [true, 'Associated resource is required'],
      index: true, // optimizes query for all files associated with a particular resource
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
