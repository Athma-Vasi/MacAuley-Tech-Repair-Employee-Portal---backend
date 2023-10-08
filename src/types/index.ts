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
    sessionId: Types.ObjectId;
    // these are added by the assignQueryDefaults middleware
    // if its a brand new query, get total number of documents that match the query options and filter
    // a performance optimization at an acceptable cost in accuracy as the actual number of documents may change between new queries
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: QueryObjectParsed;
}

/**
 * Used in the getQueried${resource}Service default GET request service functions for all resources.
 */
type QueriedResourceGetRequestServiceInput<Document> = {
  filter?: FilterQuery<Document> | undefined;
  projection?: QueryOptions<Document> | null | undefined;
  options?: QueryOptions<Document> | undefined;
};

/**
 * Used in the getQueriedTotal${resource}Service functions for all resources.
 */
type QueriedTotalResourceGetRequestServiceInput<Document> = Omit<
  QueriedResourceGetRequestServiceInput<Document>,
  'projection' | 'options'
>;

/**
 * Default server response type for all (except GET) REST API requests
 */
type ResourceRequestServerResponse<Document> = {
  message: string;
  resourceData: Array<Omit<Document, '__v'>>;
};

/**
 * Default server response type for GET REST API requests with query parameters
 */
type GetQueriedResourceRequestServerResponse<Document> = {
  message: string;
  pages: number;
  totalDocuments: number;
  resourceData: Array<Partial<Document>>;
};

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
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  ResourceRequestServerResponse,
  GetQueriedResourceRequestServerResponse,
};
