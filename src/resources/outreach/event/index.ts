/**
 * This barrel index file is used to import/export event model, router, types, handlers and services
 */

/**
 * Imports
 */

import { EventModel } from "./event.model";
import { eventRouter } from "./event.routes";

import type { EventDocument, EventKind, EventSchema } from "./event.model";

/**
 * Exports
 */

export { EventModel, eventRouter };

export type { EventDocument, EventKind, EventSchema };
