import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewRefermentRequest,
  CreateNewRefermentsBulkRequest,
  DeleteAllRefermentsRequest,
  DeleteRefermentRequest,
  GetRefermentByIdRequest,
  GetQueriedRefermentsByUserRequest,
  GetQueriedRefermentsRequest,
  UpdateRefermentByIdRequest,
  UpdateRefermentsBulkRequest,
} from "./referment.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { RefermentDocument, RefermentSchema } from "./referment.model";

import {
  createNewRefermentService,
  deleteAllRefermentsService,
  deleteRefermentByIdService,
  getRefermentByIdService,
  getQueriedRefermentsByUserService,
  getQueriedRefermentsService,
  getQueriedTotalRefermentsService,
  updateRefermentByIdService,
} from "./referment.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";
import createHttpError from "http-errors";

// @desc   Create a new referment
// @route  POST api/v1/actions/general/referment
// @access Private
const createNewRefermentController = expressAsyncController(
  async (
    request: CreateNewRefermentRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>,
    next: NextFunction
  ) => {
    const { refermentSchema } = request.body;

    const refermentDocument = await createNewRefermentService(refermentSchema);
    if (!refermentDocument) {
      return next(new createHttpError.InternalServerError("Referment creation failed"));
    }

    response.status(201).json({
      message: "Successfully created referment",
      resourceData: [refermentDocument],
    });
  }
);

// @desc   Get all referments
// @route  GET api/v1/actions/general/referment
// @access Private/Admin/Manager
const getQueriedRefermentsController = expressAsyncController(
  async (
    request: GetQueriedRefermentsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RefermentDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRefermentsService({
        filter: filter as FilterQuery<RefermentDocument> | undefined,
      });
    }

    const referment = await getQueriedRefermentsService({
      filter: filter as FilterQuery<RefermentDocument> | undefined,
      projection: projection as QueryOptions<RefermentDocument>,
      options: options as QueryOptions<RefermentDocument>,
    });

    if (!referment.length) {
      response.status(200).json({
        message: "No referments that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Referments found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: referment,
    });
  }
);

// @desc   Get all referment requests by user
// @route  GET api/v1/actions/general/referment
// @access Private
const getRefermentsByUserController = expressAsyncController(
  async (
    request: GetQueriedRefermentsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RefermentDocument>>
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
      totalDocuments = await getQueriedTotalRefermentsService({
        filter: filterWithUserId,
      });
    }

    const referments = await getQueriedRefermentsByUserService({
      filter: filterWithUserId as FilterQuery<RefermentDocument> | undefined,
      projection: projection as QueryOptions<RefermentDocument>,
      options: options as QueryOptions<RefermentDocument>,
    });

    if (!referments.length) {
      response.status(200).json({
        message: "No referment requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Referment requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: referments,
    });
  }
);

// @desc   Update referment status
// @route  PATCH api/v1/actions/general/referment
// @access Private/Admin/Manager
const updateRefermentByIdController = expressAsyncController(
  async (
    request: UpdateRefermentByIdRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>,
    next: NextFunction
  ) => {
    const { refermentId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User does not exist"));
    }

    const updatedReferment = await updateRefermentByIdService({
      _id: refermentId,
      fields,
      updateOperator,
    });
    if (!updatedReferment) {
      return next(new createHttpError.InternalServerError("Referment update failed"));
    }

    response.status(200).json({
      message: "Referment request status updated successfully",
      resourceData: [updatedReferment],
    });
  }
);

// @desc   Get an referment request
// @route  GET api/v1/actions/general/referment
// @access Private
const getRefermentByIdController = expressAsyncController(
  async (
    request: GetRefermentByIdRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>,
    next: NextFunction
  ) => {
    const { refermentId } = request.params;
    const referment = await getRefermentByIdService(refermentId);
    if (!referment) {
      return next(new createHttpError.NotFound("Referment request not found"));
    }

    response.status(200).json({
      message: "Referment request found successfully",
      resourceData: [referment],
    });
  }
);

// @desc   Delete an referment request by its id
// @route  DELETE api/v1/actions/general/referment
// @access Private
const deleteRefermentController = expressAsyncController(
  async (request: DeleteRefermentRequest, response: Response, next: NextFunction) => {
    const { refermentId } = request.params;

    const deletedResult: DeleteResult = await deleteRefermentByIdService(refermentId);
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Referment request deletion failed")
      );
    }

    response.status(200).json({
      message: "Referment request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all referment requests
// @route   DELETE api/v1/actions/general/request-resource/referment
// @access  Private
const deleteAllRefermentsController = expressAsyncController(
  async (
    _request: DeleteAllRefermentsRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllRefermentsService();
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Referment requests deletion failed")
      );
    }

    response.status(200).json({
      message: "All referment requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new referment requests in bulk
// @route  POST api/v1/actions/general/referment
// @access Private
const createNewRefermentsBulkController = expressAsyncController(
  async (
    request: CreateNewRefermentsBulkRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>
  ) => {
    const { refermentSchemas } = request.body;

    const refermentDocuments = await Promise.all(
      refermentSchemas.map(async (refermentSchema) => {
        const refermentDocument = await createNewRefermentService(refermentSchema);
        return refermentDocument;
      })
    );

    const filteredRefermentDocuments = refermentDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredRefermentDocuments.length === 0) {
      response.status(400).json({
        message: "Referment requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      refermentSchemas.length - filteredRefermentDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredRefermentDocuments.length
      } Referment requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredRefermentDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Referments in bulk
// @route  PATCH api/v1/actions/general/referment
// @access Private
const updateRefermentsBulkController = expressAsyncController(
  async (
    request: UpdateRefermentsBulkRequest,
    response: Response<ResourceRequestServerResponse<RefermentDocument>>
  ) => {
    const { refermentFields } = request.body;

    const updatedReferments = await Promise.all(
      refermentFields.map(async (refermentField) => {
        const {
          documentUpdate: { fields, updateOperator },
          refermentId,
        } = refermentField;

        const updatedReferment = await updateRefermentByIdService({
          _id: refermentId,
          fields,
          updateOperator,
        });

        return updatedReferment;
      })
    );

    const successfullyCreatedReferments = updatedReferments.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedReferments.length === 0) {
      response.status(400).json({
        message: "Could not create any Referments",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedReferments.length
      } Referments. ${
        refermentFields.length - successfullyCreatedReferments.length
      } Referments failed to be created.`,
      resourceData: successfullyCreatedReferments,
    });
  }
);

export {
  createNewRefermentController,
  getQueriedRefermentsController,
  getRefermentsByUserController,
  getRefermentByIdController,
  deleteRefermentController,
  deleteAllRefermentsController,
  updateRefermentByIdController,
  createNewRefermentsBulkController,
  updateRefermentsBulkController,
};
