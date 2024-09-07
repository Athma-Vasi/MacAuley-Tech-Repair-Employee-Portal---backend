/**
 * This barrel file is used to import/export gpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { gpuRouter } from "./gpu.routes";
import { GpuModel } from "./gpu.model";

import type { GpuDocument, GpuSchema } from "./gpu.model";

/**
 * Exports
 */

export { GpuModel, gpuRouter };

export type { GpuDocument, GpuSchema };
