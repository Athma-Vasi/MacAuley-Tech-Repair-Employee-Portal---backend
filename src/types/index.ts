import type {
  FilterQuery,
  FlattenMaps,
  QueryOptions,
  Require_id,
} from "mongoose";
import { Types } from "mongoose";
import { FileExtension } from "../resources/fileUpload";
import type { ParsedQs } from "qs";
import { UserRoles } from "../resources/user";
import { Request, Response } from "express";
import { ErrImpl, OkImpl } from "ts-results";

/**
 * type signature of query object created by express
 */
type QueryObjectParsed = {
  [x: string]: string | ParsedQs | string[] | ParsedQs[] | undefined;
};

/**
 * - Type signature of query object created after assignQueryDefaults middleware runs
 * - passed to ${Model}.find() functions for GET queried resources service functions (excepting get${resource}ByIdService)
 */
type QueryObjectParsedWithDefaults<
  Doc extends Record<string, unknown> = Record<string, unknown>,
> = {
  filter?: FilterQuery<Doc>;
  projection?: QueryOptions<Doc> | null;
  options?: QueryOptions<Doc>;
};

/**
 * - adds the decoded JWT (which is the userInfo object) from verifyJWTMiddleware to the request body.
 * - All routes' (except user, customer registration POST) subsequent middleware and controller functions will have access to the decoded JWT.
 */
type RequestAfterJWTVerification = Request & {
  body: {
    userInfo: {
      userId: string;
      username: string;
      roles: UserRoles;
    };
    sessionId: string;
  };
};

/**
 * - shape of the Express Request object after assignQueryDefaults middleware runs.
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
  Schema extends Record<string, unknown> = Record<string, unknown>,
> = RequestAfterQueryParsing & {
  body: {
    schema: Schema;
  };
};

type GetResourceByIdRequest = RequestAfterQueryParsing & {
  params: {
    resourceId: string;
  };
};

type GetResourceByFieldRequest = RequestAfterQueryParsing & {
  body: {
    fields: Record<string, unknown>;
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
  Doc extends Record<string, unknown> = Record<string, unknown>,
> = Promise<
  | OkImpl<HttpResult<Require_id<FlattenMaps<Doc>>>>
  | ErrImpl<HttpResult<unknown>>
>;

type HttpServerResponse<Data = unknown> = Response<
  Awaited<HttpResult<Require_id<FlattenMaps<Data>>>>
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
  CreateNewResourceRequest,
  DatabaseResponse,
  DeleteAllResourcesRequest,
  DeleteResourceRequest,
  DocumentUpdateOperation,
  FieldOperators,
  FileInfoObject,
  FileUploadObject,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
  GetResourceByFieldRequest,
  GetResourceByIdRequest,
  HttpResult,
  HttpServerResponse,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  QueryObjectParsed,
  QueryObjectParsedWithDefaults,
  RequestAfterQueryParsing,
  RequestStatus,
  UpdateDocumentByIdServiceInput,
  UpdateResourceByIdRequest,
};
