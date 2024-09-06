import type { FilterQuery, FlattenMaps, QueryOptions } from "mongoose";
import { Types } from "mongoose";
import { FileExtension } from "../resources/fileUpload";
import type { ParsedQs } from "qs";
import { RequestAfterJWTVerification } from "../resources/auth";

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
type QueryObjectParsedWithDefaults<
  Doc extends Record<string, unknown> = Record<string, unknown>,
> = {
  filter?: FilterQuery<Doc>;
  projection?: QueryOptions<Doc> | null;
  options?: QueryOptions<Doc>;
};

/**
 * - It is the shape of the Express Request object after assignQueryDefaults middleware runs.
 * - verifyJWTMiddleware => verifyRoles => assignQueryDefaults => controller function
 * - Typically used in GET requests (all requests routes for some resources).
 * - Query object fields are used in service functions: ${resource}Model.find(filter, projection, options) method.
 */
type RequestAfterQueryParsing = RequestAfterJWTVerification & {
  body: {
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: QueryObjectParsedWithDefaults;
};

type CreateNewResourceRequest<
  Resource extends Record<string, unknown> = Record<string, unknown>,
> = RequestAfterQueryParsing & {
  schema: Omit<Resource, "userId" | "username">;
};

type GetResourceByIdRequest = RequestAfterQueryParsing & {
  params: {
    resourceId: string;
  };
};

type UpdateResourceByIdRequest<
  Resource extends Record<string, unknown> = Record<string, unknown>,
> = RequestAfterQueryParsing & {
  body: {
    documentUpdate: DocumentUpdateOperation<Resource>;
  };
  params: {
    resourceId: string;
  };
};

type DeleteResourceRequest = GetResourceByIdRequest;

type DeleteAllResourcesRequest = RequestAfterQueryParsing;

type GetQueriedResourceRequest = RequestAfterQueryParsing;

type GetQueriedResourceByUserRequest = GetQueriedResourceRequest & {
  body: {
    userToBeQueriedId: Types.ObjectId;
  };
};

type HttpResult<Data = unknown> = {
  data: Array<Data>;
  kind: "error" | "success";
  message: string;
  pages: number;
  status: number;
  totalDocuments: number;
  triggerLogout: boolean;
};

/**
 * - where generic type parameter Document = ${resource}Schema & {_id, createdAt, updatedAt, __v}
 * - used in service functions that call ${Model}.find() functions
 */
type DatabaseResponse<
  Document extends Record<string, unknown> = Record<string, unknown>,
> = Promise<
  (
    & FlattenMaps<Document>
    & Required<{
      _id: Types.ObjectId;
    }>
  )[]
>;

/**
 * - where generic type parameter Document = ${resource}Schema & {_id, createdAt, updatedAt, __v}
 * - used in service functions that call ${Model}.findOne() or ${Model}.findById() functions
 */
type DatabaseResponseNullable<
  Document extends Record<string, unknown> = Record<string, unknown>,
> = Promise<
  | (
    & FlattenMaps<Document>
    & Required<{
      _id: Types.ObjectId;
    }>
  )
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
  mv: (path: string, callback: (error: unknown) => void) => void;
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
 * Used in the getQueried${resource}Service default GET request service functions for all resources.
 */
type QueriedResourceGetRequestServiceInput<
  Document extends Record<string, unknown> = Record<string, unknown>,
> = {
  filter?: FilterQuery<Document>;
  projection?: QueryOptions<Document> | null;
  options?: QueryOptions<Document>;
};

/**
 * - This type is used to get rid of the projection and options params in the getQueried${resource}Service functions.
 * - The service function counts the total number of documents that match the filter params and returns the totalDocuments count.
 */
type QueriedTotalResourceGetRequestServiceInput<
  Document extends Record<string, unknown> = Record<string, unknown>,
> = Omit<
  QueriedResourceGetRequestServiceInput<Document>,
  "projection" | "options"
>;

/**
 * - Default server response type for all requests for a single document fetched by _id.
 * - Awaited<DatabaseResponse<Document>> is used to get rid of the Promise<> wrapper around the response.
 */
type ResourceRequestServerResponse<
  Document extends Record<string, unknown> = Record<string, unknown>,
  OmitFields extends keyof Document = keyof Document,
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
 * - Default server response type for GET requests for multiple documents fetched with query params
 * - Typically from requests generated by QueryBuilder component in the frontend (which contains filter, sort, projection & search functionalities)
 */
type GetQueriedResourceRequestServerResponse<
  Document extends Record<string, unknown> = Record<string, unknown>,
  OmitFields extends keyof Document = keyof Document,
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
  Key extends keyof Document = keyof Document,
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
  Key extends keyof Document = keyof Document,
> = {
  updateKind: "field";
  updateOperator: FieldOperators;
  fields: Record<Key, unknown>;
};

type ArrayOperators = "$addToSet" | "$pop" | "$pull" | "$push" | "$pullAll";

type DocumentArrayUpdateOperation<
  Document extends Record<Key, Value>,
  Key extends keyof Document = keyof Document,
  Value extends Document[Key] = Document[Key],
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
  Key extends keyof Document = keyof Document,
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
  HttpResult,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  QueryObjectParsed,
  QueryObjectParsedWithDefaults,
  RequestStatus,
  ResourceRequestServerResponse,
  UpdateDocumentByIdServiceInput,
};
