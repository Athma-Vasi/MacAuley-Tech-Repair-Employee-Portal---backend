import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createPsuJoiSchema, updatePsuJoiSchema } from "./psu.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { PsuModel } from "./psu.model";

const psuRouter = Router();

psuRouter
  .route("/")
  // @desc   Get all psus
  // @route  GET api/v1/product-category/psu
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(PsuModel))
  // @desc   Create a new psu
  // @route  POST api/v1/product-category/psu
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createPsuJoiSchema, "schema"),
    createNewResourceHandler(PsuModel),
  );

// @desc   Delete many psus
// @route  DELETE api/v1/product-category/psu/delete-many
// @access Private/Admin/Manager
psuRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(PsuModel),
);

// @desc   Get all psus by user
// @route  GET api/v1/product-category/psu/user
// @access Private/Admin/Manager
psuRouter.route("/user").get(
  getQueriedResourcesByUserHandler(PsuModel),
);

psuRouter
  .route("/:resourceId")
  // @desc   Get a psu by its ID
  // @route  GET api/v1/product-category/psu/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(PsuModel))
  // @desc   Delete a psu by its ID
  // @route  DELETE api/v1/product-category/psu/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(PsuModel))
  // @desc   Update a psu by its ID
  // @route  PATCH api/v1/product-category/psu/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updatePsuJoiSchema),
    updateResourceByIdHandler(PsuModel),
  );

export { psuRouter };
