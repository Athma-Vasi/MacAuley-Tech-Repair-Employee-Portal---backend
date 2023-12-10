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
  getUsersDirectoryHandler,
  updateUserByIdHandler,
  updateUserFieldsBulkHandler,
  updateUserPasswordHandler,
} from "./user.controller";

const userRouter = Router();

userRouter
  .route("/")
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getQueriedUsersHandler)
  .post(createNewUserHandler);

userRouter
  .route("/update-password")
  .put(verifyJWTMiddleware, verifyRoles(), updateUserPasswordHandler);

userRouter
  .route("/delete-all")
  .delete(verifyJWTMiddleware, verifyRoles(), deleteAllUsersHandler);

userRouter
  .route("/directory")
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getUsersDirectoryHandler);

// DEV ROUTES
userRouter
  .route("/dev")
  .post(verifyJWTMiddleware, verifyRoles(), createNewUsersBulkHandler)
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getAllUsersBulkHandler)
  .patch(verifyJWTMiddleware, verifyRoles(), updateUserFieldsBulkHandler);

userRouter
  .route("/:userId")
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getUserByIdHandler)
  .patch(verifyJWTMiddleware, verifyRoles(), updateUserByIdHandler)
  .delete(verifyJWTMiddleware, verifyRoles(), deleteUserHandler);

export { userRouter };
