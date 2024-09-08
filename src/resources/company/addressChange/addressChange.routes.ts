import { Router } from "express";
import { createNewAddressChangeController } from "./addressChange.handler";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createAddressChangeJoiSchema,
  updateAddressChangeJoiSchema,
} from "./addressChange.validation";
import {
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { AddressChangeModel } from "./addressChange.model";

const addressChangeRouter = Router();

addressChangeRouter
  .route("/")
  // @desc   Get all address changes
  // @route  GET api/v1/company/address-change
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(AddressChangeModel))
  // @desc   Create a new address change request
  // @route  POST api/v1/company/address-change
  // @access Private
  .post(
    validateSchemaMiddleware(
      createAddressChangeJoiSchema,
      "schema",
    ),
    createNewAddressChangeController,
  );

// @desc    Delete many address change requests
// @route   DELETE api/v1/company/address-change/delete-many
// @access  Private
addressChangeRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(AddressChangeModel),
);

// @desc   Get all address change requests by user
// @route  GET api/v1/company/address-change/user
// @access Private
addressChangeRouter.route("/user").get(
  getQueriedResourcesByUserHandler(AddressChangeModel),
);

addressChangeRouter
  .route("/:resourceId")
  // @desc   Get an address change request
  // @route  GET api/v1/company/address-change/:resourceId
  // @access Private
  .get(getResourceByIdHandler(AddressChangeModel))
  // @desc   Delete an address change request by its id
  // @route  DELETE api/v1/company/address-change/:resourceId
  // @access Private
  .delete(deleteResourceByIdHandler(AddressChangeModel))
  // @desc   Update address change status
  // @route  PATCH api/v1/company/address-change/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateAddressChangeJoiSchema),
    updateResourceByIdHandler(AddressChangeModel),
  );

export { addressChangeRouter };
