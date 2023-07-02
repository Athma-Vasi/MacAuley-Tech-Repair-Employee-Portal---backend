/**
 * This barrel file is used to import/export resourceRequest model, router, types, handlers and services
 */

/**
 * Imports
 */

import { RequestResourceModel } from './resourceRequest.model';
import { requestResourceRouter } from './resourceRequest.routes';
import {
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getAllRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
} from './resourceRequest.controller';
import {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getAllRequestResourcesService,
  getRequestResourceByIdService,
  getRequestResourceByUserService,
} from './resourceRequest.service';

import type {
  RequestResourceDocument,
  RequestResourceSchema,
  RequestResourceKind,
} from './resourceRequest.model';
import type {
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetAllRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetRequestResourcesByUserRequest,
  RequestResourcesServerResponse,
} from './resourceRequest.types';

/**
 * Exports
 */

export {
  RequestResourceModel,
  requestResourceRouter,
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getAllRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getAllRequestResourcesService,
  getRequestResourceByIdService,
  getRequestResourceByUserService,
};

export type {
  RequestResourceDocument,
  RequestResourceSchema,
  RequestResourceKind,
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetAllRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetRequestResourcesByUserRequest,
  RequestResourcesServerResponse,
};
