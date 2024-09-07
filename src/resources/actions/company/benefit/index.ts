/**
 * This barrel file is used to import/export benefit model, router, types, handlers and services
 */

/**
 * Imports
 */
import { BenefitModel } from "./benefit.model";
import { benefitRouter } from "./benefit.routes";

import type { BenefitDocument, BenefitSchema } from "./benefit.model";

/**
 * Exports
 */
export { BenefitModel, benefitRouter };
export type { BenefitDocument, BenefitSchema };
