/**
 * This barrel file is used to import/export resourceRequest model, router, types, handlers and services
 */

/**
 * Imports
 */

import { RequestResourceModel } from "./requestResource.model";
import { requestResourceRouter } from "./requestResource.routes";
import {
  createNewRequestResourceHandler,
  createNewRequestResourcesBulkHandler,
  deleteAllRequestResourcesHandler,
  deleteRequestResourceHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourcesByUserHandler,
  updateRequestResourceByIdHandler,
  updateRequestResourcesBulkHandler,
} from "./requestResource.controller";
import {
  createNewRequestResourceService,
  deleteAllRequestResourcesService,
  deleteRequestResourceByIdService,
  getQueriedRequestResourcesByUserService,
  getQueriedRequestResourcesService,
  getQueriedTotalRequestResourcesService,
  getRequestResourceByIdService,
  updateRequestResourceByIdService,
} from "./requestResource.service";

import type {
  RequestResourceDocument,
  RequestResourceSchema,
  RequestResourceKind,
} from "./requestResource.model";
import type {
  CreateNewRequestResourceRequest,
  CreateNewRequestResourcesBulkRequest,
  DeleteAllRequestResourcesRequest,
  DeleteRequestResourceRequest,
  GetQueriedRequestResourcesByUserRequest,
  GetQueriedRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  UpdateRequestResourceByIdRequest,
  UpdateRequestResourcesBulkRequest,
} from "./requestResource.types";

/**
 * Exports
 */

export {
  RequestResourceModel,
  requestResourceRouter,
  createNewRequestResourceHandler,
  createNewRequestResourcesBulkHandler,
  deleteAllRequestResourcesHandler,
  deleteRequestResourceHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourcesByUserHandler,
  updateRequestResourceByIdHandler,
  updateRequestResourcesBulkHandler,
  createNewRequestResourceService,
  deleteAllRequestResourcesService,
  deleteRequestResourceByIdService,
  getQueriedRequestResourcesByUserService,
  getQueriedRequestResourcesService,
  getQueriedTotalRequestResourcesService,
  getRequestResourceByIdService,
  updateRequestResourceByIdService,
};

export type {
  RequestResourceDocument,
  RequestResourceSchema,
  RequestResourceKind,
  CreateNewRequestResourceRequest,
  CreateNewRequestResourcesBulkRequest,
  DeleteAllRequestResourcesRequest,
  DeleteRequestResourceRequest,
  GetQueriedRequestResourcesByUserRequest,
  GetQueriedRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  UpdateRequestResourceByIdRequest,
  UpdateRequestResourcesBulkRequest,
};
