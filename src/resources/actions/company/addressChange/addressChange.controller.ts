import expressAsyncController from "express-async-handler";

import {
  type AddressChangeDocument,
  AddressChangeModel,
  type AddressChangeSchema,
} from "./addressChange.model";
import type { Response } from "express";

import { UserDocument, UserModel } from "../../../user";

import {
  CreateNewResourceRequest,
  DeleteAllResourcesRequest,
  DeleteResourceRequest,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
  GetResourceByIdRequest,
  HttpResult,
  UpdateResourceByIdRequest,
} from "../../../../types";
import {
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
} from "../../../../utils";
import { createNewErrorLogService } from "../../../errorLog";
import {
  createNewResourceService,
  deleteAllResourcesService,
  deleteResourceByIdService,
  getQueriedResourcesByUserService,
  getQueriedResourcesService,
  getQueriedTotalResourcesService,
  getResourceByIdService,
  updateResourceByIdService,
} from "../../../../services";
import { de } from "date-fns/locale";
import {
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  updateResourceByIdHandler,
} from "../../../../handlers";

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

    const getUserResult = await getResourceByIdService(
      userId,
      UserModel,
    );
    if (getUserResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(getUserResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({ message: getUserResult.val.message }),
      );
      return;
    }

    const unwrappedResult = getUserResult.safeUnwrap().data;
    if (unwrappedResult.length === 0) {
      response.status(200).json(
        createHttpResultError({ message: "User not found" }),
      );
      return;
    }

    const { address: oldAddress } = unwrappedResult[0] as UserDocument;
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
        createHttpResultError({ message: "No changes detected" }),
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

    const createResourceResult = await createNewResourceService(
      addressChangeSchema,
      AddressChangeModel,
    );

    if (createResourceResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(createResourceResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({ message: createResourceResult.val.message }),
      );
      return;
    }

    response.status(201).json(createResourceResult.safeUnwrap());
  },
);

// @desc   Get all address changes
// @route  GET api/v1/actions/company/address-change
// @access Private/Admin/Manager
const getQueriedAddressChangesController = getQueriedResourcesHandler(
  AddressChangeModel,
);

// @desc   Get all address change requests by user
// @route  GET api/v1/actions/company/address-change/user
// @access Private
const getAddressChangesByUserController = getQueriedResourcesByUserHandler(
  AddressChangeModel,
);

// @desc   Update address change status
// @route  PATCH api/v1/actions/company/address-change/:resourceId
// @access Private/Admin/Manager
const updateAddressChangeByIdController = updateResourceByIdHandler(
  AddressChangeModel,
);

// @desc   Get an address change request
// @route  GET api/v1/actions/company/address-change/:resourceId
// @access Private
const getAddressChangeByIdController = expressAsyncController(
  async (
    request: GetResourceByIdRequest,
    response: Response<HttpResult<AddressChangeDocument>>,
  ) => {
    const { resourceId } = request.params;

    const getResourceResult = await getResourceByIdService(
      resourceId,
      AddressChangeModel,
    );

    if (getResourceResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(getResourceResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({ message: getResourceResult.val.message }),
      );
      return;
    }

    response
      .status(200)
      .json(
        getResourceResult.safeUnwrap() as HttpResult<AddressChangeDocument>,
      );
  },
);

// @desc   Delete an address change request by its id
// @route  DELETE api/v1/actions/company/address-change/:resourceId
// @access Private
const deleteAnAddressChangeController = expressAsyncController(
  async (
    request: DeleteResourceRequest,
    response: Response<HttpResult>,
  ) => {
    const { resourceId } = request.params;

    const deletedResult = await deleteResourceByIdService(
      resourceId,
      AddressChangeModel,
    );

    if (deletedResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(deletedResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({ message: deletedResult.val.message }),
      );
      return;
    }

    response.status(200).json(createHttpResultSuccess({}));
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
    const deletedResult = await deleteAllResourcesService(AddressChangeModel);

    if (deletedResult.err) {
      await createNewErrorLogService(
        createErrorLogSchema(deletedResult.val, request.body),
      );

      response.status(200).json(
        createHttpResultError({ message: deletedResult.val.message }),
      );
      return;
    }

    response.status(200).json(createHttpResultSuccess({}));
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
