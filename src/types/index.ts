import type { FilterQuery, FlattenMaps, QueryOptions } from 'mongoose';
import { Types } from 'mongoose';
import { FileExtension } from '../resources/fileUpload';
import type { ParsedQs } from 'qs';
import { RequestAfterJWTVerification } from '../resources/auth';
import { UserRoles } from '../resources/user';
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

/**
 * type signature of query object created by express
 */
type QueryObjectParsed = {
  [x: string]: string | ParsedQs | string[] | ParsedQs[] | undefined;
};

/**
 * type signature of query object created after assignQueryDefaults middleware runs
 */
type QueryObjectParsedWithDefaults = {
  filter: Record<string, string | number | boolean | Object>;
  projection: string | string[] | Object;
  options: Record<string, string | number | boolean | Object>;
};

interface GetQueriedResourceRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: QueryObjectParsed;
}

type GetQueriedResourceRequestsServiceInput<Document> = {
  filter?: FilterQuery<Document> | undefined;
  projection?: QueryOptions<Document> | null | undefined;
  options?: QueryOptions<Document> | undefined;
};

type GetQueriedTotalResourceRequestsServiceInput<Document> = Omit<
  GetQueriedResourceRequestsServiceInput<Document>,
  'projection' & 'options'
>;

type RequestStatus = 'pending' | 'approved' | 'rejected';

export type {
  DatabaseResponse,
  DatabaseResponseNullable,
  FileUploadObject,
  FileInfoObject,
  QueryObjectParsed,
  QueryObjectParsedWithDefaults,
  RequestStatus,
  GetQueriedResourceRequest,
  GetQueriedResourceRequestsServiceInput,
  GetQueriedTotalResourceRequestsServiceInput,
};
