import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { SurveyDocument, SurveySchema } from "./survey.model";

import { SurveyModel } from "./survey.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";

async function getSurveyByIdService(
  surveyId: Types.ObjectId | string
): DatabaseResponseNullable<SurveyDocument> {
  try {
    const survey = await SurveyModel.findById(surveyId).lean().exec();
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: "getSurveyByIdService" });
  }
}

async function createNewSurveyService(surveySchema: SurveySchema): Promise<SurveyDocument> {
  try {
    const survey = await SurveyModel.create(surveySchema);
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewSurveyService" });
  }
}

async function getQueriedSurveysService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<SurveyDocument>): DatabaseResponse<SurveyDocument> {
  try {
    const survey = await SurveyModel.find(filter, projection, options).lean().exec();
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedSurveysService" });
  }
}

async function getQueriedTotalSurveysService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<SurveyDocument>): Promise<number> {
  try {
    const totalSurveys = await SurveyModel.countDocuments(filter).lean().exec();
    return totalSurveys;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalSurveysService" });
  }
}

async function getQueriedSurveysByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<SurveyDocument>): DatabaseResponse<SurveyDocument> {
  try {
    const surveys = await SurveyModel.find(filter, projection, options).lean().exec();
    return surveys;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedSurveysByUserService" });
  }
}

async function updateSurveyByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<SurveyDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const survey = await SurveyModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: "updateSurveyStatusByIdService" });
  }
}

async function deleteSurveyByIdService(
  surveyId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await SurveyModel.deleteOne({
      _id: surveyId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteSurveyByIdService" });
  }
}

async function deleteAllSurveysService(): Promise<DeleteResult> {
  try {
    const deletedResult = await SurveyModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllSurveysService" });
  }
}

export {
  getSurveyByIdService,
  createNewSurveyService,
  getQueriedSurveysService,
  getQueriedTotalSurveysService,
  getQueriedSurveysByUserService,
  deleteSurveyByIdService,
  deleteAllSurveysService,
  updateSurveyByIdService,
};
