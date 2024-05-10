import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewSurveyRequest,
  CreateNewSurveysBulkRequest,
  DeleteAllSurveysRequest,
  DeleteSurveyRequest,
  GetSurveyByIdRequest,
  GetQueriedSurveysByUserRequest,
  GetQueriedSurveysRequest,
  UpdateSurveyByIdRequest,
  UpdateSurveysBulkRequest,
} from "./survey.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { SurveyDocument, SurveySchema } from "./survey.model";

import {
  createNewSurveyService,
  deleteAllSurveysService,
  deleteSurveyByIdService,
  getSurveyByIdService,
  getQueriedSurveysByUserService,
  getQueriedSurveysService,
  getQueriedTotalSurveysService,
  updateSurveyByIdService,
} from "./survey.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";

// @desc   Create a new survey
// @route  POST api/v1/actions/outreach/survey
// @access Private
const createNewSurveyController = expressAsyncController(
  async (
    request: CreateNewSurveyRequest,
    response: Response<ResourceRequestServerResponse<SurveyDocument>>
  ) => {
    const { surveySchema } = request.body;

    const surveyDocument = await createNewSurveyService(surveySchema);

    if (!surveyDocument) {
      response.status(400).json({
        message: "New survey could not be created",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: "Successfully created survey",
      resourceData: [surveyDocument],
    });
  }
);

// @desc   Get all surveys
// @route  GET api/v1/actions/outreach/survey
// @access Private/Admin/Manager
const getQueriedSurveysController = expressAsyncController(
  async (
    request: GetQueriedSurveysRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SurveyDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSurveysService({
        filter: filter as FilterQuery<SurveyDocument> | undefined,
      });
    }

    // get all surveys
    const survey = await getQueriedSurveysService({
      filter: filter as FilterQuery<SurveyDocument> | undefined,
      projection: projection as QueryOptions<SurveyDocument>,
      options: options as QueryOptions<SurveyDocument>,
    });

    if (!survey.length) {
      response.status(200).json({
        message: "No surveys that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Surveys found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: survey,
    });
  }
);

// @desc   Get all survey requests by user
// @route  GET api/v1/actions/outreach/survey
// @access Private
const getSurveysByUserController = expressAsyncController(
  async (
    request: GetQueriedSurveysByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SurveyDocument>>
  ) => {
    // anyone can view their own survey requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSurveysService({
        filter: filterWithUserId,
      });
    }

    // get all survey requests by user
    const surveys = await getQueriedSurveysByUserService({
      filter: filterWithUserId as FilterQuery<SurveyDocument> | undefined,
      projection: projection as QueryOptions<SurveyDocument>,
      options: options as QueryOptions<SurveyDocument>,
    });

    if (!surveys.length) {
      response.status(200).json({
        message: "No survey requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Survey requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: surveys,
    });
  }
);

// @desc   Update survey status
// @route  PATCH api/v1/actions/outreach/survey
// @access Private/Admin/Manager
const updateSurveyByIdController = expressAsyncController(
  async (
    request: UpdateSurveyByIdRequest,
    response: Response<ResourceRequestServerResponse<SurveyDocument>>
  ) => {
    const { surveyId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update survey request status
    const updatedSurvey = await updateSurveyByIdService({
      _id: surveyId,
      fields,
      updateOperator,
    });

    if (!updatedSurvey) {
      response.status(400).json({
        message: "Survey request status update failed",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Survey request status updated successfully",
      resourceData: [updatedSurvey],
    });
  }
);

// @desc   Get an survey request
// @route  GET api/v1/actions/outreach/survey
// @access Private
const getSurveyByIdController = expressAsyncController(
  async (
    request: GetSurveyByIdRequest,
    response: Response<ResourceRequestServerResponse<SurveyDocument>>
  ) => {
    const { surveyId } = request.params;
    const survey = await getSurveyByIdService(surveyId);
    if (!survey) {
      response
        .status(404)
        .json({ message: "Survey request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Survey request found successfully",
      resourceData: [survey],
    });
  }
);

// @desc   Delete an survey request by its id
// @route  DELETE api/v1/actions/outreach/survey
// @access Private
const deleteSurveyController = expressAsyncController(
  async (request: DeleteSurveyRequest, response: Response) => {
    const { surveyId } = request.params;

    // delete survey request by id
    const deletedResult: DeleteResult = await deleteSurveyByIdService(surveyId);

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Survey request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Survey request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all survey requests
// @route   DELETE api/v1/actions/outreach/request-resource/survey
// @access  Private
const deleteAllSurveysController = expressAsyncController(
  async (_request: DeleteAllSurveysRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllSurveysService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All survey requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All survey requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new survey requests in bulk
// @route  POST api/v1/actions/outreach/survey
// @access Private
const createNewSurveysBulkController = expressAsyncController(
  async (
    request: CreateNewSurveysBulkRequest,
    response: Response<ResourceRequestServerResponse<SurveyDocument>>
  ) => {
    const { surveySchemas } = request.body;

    const surveyDocuments = await Promise.all(
      surveySchemas.map(async (surveySchema) => {
        const surveyDocument = await createNewSurveyService(surveySchema);
        return surveyDocument;
      })
    );

    const filteredSurveyDocuments = surveyDocuments.filter(removeUndefinedAndNullValues);

    if (filteredSurveyDocuments.length === 0) {
      response.status(400).json({
        message: "Survey requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      surveySchemas.length - filteredSurveyDocuments.length;

    response.status(201).json({
      message: `Successfully created ${filteredSurveyDocuments.length} Survey requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredSurveyDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Surveys in bulk
// @route  PATCH api/v1/actions/outreach/survey
// @access Private
const updateSurveysBulkController = expressAsyncController(
  async (
    request: UpdateSurveysBulkRequest,
    response: Response<ResourceRequestServerResponse<SurveyDocument>>
  ) => {
    const { surveyFields } = request.body;

    const updatedSurveys = await Promise.all(
      surveyFields.map(async (surveyField) => {
        const {
          documentUpdate: { fields, updateOperator },
          surveyId,
        } = surveyField;

        const updatedSurvey = await updateSurveyByIdService({
          _id: surveyId,
          fields,
          updateOperator,
        });

        return updatedSurvey;
      })
    );

    // filter out any surveys that were not created
    const successfullyCreatedSurveys = updatedSurveys.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedSurveys.length === 0) {
      response.status(400).json({
        message: "Could not create any Surveys",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${successfullyCreatedSurveys.length} Surveys. ${
        surveyFields.length - successfullyCreatedSurveys.length
      } Surveys failed to be created.`,
      resourceData: successfullyCreatedSurveys,
    });
  }
);

export {
  createNewSurveyController,
  getQueriedSurveysController,
  getSurveysByUserController,
  getSurveyByIdController,
  deleteSurveyController,
  deleteAllSurveysController,
  updateSurveyByIdController,
  createNewSurveysBulkController,
  updateSurveysBulkController,
};
