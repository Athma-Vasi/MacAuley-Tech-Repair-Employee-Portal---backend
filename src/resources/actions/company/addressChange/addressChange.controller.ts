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

import { HttpResult, QueryObjectParsedWithDefaults } from "../../../../types";
import { createErrorLogSchema, createHttpResult } from "../../../../utils";
import { createNewErrorLogService } from "../../../errorLog";
import { RequestAfterJWTVerification } from "../../../auth";

// @desc   Create a new address change request
// @route  POST api/v1/actions/company/address-change
// @access Private
const createNewAddressChangeController = expressAsyncController(
  async (
    request: CreateNewAddressChangeRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const {
      userInfo: { userId, username },
      addressChangeSchema: {
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
        createHttpResult({
          kind: "error",
          message: "User does not exist",
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
        createHttpResult({
          kind: "error",
          message: "New address is the same as the old address",
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
        createHttpResult({
          kind: "error",
          message: "Address change document could not be created",
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
    request: GetQueriedAddressChangesRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    let {
      newQueryFlag,
      totalDocuments,
      userInfo: { userId, username },
      sessionId,
    } = request.body;

    const { filter, projection, options } = request
      .query as QueryObjectParsedWithDefaults;

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
          createHttpResult({
            kind: "error",
            message: "Error getting total address changes",
          }),
        );
        return;
      }
      totalDocuments = totalResult.safeUnwrap().data?.[0] ?? 0;
    }

    const addressChangesResult = await getQueriedAddressChangesService({
      filter: filter as FilterQuery<AddressChangeDocument> | undefined,
      projection: projection as QueryOptions<AddressChangeDocument>,
      options: options as QueryOptions<AddressChangeDocument>,
    });

    if (addressChangesResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(addressChangesResult.val, request.body),
      );

      response.status(200).json(
        createHttpResult({
          kind: "error",
          message: "Error getting queried address changes",
        }),
      );
    } else {
      response.status(200).json(
        createHttpResult({
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
    request: GetQueriedAddressChangesByUserRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request
      .query as QueryObjectParsedWithDefaults;

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
          createHttpResult({
            kind: "error",
            message: "Error getting total address changes",
          }),
        );

        return;
      }
      totalDocuments = totalResult.safeUnwrap().data?.[0] ?? 0;
    }

    const addressChangesResult = await getQueriedAddressChangesByUserService({
      filter: filterWithUserId as
        | FilterQuery<AddressChangeDocument>
        | undefined,
      projection: projection as QueryOptions<AddressChangeDocument>,
      options: options as QueryOptions<AddressChangeDocument>,
    });

    if (addressChangesResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(addressChangesResult.val, request.body),
      );

      response.status(200).json(
        createHttpResult({
          kind: "error",
          message: "Error getting address changes by user",
        }),
      );
    } else {
      response.status(200).json(
        createHttpResult({
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
    request: UpdateAddressChangeByIdRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const { addressChangeId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedAddressChangeResult = await updateAddressChangeByIdService({
      _id: addressChangeId,
      fields,
      updateOperator,
    });

    if (updatedAddressChangeResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(updatedAddressChangeResult.val, request.body),
      );

      response.status(200).json(
        createHttpResult({
          kind: "error",
          message: "Address change document status update failed",
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
    request: GetAddressChangeByIdRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const { addressChangeId } = request.params;

    const addressChangeResult = await getAddressChangeByIdService(
      addressChangeId,
    );

    if (addressChangeResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(addressChangeResult.val, request.body),
      );

      response.status(200).json(
        createHttpResult({
          kind: "error",
          message: "Address change document could not be found",
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
    request: DeleteAnAddressChangeRequest,
    response: Response<HttpResult>,
  ) => {
    const { addressChangeId } = request.params;

    const deletedResult = await deleteAddressChangeByIdService(addressChangeId);

    if (deletedResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(deletedResult.val, request.body),
      );

      response.status(200).json(
        createHttpResult({
          message: "Address change document could not be deleted",
          kind: "error",
        }),
      );
    } else {
      response.status(200).json(createHttpResult({}));
    }
  },
);

// @desc    Delete all address change requests
// @route   DELETE api/v1/actions/company/address-change/delete-all
// @access  Private
const deleteAllAddressChangesController = expressAsyncController(
  async (
    request: DeleteAllAddressChangesRequest,
    response: Response<HttpResult>,
  ) => {
    const deletedResult = await deleteAllAddressChangesService();

    if (deletedResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(deletedResult.val, request.body),
      );

      response.status(200).json(
        createHttpResult({
          message: "Address change documents could not be deleted",
          kind: "error",
        }),
      );
    } else {
      response.status(200).json(createHttpResult({}));
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
