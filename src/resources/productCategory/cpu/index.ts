/**
 * This barrel file is used to import/export cpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { cpuRouter } from "./cpu.routes";
import { CpuModel } from "./cpu.model";

import type { CpuDocument, CpuSchema } from "./cpu.model";

/**
 * Exports
 */
export { CpuModel, cpuRouter };

export type { CpuDocument, CpuSchema };
