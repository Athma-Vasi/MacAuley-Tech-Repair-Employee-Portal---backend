import { Router } from "express";

import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  createNewUserController,
  createNewUsersBulkController,
  deleteAllUsersController,
  deleteUserController,
  getAllUsersBulkController,
  getQueriedUsersController,
  getUserByIdController,
  updateUserByIdController,
  updateUserFieldsBulkController,
  updateUserPasswordController,
} from "./user.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createUserJoiSchema, updateUserJoiSchema } from "./user.validation";

const userRouter = Router();

userRouter
  .route("/")
  .get(verifyJWTMiddleware, verifyRoles, assignQueryDefaults, getQueriedUsersController)
  .post(
    validateSchemaMiddleware(createUserJoiSchema, "userSchema"),
    createNewUserController
  );

userRouter
  .route("/update-password")
  .put(verifyJWTMiddleware, verifyRoles, updateUserPasswordController);

userRouter
  .route("/delete-all")
  .delete(verifyJWTMiddleware, verifyRoles, deleteAllUsersController);

// DEV ROUTES
userRouter
  .route("/dev")
  .post(verifyJWTMiddleware, verifyRoles, createNewUsersBulkController)
  .get(verifyJWTMiddleware, verifyRoles, assignQueryDefaults, getAllUsersBulkController)
  .patch(verifyJWTMiddleware, verifyRoles, updateUserFieldsBulkController);

userRouter
  .route("/:userId")
  .get(verifyJWTMiddleware, verifyRoles, assignQueryDefaults, getUserByIdController)
  .delete(verifyJWTMiddleware, verifyRoles, deleteUserController)
  .patch(
    verifyJWTMiddleware,
    verifyRoles,
    validateSchemaMiddleware(updateUserJoiSchema),
    updateUserByIdController
  );

export { userRouter };
