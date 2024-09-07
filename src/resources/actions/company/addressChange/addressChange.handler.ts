import expressAsyncController from "express-async-handler";
import {
  type AddressChangeDocument,
  AddressChangeModel,
  type AddressChangeSchema,
} from "./addressChange.model";
import type { Response } from "express";
import { UserDocument, UserModel } from "../../../user";
import type { CreateNewResourceRequest, HttpResult } from "../../../../types";
import { createErrorLogSchema, createHttpResultError } from "../../../../utils";
import { createNewErrorLogService } from "../../../errorLog";
import {
  createNewResourceService,
  getResourceByIdService,
} from "../../../../services";

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
        requestStatus,
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
      requestStatus,
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

export { createNewAddressChangeController };
