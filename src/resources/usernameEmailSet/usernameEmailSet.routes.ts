import { Router } from "express";
import {
  checkUsernameOrEmailExistsHandler,
  postUsernameEmailSetHandler,
} from "./usernameEmailSet.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createUsernameEmailSetJoiSchema } from "./usernameEmailSet.validation";
import { UsernameEmailSetModel } from "./usernameEmailSet.model";

const usernameEmailSetRouter = Router();

usernameEmailSetRouter
  .route("/")
  .post(
    validateSchemaMiddleware(
      createUsernameEmailSetJoiSchema,
      "schema",
    ),
    postUsernameEmailSetHandler(UsernameEmailSetModel),
  );

usernameEmailSetRouter.route("/check").post(
  checkUsernameOrEmailExistsHandler(UsernameEmailSetModel),
);

export { usernameEmailSetRouter };
