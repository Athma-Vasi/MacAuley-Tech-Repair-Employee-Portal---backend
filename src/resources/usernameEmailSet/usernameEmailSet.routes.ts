import { Router } from "express";
import { verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  checkUsernameEmailExistsHandler,
  postUsernameEmailSetHandler,
} from "./usernameEmailSet.controller";

const usernameEmailSetRouter = Router();

usernameEmailSetRouter
  .route("/")
  .post(verifyJWTMiddleware, verifyRoles(), postUsernameEmailSetHandler)
  .get(checkUsernameEmailExistsHandler);

export { usernameEmailSetRouter };
