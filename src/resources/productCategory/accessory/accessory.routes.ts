import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createAccessoryJoiSchema,
  updateAccessoryJoiSchema,
} from "./accessory.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { AccessoryModel } from "./accessory.model";

const accessoryRouter = Router();

accessoryRouter
  .route("/")
  // @desc   Get all accessories
  // @route  GET api/v1/product-category/accessory
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(AccessoryModel))
  // @desc   Create a new accessory
  // @route  POST api/v1/product-category/accessory
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createAccessoryJoiSchema, "schema"),
    createNewResourceHandler(AccessoryModel),
  );

// @desc   Delete many accessories
// @route  DELETE api/v1/product-category/accessory/delete-many
// @access Private/Admin/Manager
accessoryRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(AccessoryModel),
);

// @desc   Get all accessories by user
// @route  GET api/v1/product-category/accessory/user
// @access Private/Admin/Manager
accessoryRouter.route("/user").get(
  getQueriedResourcesByUserHandler(AccessoryModel),
);

accessoryRouter
  .route("/:resourceId")
  // @desc   Get an accessory by its ID
  // @route  GET api/v1/product-category/accessory/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(AccessoryModel))
  // @desc   Delete an accessory by its ID
  // @route  DELETE api/v1/product-category/accessory/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(AccessoryModel))
  // @desc   Update an accessory by its ID
  // @route  PATCH api/v1/product-category/accessory/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateAccessoryJoiSchema),
    updateResourceByIdHandler(AccessoryModel),
  );

export { accessoryRouter };
