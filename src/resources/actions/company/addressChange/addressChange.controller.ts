import expressAsyncController from "express-async-handler";

import type {
  AddressChangeDocument,
  AddressChangeSchema,
} from "./addressChange.model";
import type { Response } from "express";
import type {
  CreateNewAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  DeleteAnAddressChangeRequest,
  GetAddressChangeByIdRequest,
  GetQueriedAddressChangesByUserRequest,
  GetQueriedAddressChangesRequest,
  UpdateAddressChangeByIdRequest,
} from "./addressChange.types";

import { getUserByIdService } from "../../../user";
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getQueriedAddressChangesByUserService,
  getQueriedAddressChangesService,
  getQueriedTotalAddressChangesService,
  updateAddressChangeByIdService,
} from "./addressChange.service";
import { FilterQuery, QueryOptions } from "mongoose";

import {
  CreateNewResourceRequest,
  DeleteAllResourcesRequest,
  DeleteResourceRequest,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
  GetResourceByIdRequest,
  HttpResult,
  QueryObjectParsedWithDefaults,
  UpdateResourceByIdRequest,
} from "../../../../types";
import {
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
} from "../../../../utils";
import { createNewErrorLogService } from "../../../errorLog";
import { RequestAfterJWTVerification } from "../../../auth";

// @desc   Create a new address change request
// @route  POST api/v1/actions/company/address-change
// @access Private
const createNewAddressChangeController = expressAsyncController(
  async (
    request: CreateNewResourceRequest<AddressChangeSchema>,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const {
      userInfo: { userId, username },
      schema: {
        contactNumber,
        addressLine,
        city,
        country,
        postalCode,
        province,
        state,
        acknowledgement,
      },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (userExists === null || userExists === undefined) {
      response.status(200).json(
        createHttpResultError({
          message: "User does not exist",
          status: 404,
        }),
      );
      return;
    }

    const { address: oldAddress } = userExists;
    const newAddress = {
      contactNumber,
      addressLine,
      city,
      country,
      postalCode,
      province,
      state,
    };
    if (JSON.stringify(newAddress) === JSON.stringify(oldAddress)) {
      response.status(200).json(
        createHttpResultError({
          message: "New address is the same as the old address",
          status: 400,
        }),
      );
      return;
    }

    const addressChangeSchema: AddressChangeSchema = {
      userId,
      username,
      contactNumber,
      addressLine,
      city,
      country,
      postalCode,
      province,
      state,
      acknowledgement,
      requestStatus: "pending",
    };

    const addressChangeDocumentResult = await createNewAddressChangeService(
      addressChangeSchema,
    );

    if (addressChangeDocumentResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(addressChangeDocumentResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({
          message: "Address change document could not be created",
          status: 400,
        }),
      );
    } else {
      response.status(201).json(addressChangeDocumentResult.safeUnwrap());
    }
  },
);

// @desc   Get all address changes
// @route  GET api/v1/actions/company/address-change
// @access Private/Admin/Manager
const getQueriedAddressChangesController = expressAsyncController(
  async (
    request: GetQueriedResourceRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    let {
      newQueryFlag,
      totalDocuments,
    } = request.body;

    const { filter, projection, options } = request.query;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      const totalResult = await getQueriedTotalAddressChangesService({
        filter: filter as FilterQuery<AddressChangeDocument> | undefined,
      });
      if (totalResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(totalResult.val, request.body),
        );

        response.status(200).json(
          createHttpResultError({
            message: "Error getting total address changes",
            status: 400,
          }),
        );
        return;
      }
      totalDocuments = totalResult.safeUnwrap().data?.[0] ?? 0;
    }

    const addressChangesResult = await getQueriedAddressChangesService({
      filter,
      projection,
      options,
    });

    if (addressChangesResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(addressChangesResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({
          message: "Error getting queried address changes",
          status: 400,
        }),
      );
    } else {
      response.status(200).json(
        createHttpResultSuccess({
          data: addressChangesResult.safeUnwrap().data,
          pages: Math.ceil(totalDocuments / Number(options?.limit ?? 10)),
          totalDocuments,
        }),
      );
    }
  },
);

// @desc   Get all address change requests by user
// @route  GET api/v1/actions/company/address-change/user
// @access Private
const getAddressChangesByUserController = expressAsyncController(
  async (
    request: GetQueriedResourceByUserRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      const totalResult = await getQueriedTotalAddressChangesService({
        filter: filterWithUserId,
      });

      if (totalResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(totalResult.val, request.body),
        );

        response.status(200).json(
          createHttpResultError({
            message: "Error getting total address changes",
            status: 400,
          }),
        );

        return;
      }
      totalDocuments = totalResult.safeUnwrap().data?.[0] ?? 0;
    }

    const addressChangesResult = await getQueriedAddressChangesByUserService({
      filter,
      projection,
      options,
    });

    if (addressChangesResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(addressChangesResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({
          message: "Error getting address changes by user",
          status: 400,
        }),
      );
    } else {
      response.status(200).json(
        createHttpResultSuccess({
          data: addressChangesResult.safeUnwrap().data,
          pages: Math.ceil(totalDocuments / Number(options?.limit ?? 10)),
          totalDocuments,
        }),
      );
    }
  },
);

// @desc   Update address change status
// @route  PATCH api/v1/actions/company/address-change/:addressChangeId
// @access Private/Admin/Manager
const updateAddressChangeByIdController = expressAsyncController(
  async (
    request: UpdateResourceByIdRequest<AddressChangeDocument>,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const { resourceId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedAddressChangeResult = await updateAddressChangeByIdService({
      _id: resourceId,
      fields,
      updateOperator,
    });

    if (updatedAddressChangeResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(updatedAddressChangeResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({
          message: "Address change document status update failed",
          status: 400,
        }),
      );
    } else {
      response
        .status(200)
        .json(
          updatedAddressChangeResult.safeUnwrap() as HttpResult<
            AddressChangeDocument
          >,
        );
    }
  },
);

// @desc   Get an address change request
// @route  GET api/v1/actions/company/address-change/:addressChangeId
// @access Private
const getAddressChangeByIdController = expressAsyncController(
  async (
    request: GetResourceByIdRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const { resourceId } = request.params;

    const addressChangeResult = await getAddressChangeByIdService(
      resourceId,
    );

    if (addressChangeResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(addressChangeResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({
          message: "Address change document could not be found",
          status: 404,
        }),
      );
    } else {
      response
        .status(200)
        .json(
          addressChangeResult.safeUnwrap() as HttpResult<AddressChangeDocument>,
        );
    }
  },
);

// @desc   Delete an address change request by its id
// @route  DELETE api/v1/actions/company/address-change/:addressChangeId
// @access Private
const deleteAnAddressChangeController = expressAsyncController(
  async (
    request: DeleteResourceRequest,
    response: Response<HttpResult>,
  ) => {
    const { resourceId } = request.params;

    const deletedResult = await deleteAddressChangeByIdService(resourceId);

    if (deletedResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(deletedResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({
          message: "Address change document could not be deleted",
          status: 400,
        }),
      );
    } else {
      response.status(200).json(createHttpResultSuccess({}));
    }
  },
);

// @desc    Delete all address change requests
// @route   DELETE api/v1/actions/company/address-change/delete-all
// @access  Private
const deleteAllAddressChangesController = expressAsyncController(
  async (
    request: DeleteAllResourcesRequest,
    response: Response<HttpResult>,
  ) => {
    const deletedResult = await deleteAllAddressChangesService();

    if (deletedResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(deletedResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({
          message: "Address change documents could not be deleted",
          status: 400,
        }),
      );
    } else {
      response.status(200).json(createHttpResultSuccess({}));
    }
  },
);

export {
  createNewAddressChangeController,
  deleteAllAddressChangesController,
  deleteAnAddressChangeController,
  getAddressChangeByIdController,
  getAddressChangesByUserController,
  getQueriedAddressChangesController,
  updateAddressChangeByIdController,
};
