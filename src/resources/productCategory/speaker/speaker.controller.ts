import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewSpeakerBulkRequest,
  CreateNewSpeakerRequest,
  DeleteASpeakerRequest,
  DeleteAllSpeakersRequest,
  GetSpeakerByIdRequest,
  GetQueriedSpeakersRequest,
  UpdateSpeakerByIdRequest,
  UpdateSpeakersBulkRequest,
} from "./speaker.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { SpeakerDocument } from "./speaker.model";

import {
  createNewSpeakerService,
  deleteASpeakerService,
  deleteAllSpeakersService,
  getSpeakerByIdService,
  getQueriedSpeakersService,
  getQueriedTotalSpeakersService,
  returnAllSpeakersUploadedFileIdsService,
  updateSpeakerByIdService,
} from "./speaker.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new speaker
// @route  POST /api/v1/product-category/speaker
// @access Private/Admin/Manager
const createNewSpeakerController = expressAsyncController(
  async (
    request: CreateNewSpeakerRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
    next: NextFunction
  ) => {
    const { speakerSchema } = request.body;

    const speakerDocument: SpeakerDocument = await createNewSpeakerService(speakerSchema);
    if (!speakerDocument) {
      return next(
        new createHttpError.InternalServerError("Speaker could not be created")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${speakerDocument.model} speaker`,
      resourceData: [speakerDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new speakers bulk
// @route  POST /api/v1/product-category/speaker/dev
// @access Private/Admin/Manager
const createNewSpeakerBulkController = expressAsyncController(
  async (
    request: CreateNewSpeakerBulkRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
    next: NextFunction
  ) => {
    const { speakerSchemas } = request.body;

    const newSpeakers = await Promise.all(
      speakerSchemas.map(async (speakerSchema) => {
        const newSpeaker = await createNewSpeakerService(speakerSchema);
        return newSpeaker;
      })
    );

    const successfullyCreatedSpeakers = newSpeakers.filter((speaker) => speaker);

    if (successfullyCreatedSpeakers.length === speakerSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedSpeakers.length} speakers`,
        resourceData: successfullyCreatedSpeakers,
      });
      return;
    }

    if (successfullyCreatedSpeakers.length === 0) {
      response.status(400).json({
        message: "Could not create any speakers",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        speakerSchemas.length - successfullyCreatedSpeakers.length
      } speakers`,
      resourceData: successfullyCreatedSpeakers,
    });
    return;
  }
);

// @desc   Update speakers bulk
// @route  PATCH /api/v1/product-category/speaker/dev
// @access Private/Admin/Manager
const updateSpeakersBulkController = expressAsyncController(
  async (
    request: UpdateSpeakersBulkRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
    next: NextFunction
  ) => {
    const { speakerFields } = request.body;

    const updatedSpeakers = await Promise.all(
      speakerFields.map(async (speakerField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = speakerField;

        const updatedSpeaker = await updateSpeakerByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedSpeaker;
      })
    );

    const successfullyUpdatedSpeakers = updatedSpeakers.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedSpeakers.length === speakerFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedSpeakers.length} speakers`,
        resourceData: successfullyUpdatedSpeakers,
      });
      return;
    }

    if (successfullyUpdatedSpeakers.length === 0) {
      response.status(400).json({
        message: "Could not update any speakers",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        speakerFields.length - successfullyUpdatedSpeakers.length
      } speakers`,
      resourceData: successfullyUpdatedSpeakers,
    });
    return;
  }
);

// @desc   Get all speakers
// @route  GET /api/v1/product-category/speaker
// @access Private/Admin/Manager
const getQueriedSpeakersController = expressAsyncController(
  async (
    request: GetQueriedSpeakersRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSpeakersService({
        filter: filter as FilterQuery<SpeakerDocument> | undefined,
      });
    }

    const speakers = await getQueriedSpeakersService({
      filter: filter as FilterQuery<SpeakerDocument> | undefined,
      projection: projection as QueryOptions<SpeakerDocument>,
      options: options as QueryOptions<SpeakerDocument>,
    });

    if (speakers.length === 0) {
      response.status(200).json({
        message: "No speakers that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved speakers",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: speakers,
    });
  }
);

// @desc   Get speaker by id
// @route  GET /api/v1/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const getSpeakerByIdController = expressAsyncController(
  async (
    request: GetSpeakerByIdRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
    next: NextFunction
  ) => {
    const speakerId = request.params.speakerId;

    const speaker = await getSpeakerByIdService(speakerId);
    if (!speaker) {
      return next(new createHttpError.NotFound("Speaker does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved speaker",
      resourceData: [speaker],
    });
  }
);

// @desc   Update a speaker by id
// @route  PUT /api/v1/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const updateSpeakerByIdController = expressAsyncController(
  async (
    request: UpdateSpeakerByIdRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
    next: NextFunction
  ) => {
    const { speakerId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedSpeaker = await updateSpeakerByIdService({
      _id: speakerId,
      fields,
      updateOperator,
    });

    if (!updatedSpeaker) {
      return next(
        new createHttpError.InternalServerError("Speaker could not be updated")
      );
    }

    response.status(200).json({
      message: "Speaker updated successfully",
      resourceData: [updatedSpeaker],
    });
  }
);

// @desc   Delete all speakers
// @route  DELETE /api/v1/product-category/speaker
// @access Private/Admin/Manager
const deleteAllSpeakersController = expressAsyncController(
  async (
    _request: DeleteAllSpeakersRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllSpeakersUploadedFileIdsService();

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError(
          "Some file uploads could not be deleted. Please try again."
        )
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError(
          "Some reviews could not be deleted. Please try again."
        )
      );
    }

    const deleteSpeakersResult: DeleteResult = await deleteAllSpeakersService();
    if (deleteSpeakersResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Some speakers could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "All speakers deleted", resourceData: [] });
  }
);

// @desc   Delete a speaker by id
// @route  DELETE /api/v1/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const deleteASpeakerController = expressAsyncController(
  async (
    request: DeleteASpeakerRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
    next: NextFunction
  ) => {
    const speakerId = request.params.speakerId;

    const speakerExists = await getSpeakerByIdService(speakerId);
    if (!speakerExists) {
      return next(new createHttpError.NotFound("Speaker does not exist"));
    }

    const uploadedFilesIds = [...speakerExists.uploadedFilesIds];

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError(
          "Some file uploads could not be deleted. Please try again."
        )
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError(
          "Some reviews could not be deleted. Please try again."
        )
      );
    }

    const deleteSpeakerResult: DeleteResult = await deleteASpeakerService(speakerId);
    if (deleteSpeakerResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Speaker could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "Speaker deleted", resourceData: [] });
  }
);

export {
  createNewSpeakerBulkController,
  createNewSpeakerController,
  deleteASpeakerController,
  deleteAllSpeakersController,
  getSpeakerByIdController,
  getQueriedSpeakersController,
  updateSpeakerByIdController,
  updateSpeakersBulkController,
};
