import { Router } from "express";
import { verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  checkUsernameEmailExistsHandler,
  postUsernameEmailSetHandler,
} from "./usernameEmailSet.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createUsernameEmailSetJoiSchema } from "./usernameEmailSet.validation";

const usernameEmailSetRouter = Router();

usernameEmailSetRouter
  .route("/")
  .post(
    verifyJWTMiddleware,
    verifyRoles,
    validateSchemaMiddleware(createUsernameEmailSetJoiSchema, "usernameEmailSetSchema"),
    postUsernameEmailSetHandler
  );

usernameEmailSetRouter.route("/check").post(checkUsernameEmailExistsHandler);

export { usernameEmailSetRouter };
