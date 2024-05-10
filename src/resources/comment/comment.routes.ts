import { Router } from "express";
import {
  createNewCommentController,
  getQueriedCommentsController,
  getCommentsByUserController,
  getCommentByIdController,
  deleteCommentController,
  deleteAllCommentsController,
  updateCommentByIdController,
  createNewCommentsBulkController,
  updateCommentsBulkController,
  getQueriedCommentsByParentResourceIdController,
} from "./comment.controller";

import { verifyJWTMiddleware, verifyRoles, assignQueryDefaults } from "../../middlewares";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createCommentJoiSchema, updateCommentJoiSchema } from "./comment.validation";

const commentRouter = Router();

commentRouter.use(verifyJWTMiddleware, verifyRoles, assignQueryDefaults);

commentRouter
  .route("/")
  .get(getQueriedCommentsController)
  .post(
    validateSchemaMiddleware(createCommentJoiSchema, "commentSchema"),
    createNewCommentController
  );

commentRouter.route("/delete-all").delete(deleteAllCommentsController);

commentRouter.route("/user").get(getCommentsByUserController);

commentRouter
  .route("/parentResource/:parentResourceId")
  .get(getQueriedCommentsByParentResourceIdController);

// DEV ROUTES
commentRouter
  .route("/dev")
  .post(createNewCommentsBulkController)
  .patch(updateCommentsBulkController);

commentRouter
  .route("/:commentId")
  .get(getCommentByIdController)
  .delete(deleteCommentController)
  .patch(validateSchemaMiddleware(updateCommentJoiSchema), updateCommentByIdController);

export { commentRouter };
