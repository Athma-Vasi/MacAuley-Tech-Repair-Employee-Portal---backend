import expressAsyncHandler from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { Response } from "express";
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
  GetQueriedResourceRequest,
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import { FilterQuery, QueryOptions } from "mongoose";

import { getUserByIdService, getUserByUsernameService } from "../../../user";
import { removeUndefinedAndNullValues } from "../../../../utils";

// @desc   Create a new benefits plan
// @route  POST /benefits
// @access Private/Admin/Manager
const createNewBenefitHandler = expressAsyncHandler(
  async (
    request: CreateNewBenefitRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>
  ) => {
    const {
      userInfo: { roles, username },
      benefitFields,
    } = request.body;

    // only managers can create a new benefits plan
    // by default, verifyRoles middleware allows all to access POST routes
    if (!roles.includes("Manager")) {
      response
        .status(403)
        .json({ message: "User does not have permission", resourceData: [] });
      return;
    }

    // get userId from benefit username
    const benefitUserDoc = await getUserByUsernameService(username);
    if (!benefitUserDoc) {
      response.status(404).json({ message: "User not found", resourceData: [] });
      return;
    }
    const benefitUserId = benefitUserDoc._id;

    const benefitSchema: BenefitSchema = {
      ...benefitFields,
      benefitUserId,
      username,
    };

    const benefitDocument = await createNewBenefitService(benefitSchema);
    if (!benefitDocument) {
      response
        .status(400)
        .json({ message: "Unable to create new benefit plan", resourceData: [] });
      return;
    }

    response
      .status(201)
      .json({ message: "New benefit plan created", resourceData: [benefitDocument] });
  }
);

// @desc   Get all benefits
// @route  GET api/v1/company/benefit
// @access Private/Admin/Manager
const getQueriedBenefitsHandler = expressAsyncHandler(
  async (
    request: GetQueriedResourceRequest,
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

    // get all benefits
    const benefit = await getQueriedBenefitsService({
      filter: filter as FilterQuery<BenefitDocument> | undefined,
      projection: projection as QueryOptions<BenefitDocument>,
      options: options as QueryOptions<BenefitDocument>,
    });

    if (!benefit.length) {
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
      resourceData: benefit,
    });
  }
);

// @desc   Get all benefit requests by user
// @route  GET api/v1/company/benefit/user
// @access Private
const getBenefitsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedBenefitsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<BenefitDocument>>
  ) => {
    // anyone can view their own benefit requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalBenefitsService({
        filter: filterWithUserId,
      });
    }

    // get all benefit requests by user
    const benefits = await getQueriedBenefitsByUserService({
      filter: filterWithUserId as FilterQuery<BenefitDocument> | undefined,
      projection: projection as QueryOptions<BenefitDocument>,
      options: options as QueryOptions<BenefitDocument>,
    });

    if (!benefits.length) {
      response.status(200).json({
        message: "No benefit requests found",
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
// @route  PATCH api/v1/company/benefit/:benefitId
// @access Private/Admin/Manager
const updateBenefitStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateBenefitByIdRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>
  ) => {
    const { benefitId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update benefit request status
    const updatedBenefit = await updateBenefitByIdService({
      _id: benefitId,
      fields,
      updateOperator,
    });

    if (!updatedBenefit) {
      response.status(400).json({
        message: "Benefit request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Benefit request status updated successfully",
      resourceData: [updatedBenefit],
    });
  }
);

// @desc   Get an benefit request
// @route  GET api/v1/company/benefit/:benefitId
// @access Private
const getBenefitByIdHandler = expressAsyncHandler(
  async (
    request: GetBenefitByIdRequest,
    response: Response<ResourceRequestServerResponse<BenefitDocument>>
  ) => {
    const { benefitId } = request.params;
    const benefit = await getBenefitByIdService(benefitId);
    if (!benefit) {
      response
        .status(404)
        .json({ message: "Benefit request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Benefit request found successfully",
      resourceData: [benefit],
    });
  }
);

// @desc   Delete an benefit request by its id
// @route  DELETE api/v1/company/benefit/:benefitId
// @access Private
const deleteBenefitHandler = expressAsyncHandler(
  async (request: DeleteAnBenefitRequest, response: Response) => {
    const { benefitId } = request.params;

    // delete benefit request by id
    const deletedResult: DeleteResult = await deleteBenefitByIdService(benefitId);

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Benefit request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Benefit request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all benefit requests
// @route   DELETE api/v1/company/benefit/delete-all
// @access  Private
const deleteAllBenefitsHandler = expressAsyncHandler(
  async (_request: DeleteAllBenefitsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllBenefitsService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All benefit requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All benefit requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new benefit requests in bulk
// @route  POST api/v1/company/benefit/dev
// @access Private
const createNewBenefitsBulkHandler = expressAsyncHandler(
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

    // filter out any null documents
    const filteredBenefitDocuments = benefitDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredBenefitDocuments.length === 0) {
      response.status(400).json({
        message: "Benefit requests creation failed",
        resourceData: [],
      });
      return;
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
// @route  PATCH api/v1/company/benefit/dev
// @access Private
const updateBenefitsBulkHandler = expressAsyncHandler(
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

    // filter out any benefits that were not created
    const successfullyCreatedBenefits = updatedBenefits.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedBenefits.length === 0) {
      response.status(400).json({
        message: "Could not create any Benefits",
        resourceData: [],
      });
      return;
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
  createNewBenefitHandler,
  getQueriedBenefitsHandler,
  getBenefitsByUserHandler,
  getBenefitByIdHandler,
  deleteBenefitHandler,
  deleteAllBenefitsHandler,
  updateBenefitStatusByIdHandler,
  createNewBenefitsBulkHandler,
  updateBenefitsBulkHandler,
};
