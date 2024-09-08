import { Router } from "express";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createUserJoiSchema, updateUserJoiSchema } from "./user.validation";
import {
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../handlers";
import { UserModel } from "./user.model";
import { createNewUserHandler } from "./user.controller";

const userRouter = Router();

userRouter
  .route("/")
  // @desc   Get all users
  // @route  GET api/v1/product-category/user
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(UserModel))
  // @desc   Create a new user
  // @route  POST api/v1/product-category/user
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createUserJoiSchema, "schema"),
    createNewUserHandler(UserModel),
  );

// @desc   Delete all users
// @route  DELETE api/v1/product-category/user/delete-all
// @access Private/Admin/Manager
userRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(UserModel),
);

// @desc   Get all users by user
// @route  GET api/v1/product-category/user/user
// @access Private/Admin/Manager
userRouter.route("/user").get(
  getQueriedResourcesByUserHandler(UserModel),
);

userRouter
  .route("/:resourceId")
  // @desc   Get an user by their ID
  // @route  GET api/v1/product-category/user/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(UserModel))
  // @desc   Delete an user by their ID
  // @route  DELETE api/v1/product-category/user/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(UserModel))
  // @desc   Update an user by their ID
  // @route  PATCH api/v1/product-category/user/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateUserJoiSchema),
    updateResourceByIdHandler(UserModel),
  );

export { userRouter };
