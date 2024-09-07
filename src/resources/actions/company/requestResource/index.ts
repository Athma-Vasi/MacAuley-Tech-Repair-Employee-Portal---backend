/**
 * This barrel file is used to import/export resourceRequest model, router, types, handlers and services
 */

/**
 * Imports
 */

import { RequestResourceModel } from "./requestResource.model";
import { requestResourceRouter } from "./requestResource.routes";

import type {
  RequestResourceDocument,
  RequestResourceKind,
  RequestResourceSchema,
} from "./requestResource.model";

/**
 * Exports
 */

export { RequestResourceModel, requestResourceRouter };

export type {
  RequestResourceDocument,
  RequestResourceKind,
  RequestResourceSchema,
};
