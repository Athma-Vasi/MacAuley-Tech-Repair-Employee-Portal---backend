import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewEndorsementRequest,
  CreateNewEndorsementsBulkRequest,
  DeleteAllEndorsementsRequest,
  DeleteEndorsementRequest,
  GetEndorsementByIdRequest,
  GetQueriedEndorsementsByUserRequest,
  GetQueriedEndorsementsRequest,
  UpdateEndorsementByIdRequest,
  UpdateEndorsementsBulkRequest,
} from "./endorsement.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { EndorsementDocument, EndorsementSchema } from "./endorsement.model";

import {
  createNewEndorsementService,
  deleteAllEndorsementsService,
  deleteEndorsementByIdService,
  getEndorsementByIdService,
  getQueriedEndorsementsByUserService,
  getQueriedEndorsementsService,
  getQueriedTotalEndorsementsService,
  updateEndorsementByIdService,
} from "./endorsement.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";
import { create } from "domain";
import createHttpError from "http-errors";

// @desc   Create a new endorsement
// @route  POST api/v1/actions/general/endorsement
// @access Private
const createNewEndorsementController = expressAsyncController(
  async (
    request: CreateNewEndorsementRequest,
    response: Response<ResourceRequestServerResponse<EndorsementDocument>>,
    next: NextFunction
  ) => {
    const { endorsementSchema } = request.body;

    const endorsementDocument = await createNewEndorsementService(endorsementSchema);
    if (!endorsementDocument) {
      return next(new createHttpError.InternalServerError("Endorsement creation failed"));
    }

    response.status(201).json({
      message: `Successfully created ${endorsementDocument.title} endorsement`,
      resourceData: [endorsementDocument],
    });
  }
);

// @desc   Get all endorsements
// @route  GET api/v1/actions/general/endorsement
// @access Private/Admin/Manager
const getQueriedEndorsementsController = expressAsyncController(
  async (
    request: GetQueriedEndorsementsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EndorsementDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalEndorsementsService({
        filter: filter as FilterQuery<EndorsementDocument> | undefined,
      });
    }

    const endorsement = await getQueriedEndorsementsService({
      filter: filter as FilterQuery<EndorsementDocument> | undefined,
      projection: projection as QueryOptions<EndorsementDocument>,
      options: options as QueryOptions<EndorsementDocument>,
    });

    if (!endorsement.length) {
      response.status(200).json({
        message: "No endorsements that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Endorsements found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: endorsement,
    });
  }
);

// @desc   Get all endorsement requests by user
// @route  GET api/v1/actions/general/endorsement
// @access Private
const getEndorsementsByUserController = expressAsyncController(
  async (
    request: GetQueriedEndorsementsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EndorsementDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalEndorsementsService({
        filter: filterWithUserId,
      });
    }

    const endorsements = await getQueriedEndorsementsByUserService({
      filter: filterWithUserId as FilterQuery<EndorsementDocument> | undefined,
      projection: projection as QueryOptions<EndorsementDocument>,
      options: options as QueryOptions<EndorsementDocument>,
    });

    if (!endorsements.length) {
      response.status(200).json({
        message: "No endorsement requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Endorsement requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: endorsements,
    });
  }
);

// @desc   Update endorsement status
// @route  PATCH api/v1/actions/general/endorsement
// @access Private/Admin/Manager
const updateEndorsementByIdController = expressAsyncController(
  async (
    request: UpdateEndorsementByIdRequest,
    response: Response<ResourceRequestServerResponse<EndorsementDocument>>,
    next: NextFunction
  ) => {
    const { endorsementId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const updatedEndorsement = await updateEndorsementByIdService({
      _id: endorsementId,
      fields,
      updateOperator,
    });

    if (!updatedEndorsement) {
      return next(
        new createHttpError.InternalServerError("Endorsement request update failed")
      );
    }

    response.status(200).json({
      message: "Endorsement request status updated successfully",
      resourceData: [updatedEndorsement],
    });
  }
);

// @desc   Get an endorsement request
// @route  GET api/v1/actions/general/endorsement
// @access Private
const getEndorsementByIdController = expressAsyncController(
  async (
    request: GetEndorsementByIdRequest,
    response: Response<ResourceRequestServerResponse<EndorsementDocument>>,
    next: NextFunction
  ) => {
    const { endorsementId } = request.params;
    const endorsement = await getEndorsementByIdService(endorsementId);
    if (!endorsement) {
      return next(new createHttpError.NotFound("Endorsement request not found"));
    }

    response.status(200).json({
      message: "Endorsement request found successfully",
      resourceData: [endorsement],
    });
  }
);

// @desc   Delete an endorsement request by its id
// @route  DELETE api/v1/actions/general/endorsement
// @access Private
const deleteEndorsementController = expressAsyncController(
  async (request: DeleteEndorsementRequest, response: Response, next: NextFunction) => {
    const { endorsementId } = request.params;

    const deletedResult: DeleteResult = await deleteEndorsementByIdService(endorsementId);
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Endorsement request deletion failed")
      );
    }

    response.status(200).json({
      message: "Endorsement request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all endorsement requests
// @route   DELETE api/v1/actions/general/request-resource/endorsement
// @access  Private
const deleteAllEndorsementsController = expressAsyncController(
  async (
    _request: DeleteAllEndorsementsRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllEndorsementsService();
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Endorsement requests deletion failed")
      );
    }

    response.status(200).json({
      message: "All endorsement requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new endorsement requests in bulk
// @route  POST api/v1/actions/general/endorsement
// @access Private
const createNewEndorsementsBulkController = expressAsyncController(
  async (
    request: CreateNewEndorsementsBulkRequest,
    response: Response<ResourceRequestServerResponse<EndorsementDocument>>
  ) => {
    const { endorsementSchemas } = request.body;

    const endorsementDocuments = await Promise.all(
      endorsementSchemas.map(async (endorsementSchema) => {
        const endorsementDocument = await createNewEndorsementService(endorsementSchema);
        return endorsementDocument;
      })
    );

    const filteredEndorsementDocuments = endorsementDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredEndorsementDocuments.length === 0) {
      response.status(400).json({
        message: "Endorsement requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      endorsementSchemas.length - filteredEndorsementDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredEndorsementDocuments.length
      } Endorsement requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredEndorsementDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Endorsements in bulk
// @route  PATCH api/v1/actions/general/endorsement
// @access Private
const updateEndorsementsBulkController = expressAsyncController(
  async (
    request: UpdateEndorsementsBulkRequest,
    response: Response<ResourceRequestServerResponse<EndorsementDocument>>
  ) => {
    const { endorsementFields } = request.body;

    const updatedEndorsements = await Promise.all(
      endorsementFields.map(async (endorsementField) => {
        const {
          documentUpdate: { fields, updateOperator },
          endorsementId,
        } = endorsementField;

        const updatedEndorsement = await updateEndorsementByIdService({
          _id: endorsementId,
          fields,
          updateOperator,
        });

        return updatedEndorsement;
      })
    );

    const successfullyCreatedEndorsements = updatedEndorsements.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedEndorsements.length === 0) {
      response.status(400).json({
        message: "Could not create any Endorsements",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedEndorsements.length
      } Endorsements. ${
        endorsementFields.length - successfullyCreatedEndorsements.length
      } Endorsements failed to be created.`,
      resourceData: successfullyCreatedEndorsements,
    });
  }
);

export {
  createNewEndorsementController,
  getQueriedEndorsementsController,
  getEndorsementsByUserController,
  getEndorsementByIdController,
  deleteEndorsementController,
  deleteAllEndorsementsController,
  updateEndorsementByIdController,
  createNewEndorsementsBulkController,
  updateEndorsementsBulkController,
};
