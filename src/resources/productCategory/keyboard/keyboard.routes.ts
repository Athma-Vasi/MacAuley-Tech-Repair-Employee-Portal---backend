import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createKeyboardJoiSchema,
  updateKeyboardJoiSchema,
} from "./keyboard.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { KeyboardModel } from "./keyboard.model";

const keyboardRouter = Router();

keyboardRouter
  .route("/")
  // @desc   Get all keyboards
  // @route  GET api/v1/product-category/keyboard
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(KeyboardModel))
  // @desc   Create a new keyboard
  // @route  POST api/v1/product-category/keyboard
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createKeyboardJoiSchema, "schema"),
    createNewResourceHandler(KeyboardModel),
  );

// @desc   Delete many keyboards
// @route  DELETE api/v1/product-category/keyboard/delete-many
// @access Private/Admin/Manager
keyboardRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(KeyboardModel),
);

// @desc   Get all keyboards by user
// @route  GET api/v1/product-category/keyboard/user
// @access Private/Admin/Manager
keyboardRouter.route("/user").get(
  getQueriedResourcesByUserHandler(KeyboardModel),
);

keyboardRouter
  .route("/:resourceId")
  // @desc   Get a keyboard by its ID
  // @route  GET api/v1/product-category/keyboard/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(KeyboardModel))
  // @desc   Delete a keyboard by its ID
  // @route  DELETE api/v1/product-category/keyboard/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(KeyboardModel))
  // @desc   Update a keyboard by its ID
  // @route  PATCH api/v1/product-category/keyboard/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateKeyboardJoiSchema),
    updateResourceByIdHandler(KeyboardModel),
  );

export { keyboardRouter };
