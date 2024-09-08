import { Router } from "express";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  createCommentJoiSchema,
  updateCommentJoiSchema,
} from "./comment.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../handlers";
import { CommentModel } from "./comment.model";

const commentRouter = Router();

commentRouter
  .route("/")
  // @desc   Get all comments
  // @route  GET api/v1/comment
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(CommentModel))
  // @desc   Create a new comment
  // @route  POST api/v1/comment
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createCommentJoiSchema, "schema"),
    createNewResourceHandler(CommentModel),
  );

// @desc   Delete many comments
// @route  DELETE api/v1/comment/delete-many
// @access Private/Admin/Manager
commentRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(CommentModel),
);

// @desc   Get all comments by user
// @route  GET api/v1/comment/user
// @access Private/Admin/Manager
commentRouter.route("/user").get(
  getQueriedResourcesByUserHandler(CommentModel),
);

commentRouter
  .route("/:resourceId")
  // @desc   Get a comment by its ID
  // @route  GET api/v1/comment/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(CommentModel))
  // @desc   Delete a comment by its ID
  // @route  DELETE api/v1/comment/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(CommentModel))
  // @desc   Update a comment by its ID
  // @route  PATCH api/v1/comment/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateCommentJoiSchema),
    updateResourceByIdHandler(CommentModel),
  );

export { commentRouter };
