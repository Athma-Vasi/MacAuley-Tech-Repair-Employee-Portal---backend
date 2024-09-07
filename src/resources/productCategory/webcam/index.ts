/**
 * This barrel file is used to import/export webcam router, model, types, controllers and services
 */

/**
 * Imports
 */
import { webcamRouter } from "./webcam.routes";
import { WebcamModel } from "./webcam.model";

import type { WebcamDocument, WebcamSchema } from "./webcam.model";

/**
 * Exports
 */

export { WebcamModel, webcamRouter };

export type { WebcamDocument, WebcamSchema };
