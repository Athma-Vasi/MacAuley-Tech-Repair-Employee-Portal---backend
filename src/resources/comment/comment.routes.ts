import { Router } from "express";
import {
  createNewCommentHandler,
  getQueriedCommentsHandler,
  getCommentsByUserHandler,
  getCommentByIdHandler,
  deleteCommentHandler,
  deleteAllCommentsHandler,
  updateCommentStatusByIdHandler,
  createNewCommentsBulkHandler,
  updateCommentsBulkHandler,
  getQueriedCommentsByParentResourceIdHandler,
} from "./comment.controller";

import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";
import { verifyJWTMiddleware, verifyRoles, assignQueryDefaults } from "../../middlewares";

const commentRouter = Router();

commentRouter.use(verifyJWTMiddleware, verifyRoles());

commentRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedCommentsHandler)
  .post(createNewCommentHandler);

commentRouter.route("/delete-all").delete(deleteAllCommentsHandler);

commentRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getCommentsByUserHandler);

commentRouter
  .route("/parentResource/:parentResourceId")
  .get(
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getQueriedCommentsByParentResourceIdHandler
  );

// DEV ROUTES
commentRouter
  .route("/dev")
  .post(createNewCommentsBulkHandler)
  .patch(updateCommentsBulkHandler);

commentRouter
  .route("/:commentId")
  .get(getCommentByIdHandler)
  .delete(deleteCommentHandler)
  .patch(updateCommentStatusByIdHandler);

export { commentRouter };
