import { Router } from "express";

import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  createNewUserHandler,
  createNewUsersBulkHandler,
  deleteUserHandler,
  getAllUsersBulkHandler,
  getQueriedUsersHandler,
  getUserByIdHandler,
  getUsersDirectoryHandler,
  updateUserByIdHandler,
  updateUserFieldsBulkHandler,
  updateUserPasswordHandler,
} from "./user.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const userRouter = Router();

userRouter.use(verifyJWTMiddleware, verifyRoles());

userRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedUsersHandler)
  .post(createNewUserHandler);

userRouter.route("/update-password").put(updateUserPasswordHandler);

userRouter.route("/delete-all").delete(deleteUserHandler);

userRouter.route("/directory").get(getUsersDirectoryHandler);

// DEV ROUTES
userRouter
  .route("/dev")
  .post(createNewUsersBulkHandler)
  .get(getAllUsersBulkHandler)
  .patch(updateUserFieldsBulkHandler);

userRouter
  .route("/:userId")
  .get(getUserByIdHandler)
  .patch(updateUserByIdHandler)
  .delete(deleteUserHandler);

export { userRouter };
