/**
 * This barrel file is used to import/export survey model, router, types, handlers and services
 */

/**
 * Imports
 */

import { SurveyModel } from "./survey.model";
import { surveyRouter } from "./survey.routes";

import type {
  SurveyDocument,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
  SurveySchema,
} from "./survey.model";

/**
 * Exports
 */

export { SurveyModel, surveyRouter };

export type {
  SurveyDocument,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
  SurveySchema,
};
