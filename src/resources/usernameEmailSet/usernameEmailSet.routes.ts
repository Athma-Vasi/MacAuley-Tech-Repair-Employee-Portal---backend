import { Router } from "express";
import { verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  checkUsernameEmailExistsController,
  postUsernameEmailSetController,
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
    postUsernameEmailSetController
  );

usernameEmailSetRouter.route("/check").post(checkUsernameEmailExistsController);

export { usernameEmailSetRouter };
