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

import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";
import { verifyJWTMiddleware, verifyRoles, assignQueryDefaults } from "../../middlewares";

const commentRouter = Router();

commentRouter.use(
  verifyJWTMiddleware,
  verifyRoles(),
  assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS)
);

commentRouter.route("/").get(getQueriedCommentsHandler).post(createNewCommentHandler);

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
  .patch(updateCommentByIdHandler);

export { commentRouter };
