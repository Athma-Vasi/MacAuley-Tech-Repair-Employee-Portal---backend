/**
 * This barrel file is used to import/export speaker router, model, types, controllers and services
 */

/**
 * Imports
 */
import { speakerRouter } from "./speaker.routes";
import { SpeakerModel } from "./speaker.model";

import type { SpeakerDocument, SpeakerSchema } from "./speaker.model";

/**
 * Exports
 */

export { SpeakerModel, speakerRouter };

export type { SpeakerDocument, SpeakerSchema };
