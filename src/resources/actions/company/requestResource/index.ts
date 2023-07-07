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
  getAllRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
} from './requestResource.controller';
import {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getAllRequestResourcesService,
  getRequestResourceByIdService,
  getRequestResourceByUserService,
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
  GetAllRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetRequestResourcesByUserRequest,
  RequestResourcesServerResponse,
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
