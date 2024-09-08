/**
 * This barrel file is used to import/export fileUpload model, router, types, handlers and services
 */

/**
 * Imports
 */

import { FileUploadModel } from "./fileUpload.model";
import { fileUploadRouter } from "./fileUpload.routes";

import type {
  AssociatedResourceKind,
  FileExtension,
  FileUploadDocument,
  FileUploadSchema,
} from "./fileUpload.model";

/**
 * Exports
 */

export { FileUploadModel, fileUploadRouter };

export type {
  AssociatedResourceKind,
  FileExtension,
  FileUploadDocument,
  FileUploadSchema,
};
