/**
 * This barrel file is used to import/export anonymousRequest model, router, types, handlers and services
 */

/**
 * Imports
 */
import { AnonymousRequestModel } from "./anonymousRequest.model";
import { anonymousRequestRouter } from "./anonymousRequest.routes";
import {
  createNewAnonymousRequestHandler,
  createNewAnonymousRequestsBulkHandler,
  deleteAllAnonymousRequestsHandler,
  deleteAnonymousRequestHandler,
  getAnonymousRequestByIdHandler,
  getAnonymousRequestsByUserHandler,
  getQueriedAnonymousRequestsHandler,
  updateAnonymousRequestByIdHandler,
  updateAnonymousRequestsBulkHandler,
} from "./anonymousRequest.controller";
import {
  createNewAnonymousRequestService,
  deleteAllAnonymousRequestsService,
  deleteAnonymousRequestByIdService,
  getAnonymousRequestByIdService,
  getQueriedAnonymousRequestsByUserService,
  getQueriedAnonymousRequestsService,
  getQueriedTotalAnonymousRequestsService,
  updateAnonymousRequestByIdService,
} from "./anonymousRequest.service";

import type {
  AnonymousRequestDocument,
  AnonymousRequestSchema,
  AnonymousRequestKind,
  Urgency,
} from "./anonymousRequest.model";
import type {
  CreateNewAnonymousRequestRequest,
  CreateNewAnonymousRequestsBulkRequest,
  DeleteAllAnonymousRequestsRequest,
  DeleteAnonymousRequestRequest,
  GetAnonymousRequestByIdRequest,
  GetQueriedAnonymousRequestsByUserRequest,
  GetQueriedAnonymousRequestsRequest,
  UpdateAnonymousRequestByIdRequest,
  UpdateAnonymousRequestsBulkRequest,
} from "./anonymousRequest.types";

/**
 * Exports
 */
export {
  AnonymousRequestModel,
  anonymousRequestRouter,
  createNewAnonymousRequestHandler,
  createNewAnonymousRequestService,
  createNewAnonymousRequestsBulkHandler,
  deleteAllAnonymousRequestsHandler,
  deleteAllAnonymousRequestsService,
  deleteAnonymousRequestHandler,
  deleteAnonymousRequestByIdService,
  getAnonymousRequestByIdHandler,
  getAnonymousRequestByIdService,
  getAnonymousRequestsByUserHandler,
  getQueriedAnonymousRequestsByUserService,
  getQueriedAnonymousRequestsHandler,
  getQueriedAnonymousRequestsService,
  getQueriedTotalAnonymousRequestsService,
  updateAnonymousRequestByIdService,
  updateAnonymousRequestByIdHandler,
  updateAnonymousRequestsBulkHandler,
};

export type {
  AnonymousRequestDocument,
  AnonymousRequestSchema,
  AnonymousRequestKind,
  Urgency,
  CreateNewAnonymousRequestRequest,
  DeleteAnonymousRequestRequest,
  DeleteAllAnonymousRequestsRequest,
  GetQueriedAnonymousRequestsByUserRequest,
  GetAnonymousRequestByIdRequest,
  GetQueriedAnonymousRequestsRequest,
  UpdateAnonymousRequestByIdRequest,
  UpdateAnonymousRequestsBulkRequest,
  CreateNewAnonymousRequestsBulkRequest,
};
