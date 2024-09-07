import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createAccessoryJoiSchema,
  updateAccessoryJoiSchema,
} from "./accessory.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
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

// @desc   Delete all accessories
// @route  DELETE api/v1/product-category/accessory/delete-all
// @access Private/Admin/Manager
accessoryRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(AccessoryModel),
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
