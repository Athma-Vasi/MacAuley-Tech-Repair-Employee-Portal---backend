import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createMotherboardJoiSchema,
  updateMotherboardJoiSchema,
} from "./motherboard.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { MotherboardModel } from "./motherboard.model";

const motherboardRouter = Router();

motherboardRouter
  .route("/")
  // @desc   Get all motherboards
  // @route  GET api/v1/product-category/motherboard
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(MotherboardModel))
  // @desc   Create a new motherboard
  // @route  POST api/v1/product-category/motherboard
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createMotherboardJoiSchema, "schema"),
    createNewResourceHandler(MotherboardModel),
  );

// @desc   Delete all motherboards
// @route  DELETE api/v1/product-category/motherboard/delete-all
// @access Private/Admin/Manager
motherboardRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(MotherboardModel),
);

// @desc   Get all motherboards by user
// @route  GET api/v1/product-category/motherboard/user
// @access Private/Admin/Manager
motherboardRouter.route("/user").get(
  getQueriedResourcesByUserHandler(MotherboardModel),
);

motherboardRouter
  .route("/:resourceId")
  // @desc   Get a motherboard by its ID
  // @route  GET api/v1/product-category/motherboard/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(MotherboardModel))
  // @desc   Delete a motherboard by its ID
  // @route  DELETE api/v1/product-category/motherboard/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(MotherboardModel))
  // @desc   Update a motherboard by its ID
  // @route  PATCH api/v1/product-category/motherboard/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateMotherboardJoiSchema),
    updateResourceByIdHandler(MotherboardModel),
  );

export { motherboardRouter };
