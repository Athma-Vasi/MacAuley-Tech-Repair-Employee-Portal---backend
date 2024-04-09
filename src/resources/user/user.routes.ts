import { Router } from "express";

import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  createNewUserHandler,
  createNewUsersBulkHandler,
  deleteAllUsersHandler,
  deleteUserHandler,
  getAllUsersBulkHandler,
  getQueriedUsersHandler,
  getUserByIdHandler,
  updateUserByIdHandler,
  updateUserFieldsBulkHandler,
  updateUserPasswordHandler,
} from "./user.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createUserJoiSchema, updateUserJoiSchema } from "./user.validation";

const userRouter = Router();

userRouter
  .route("/")
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getQueriedUsersHandler)
  .post(
    validateSchemaMiddleware(createUserJoiSchema, "userSchema"),
    createNewUserHandler
  );

userRouter
  .route("/update-password")
  .put(verifyJWTMiddleware, verifyRoles(), updateUserPasswordHandler);

userRouter
  .route("/delete-all")
  .delete(verifyJWTMiddleware, verifyRoles(), deleteAllUsersHandler);

// DEV ROUTES
userRouter
  .route("/dev")
  .post(verifyJWTMiddleware, verifyRoles(), createNewUsersBulkHandler)
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getAllUsersBulkHandler)
  .patch(verifyJWTMiddleware, verifyRoles(), updateUserFieldsBulkHandler);

userRouter
  .route("/:userId")
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getUserByIdHandler)
  .delete(verifyJWTMiddleware, verifyRoles(), deleteUserHandler)
  .patch(
    verifyJWTMiddleware,
    verifyRoles(),
    validateSchemaMiddleware(updateUserJoiSchema),
    updateUserByIdHandler
  );

export { userRouter };
