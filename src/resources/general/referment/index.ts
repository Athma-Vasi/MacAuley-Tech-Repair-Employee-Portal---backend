/**
 * This barrel file is used to import/export referment model, router, types, handlers and services
 */

/**
 * Imports
 */
import { RefermentModel } from "./referment.model";
import { refermentRouter } from "./referment.routes";

import type { RefermentDocument, RefermentSchema } from "./referment.model";

/**
 * Exports
 */
export { RefermentModel, refermentRouter };

export type { RefermentDocument, RefermentSchema };
