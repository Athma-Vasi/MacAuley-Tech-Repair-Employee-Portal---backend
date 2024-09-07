import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createComputerCaseJoiSchema,
  updateComputerCaseJoiSchema,
} from "./computerCase.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { ComputerCaseModel } from "./computerCase.model";

const computerCaseRouter = Router();

computerCaseRouter
  .route("/")
  // @desc   Get all computerCases
  // @route  GET api/v1/product-category/computer-case
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(ComputerCaseModel))
  // @desc   Create a new computerCase
  // @route  POST api/v1/product-category/computer-case
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createComputerCaseJoiSchema, "schema"),
    createNewResourceHandler(ComputerCaseModel),
  );

// @desc   Delete all computerCases
// @route  DELETE api/v1/product-category/computer-case/delete-all
// @access Private/Admin/Manager
computerCaseRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(ComputerCaseModel),
);

// @desc   Get all computerCases by user
// @route  GET api/v1/product-category/computer-case/user
// @access Private/Admin/Manager
computerCaseRouter.route("/user").get(
  getQueriedResourcesByUserHandler(ComputerCaseModel),
);

computerCaseRouter
  .route("/:resourceId")
  // @desc   Get a computerCase by its ID
  // @route  GET api/v1/product-category/computer-case/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(ComputerCaseModel))
  // @desc   Delete a computerCase by its ID
  // @route  DELETE api/v1/product-category/computer-case/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(ComputerCaseModel))
  // @desc   Update a computerCase by its ID
  // @route  PATCH api/v1/product-category/computer-case/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateComputerCaseJoiSchema),
    updateResourceByIdHandler(ComputerCaseModel),
  );

export { computerCaseRouter };
