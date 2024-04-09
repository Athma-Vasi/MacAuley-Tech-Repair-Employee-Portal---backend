import { Router } from "express";
import {
  createNewCommentHandler,
  getQueriedCommentsHandler,
  getCommentsByUserHandler,
  getCommentByIdHandler,
  deleteCommentHandler,
  deleteAllCommentsHandler,
  updateCommentByIdHandler,
  createNewCommentsBulkHandler,
  updateCommentsBulkHandler,
  getQueriedCommentsByParentResourceIdHandler,
} from "./comment.controller";

import { verifyJWTMiddleware, verifyRoles, assignQueryDefaults } from "../../middlewares";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createCommentJoiSchema, updateCommentJoiSchema } from "./comment.validation";

const commentRouter = Router();

commentRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

commentRouter
  .route("/")
  .get(getQueriedCommentsHandler)
  .post(
    validateSchemaMiddleware(createCommentJoiSchema, "commentSchema"),
    createNewCommentHandler
  );

commentRouter.route("/delete-all").delete(deleteAllCommentsHandler);

commentRouter.route("/user").get(getCommentsByUserHandler);

commentRouter
  .route("/parentResource/:parentResourceId")
  .get(getQueriedCommentsByParentResourceIdHandler);

// DEV ROUTES
commentRouter
  .route("/dev")
  .post(createNewCommentsBulkHandler)
  .patch(updateCommentsBulkHandler);

commentRouter
  .route("/:commentId")
  .get(getCommentByIdHandler)
  .delete(deleteCommentHandler)
  .patch(validateSchemaMiddleware(updateCommentJoiSchema), updateCommentByIdHandler);

export { commentRouter };
