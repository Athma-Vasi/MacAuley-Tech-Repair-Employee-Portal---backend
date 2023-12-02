import type { FilterQuery, FlattenMaps, QueryOptions } from "mongoose";
import { Types } from "mongoose";
import { FileExtension } from "../resources/fileUpload";
import type { ParsedQs } from "qs";
import { RequestAfterJWTVerification } from "../resources/auth";
import { UserRoles } from "../resources/user";

/**
 * - where generic type parameter Document = ${resource}Schema & {_id, createdAt, updatedAt, __v}
 * - used in service functions that call ${Model}.find() functions
 */
type DatabaseResponse<Document extends Record<string, any> = Record<string, any>> =
  Promise<
    (FlattenMaps<Document> &
      Required<{
        _id: Types.ObjectId;
      }>)[]
  >;

/**
 * - where generic type parameter Document = ${resource}Schema & {_id, createdAt, updatedAt, __v}
 * - used in sevice functions that call ${Model}.findOne() or ${Model}.findById() functions
 */
type DatabaseResponseNullable<
  Document extends Record<string, any> = Record<string, any>
> = Promise<
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
 * - Type signature of query object created after assignQueryDefaults middleware runs
 * - Object passed to ${Model}.find() functions for GET queried resources service functions (excepting get${resource}ByIdService)
 */
type QueryObjectParsedWithDefaults = {
  filter: Record<string, string | number | boolean | Record<string, any>>;
  projection: string | string[] | Record<string, any>;
  options: Record<string, string | number | boolean | Record<string, any>>;
};

interface GetQueriedResourceRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId; // added by verifyJWTMiddleware
    // below are added by the assignQueryDefaults middleware
    // if its a brand new query, get total number of documents that match the query options and filter
    // a performance optimization at an acceptable cost in accuracy as the actual number of documents may change between new queries
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: QueryObjectParsed;
}

interface GetQueriedResourceByUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId; // added by verifyJWTMiddleware
    userToBeQueriedId: Types.ObjectId; // id of the actual user to be queried (may be different from the user making the request)
    // below are added by the assignQueryDefaults middleware
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
type QueriedResourceGetRequestServiceInput<
  Document extends Record<string, any> = Record<string, any>
> = {
  filter?: FilterQuery<Document> | undefined;
  projection?: QueryOptions<Document> | null | undefined;
  options?: QueryOptions<Document> | undefined;
};

/**
 * - This type is used to get rid of the projection and options params in the getQueried${resource}Service functions.
 * - The service function counts the total number of documents that match the filter params and returns the totalDocuments count.
 */
type QueriedTotalResourceGetRequestServiceInput<
  Document extends Record<string, any> = Record<string, any>
> = Omit<QueriedResourceGetRequestServiceInput<Document>, "projection" | "options">;

/**
 * - Default server response type for all requests for single documents fetched by _id.
 * - Awaited<DatabaseResponse<Document>> is used to get rid of the Promise<> wrapper around the response.
 */
type ResourceRequestServerResponse<
  Document extends Record<string, any> = Record<string, any>,
  OmitFields extends keyof Document = keyof Document
> = {
  message: string;
  // resourceData: Array<Omit<Document, OmitFields>>;
  //   resourceData: (FlattenMaps<Omit<Document, OmitFields>> &
  //     Required<{
  //       _id: Types.ObjectId;
  //     }>)[];
  resourceData: Awaited<DatabaseResponse<Omit<Document, OmitFields>>>;
};

/**
 * - Default server response type for GET requests for multiple documents fetched with filter, projection, options params
 * - Typically from requests generated by QueryBuilder component in the frontend (which contains filter, sort, projection & search functionalities)
 */
type GetQueriedResourceRequestServerResponse<
  Document extends Record<string, any> = Record<string, any>,
  OmitFields extends keyof Document = keyof Document
> = ResourceRequestServerResponse<Document, OmitFields> & {
  pages: number;
  totalDocuments: number;
};

type RequestStatus = "pending" | "approved" | "rejected";

/**
 * - Used in the PATCH request body field: 'documentUpdate'.
 * - Shared with frontend to ensure that the request body contains correct data shape.
 */
type DocumentUpdateOperation<
  Document extends Record<Key, unknown>,
  Key extends keyof Document = keyof Document
> =
  | DocumentFieldUpdateOperation<Document, Key>
  | DocumentArrayUpdateOperation<Document, Key>;

type FieldOperators =
  | "$currentDate"
  | "$inc"
  | "$min"
  | "$max"
  | "$mul"
  | "$rename"
  | "$set"
  | "$setOnInsert"
  | "$unset";

type DocumentFieldUpdateOperation<
  Document extends Record<Key, unknown>,
  Key extends keyof Document = keyof Document
> = {
  updateKind: "field";
  updateOperator: FieldOperators;
  fields: Record<Key, unknown>;
};

type ArrayOperators = "$addToSet" | "$pop" | "$pull" | "$push" | "$pullAll";

type DocumentArrayUpdateOperation<
  Document extends Record<Key, Value>,
  Key extends keyof Document = keyof Document,
  Value extends Document[Key] = Document[Key]
> = {
  updateKind: "array";
  updateOperator: ArrayOperators;
  fields: Record<Key, Value>;
};

/**
 * - Used in the update${resource}ByIdService function for all resources.
 * - Shared with frontend to ensure that the request body contains correct data shape.
 */
type UpdateDocumentByIdServiceInput<
  Document extends Record<Key, unknown>,
  Key extends keyof Document = keyof Document
> = {
  _id: Types.ObjectId | string;
  fields: Record<Key, unknown>;
  updateOperator: FieldOperators | ArrayOperators;
};

export type {
  ArrayOperators,
  DatabaseResponse,
  DatabaseResponseNullable,
  DocumentUpdateOperation,
  FieldOperators,
  FileInfoObject,
  FileUploadObject,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
  GetQueriedResourceRequestServerResponse,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  QueryObjectParsed,
  QueryObjectParsedWithDefaults,
  RequestStatus,
  ResourceRequestServerResponse,
  UpdateDocumentByIdServiceInput,
};
