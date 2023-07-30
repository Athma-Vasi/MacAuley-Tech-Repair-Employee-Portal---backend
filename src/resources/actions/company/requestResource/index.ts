/**
 * This barrel file is used to import/export resourceRequest model, router, types, handlers and services
 */

/**
 * Imports
 */

import { RequestResourceModel } from './requestResource.model';
import { requestResourceRouter } from './requestResource.routes';
import {
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
  updateRequestResourceStatusByIdHandler,
} from './requestResource.controller';
import {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getQueriedRequestResourceService,
  getRequestResourceByIdService,
  getQueriedRequestResourceByUserService,
  getQueriedTotalRequestResourceService,
  updateRequestResourceStatusByIdService,
} from './requestResource.service';

import type {
  RequestResourceDocument,
  RequestResourceSchema,
  RequestResourceKind,
} from './requestResource.model';
import type {
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetQueriedRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetQueriedRequestResourcesByUserRequest,
  UpdateRequestResourceStatusByIdRequest,
} from './requestResource.types';

/**
 * Exports
 */

export {
  RequestResourceModel,
  requestResourceRouter,
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
  updateRequestResourceStatusByIdHandler,
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getQueriedRequestResourceService,
  getRequestResourceByIdService,
  getQueriedRequestResourceByUserService,
  getQueriedTotalRequestResourceService,
  updateRequestResourceStatusByIdService,
};

export type {
  RequestResourceDocument,
  RequestResourceSchema,
  RequestResourceKind,
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetQueriedRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetQueriedRequestResourcesByUserRequest,
  UpdateRequestResourceStatusByIdRequest,
};
