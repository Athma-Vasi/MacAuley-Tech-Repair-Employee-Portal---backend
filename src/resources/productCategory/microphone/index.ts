/**
 * This barrel file is used to import/export microphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { microphoneRouter } from "./microphone.routes";
import { MicrophoneModel } from "./microphone.model";

import type { MicrophoneDocument, MicrophoneSchema } from "./microphone.model";

/**
 * Exports
 */

export { MicrophoneModel, microphoneRouter };

export type { MicrophoneDocument, MicrophoneSchema };
