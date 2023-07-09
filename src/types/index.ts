import type { FlattenMaps } from 'mongoose';
import { Types } from 'mongoose';
import { FileExtension } from '../resources/fileUpload';

/**
 * these types are used in the database service functions for all resources
 */

type DatabaseResponse<Document> = Promise<
  (FlattenMaps<Document> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
>;
/**
 * where generic type parameter Document is a mongoose document type
 */
type DatabaseResponseNullable<Document> = Promise<
  | (FlattenMaps<Document> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
>;

/**
 * type signature of file object created by express-fileupload
 */
type FileUploadObject = {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
  mv: (path: string, callback: (error: any) => void) => void;
};

/**
 * type signature of file object created after fileInfoExtracter middleware runs
 */
type FileInfoObject = {
  uploadedFile: Buffer;
  fileName: string;
  fileExtension: FileExtension;
  fileSize: number;
  fileMimeType: string;
  fileEncoding: string;
};

export type { DatabaseResponse, DatabaseResponseNullable, FileUploadObject, FileInfoObject };
