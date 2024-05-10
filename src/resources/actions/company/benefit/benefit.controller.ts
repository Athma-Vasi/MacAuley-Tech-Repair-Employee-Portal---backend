import expressAsyncController from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { NextFunction, Response } from "express";
import type {
  CreateNewBenefitRequest,
  CreateNewBenefitsBulkRequest,
  DeleteAllBenefitsRequest,
  DeleteAnBenefitRequest,
  GetBenefitByIdRequest,
  GetQueriedBenefitsByUserRequest,
  UpdateBenefitByIdRequest,
  GetQueriedBenefitsRequest,
  UpdateBenefitsBulkRequest,
} from "./benefit.types";
import {
  createNewBenefitService,
  deleteAllBenefitsService,
  deleteBenefitByIdService,
  getBenefitByIdService,
  getQueriedBenefitsByUserService,
  getQueriedBenefitsService,
  updateBenefitByIdService,
  getQueriedTotalBenefitsService,
} from "./benefit.service";
import { BenefitDocument, BenefitSchema } from "./benefit.model";
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import { FilterQuery, QueryOptions } from "mongoose";

import { getUserByIdService, getUserByUsernameService } from "../../../user";
import { removeUndefinedAndNullValues } from "../../../../utils";
import createHttpError from "http-errors";

// @desc   Create a new benefits plan
// @route  POST api/v1/actions/company/benefits
// @access Private/Admin/Manager
const createNewBenefitController = expressAsyncController(
  async (
    request: CreateNewBenefitRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { roles, username },
      benefitSchema,
    } = request.body;

    if (!roles.includes("Manager")) {
      return next(new createHttpError.Forbidden("User does not have permission"));
    }

    const benefitUser = await getUserByUsernameService(username);
    if (!benefitUser) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const benefitUserId = benefitUser._id;
    const newBenefitSchema: BenefitSchema = {
      ...benefitSchema,
      benefitUserId,
      username,
    };

    const benefitDocument = await createNewBenefitService(newBenefitSchema);
    if (!benefitDocument) {
      return next(
        new createHttpError.InternalServerError("Unable to create new benefit plan")
      );
    }

    response
      .status(201)
      .json({ message: "New benefit plan created", resourceData: [benefitDocument] });
  }
);

// @desc   Get all benefits
// @route  GET api/v1/actions/company/benefit
// @access Private/Admin/Manager
const getQueriedBenefitsController = expressAsyncController(
  async (
    request: GetQueriedBenefitsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<BenefitDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalBenefitsService({
        filter: filter as FilterQuery<BenefitDocument> | undefined,
      });
    }

    const benefits = await getQueriedBenefitsService({
      filter: filter as FilterQuery<BenefitDocument> | undefined,
      projection: projection as QueryOptions<BenefitDocument>,
      options: options as QueryOptions<BenefitDocument>,
    });

    if (!benefits.length) {
      response.status(200).json({
        message: "No benefits that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Benefits found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: benefits,
    });
  }
);

// @desc   Get all benefit documents by user
// @route  GET api/v1/actions/company/benefit/user
// @access Private
const getBenefitsByUserController = expressAsyncController(
  async (
    request: GetQueriedBenefitsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<BenefitDocument>>
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
      totalDocuments = await getQueriedTotalBenefitsService({
        filter: filterWithUserId,
      });
    }

    const benefits = await getQueriedBenefitsByUserService({
      filter: filterWithUserId as FilterQuery<BenefitDocument> | undefined,
      projection: projection as QueryOptions<BenefitDocument>,
      options: options as QueryOptions<BenefitDocument>,
    });

    if (!benefits.length) {
      response.status(200).json({
        message: "No benefit documents found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Benefit requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: benefits,
    });
  }
);

// @desc   Update benefit status
// @route  PATCH api/v1/actions/company/benefit/:benefitId
// @access Private/Admin/Manager
const updateBenefitByIdController = expressAsyncController(
  async (
    request: UpdateBenefitByIdRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>,
    next: NextFunction
  ) => {
    const { benefitId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const updatedBenefit = await updateBenefitByIdService({
      _id: benefitId,
      fields,
      updateOperator,
    });

    if (!updatedBenefit) {
      return next(
        new createHttpError.InternalServerError(
          "Benefit document status update failed. Please try again!"
        )
      );
    }

    response.status(200).json({
      message: "Benefit document status updated successfully",
      resourceData: [updatedBenefit],
    });
  }
);

// @desc   Get an benefit request
// @route  GET api/v1/actions/company/benefit/:benefitId
// @access Private
const getBenefitByIdController = expressAsyncController(
  async (
    request: GetBenefitByIdRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>,
    next: NextFunction
  ) => {
    const { benefitId } = request.params;
    const benefit = await getBenefitByIdService(benefitId);
    if (!benefit) {
      return next(new createHttpError.NotFound("Benefit document not found"));
    }

    response.status(200).json({
      message: "Benefit document found successfully",
      resourceData: [benefit],
    });
  }
);

// @desc   Delete an benefit document by its id
// @route  DELETE api/v1/actions/company/benefit/:benefitId
// @access Private
const deleteBenefitController = expressAsyncController(
  async (request: DeleteAnBenefitRequest, response: Response) => {
    const { benefitId } = request.params;

    const deletedResult: DeleteResult = await deleteBenefitByIdService(benefitId);
    if (!deletedResult.deletedCount) {
      throw new createHttpError.InternalServerError(
        "Benefit document could not be deleted"
      );
    }

    response.status(200).json({
      message: "Benefit document deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all benefit documents
// @route   DELETE api/v1/actions/company/benefit/delete-all
// @access  Private
const deleteAllBenefitsController = expressAsyncController(
  async (_request: DeleteAllBenefitsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllBenefitsService();

    if (!deletedResult.deletedCount) {
      throw new createHttpError.InternalServerError(
        "All benefit documents could not be deleted"
      );
    }

    response.status(200).json({
      message: "All benefit documents deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new benefit documents in bulk
// @route  POST api/v1/actions/company/benefit/dev
// @access Private
const createNewBenefitsBulkController = expressAsyncController(
  async (
    request: CreateNewBenefitsBulkRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>
  ) => {
    const { benefitSchemas } = request.body;

    const benefitDocuments = await Promise.all(
      benefitSchemas.map(async (benefitSchema) => {
        const benefitDocument = await createNewBenefitService(benefitSchema);
        return benefitDocument;
      })
    );

    const filteredBenefitDocuments = benefitDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredBenefitDocuments.length === 0) {
      throw new createHttpError.InternalServerError(
        "No Benefit Requests were created. Please try again!"
      );
    }

    const uncreatedDocumentsAmount =
      benefitSchemas.length - filteredBenefitDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredBenefitDocuments.length
      } Benefit Requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredBenefitDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Benefits in bulk
// @route  PATCH api/v1/actions/company/benefit/dev
// @access Private
const updateBenefitsBulkController = expressAsyncController(
  async (
    request: UpdateBenefitsBulkRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>
  ) => {
    const { benefitFields } = request.body;

    const updatedBenefits = await Promise.all(
      benefitFields.map(async (benefitField) => {
        const {
          documentUpdate: { fields, updateOperator },
          benefitId,
        } = benefitField;

        const updatedBenefit = await updateBenefitByIdService({
          _id: benefitId,
          fields,
          updateOperator,
        });

        return updatedBenefit;
      })
    );

    const successfullyCreatedBenefits = updatedBenefits.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedBenefits.length === 0) {
      throw new createHttpError.InternalServerError(
        "No Benefit Requests were updated. Please try again!"
      );
    }

    response.status(201).json({
      message: `Successfully created ${successfullyCreatedBenefits.length} Benefits. ${
        benefitFields.length - successfullyCreatedBenefits.length
      } Benefits failed to be created.`,
      resourceData: successfullyCreatedBenefits,
    });
  }
);

export {
  createNewBenefitController,
  getQueriedBenefitsController,
  getBenefitsByUserController,
  getBenefitByIdController,
  deleteBenefitController,
  deleteAllBenefitsController,
  updateBenefitByIdController,
  createNewBenefitsBulkController,
  updateBenefitsBulkController,
};
