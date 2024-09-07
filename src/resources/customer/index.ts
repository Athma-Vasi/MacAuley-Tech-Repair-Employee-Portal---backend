/**
 * This barrel file is used to import/export customer model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CustomerModel } from "./customer.model";
import { customerRouter } from "./customer.routes";

import type { CustomerDocument, CustomerSchema } from "./customer.model";

/**
 * Exports
 */

export { CustomerModel, customerRouter };

export type { CustomerDocument, CustomerSchema };
