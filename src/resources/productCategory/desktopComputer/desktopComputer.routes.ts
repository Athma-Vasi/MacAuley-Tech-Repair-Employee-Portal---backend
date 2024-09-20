import { Router } from "express";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { DesktopComputerModel } from "./desktopComputer.model";
import {
  createDesktopComputerJoiSchema,
  updateDesktopComputerJoiSchema,
} from "./desktopComputer.validation";

const desktopComputerRouter = Router();

desktopComputerRouter
  .route("/")
  // @desc   Get all desktopComputers
  // @route  GET api/v1/product-category/desktopComputer
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(DesktopComputerModel))
  // @desc   Create a new desktopComputer
  // @route  POST api/v1/product-category/desktopComputer
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createDesktopComputerJoiSchema, "schema"),
    createNewResourceHandler(DesktopComputerModel),
  );

// @desc   Delete many desktopComputers
// @route  DELETE api/v1/product-category/desktopComputer/delete-many
// @access Private/Admin/Manager
desktopComputerRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(DesktopComputerModel),
);

// @desc   Get all desktopComputers by user
// @route  GET api/v1/product-category/desktopComputer/user
// @access Private/Admin/Manager
desktopComputerRouter.route("/user").get(
  getQueriedResourcesByUserHandler(DesktopComputerModel),
);

desktopComputerRouter
  .route("/:resourceId")
  // @desc   Get a desktopComputer by its ID
  // @route  GET api/v1/product-category/desktopComputer/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(DesktopComputerModel))
  // @desc   Delete a desktopComputer by its ID
  // @route  DELETE api/v1/product-category/desktopComputer/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(DesktopComputerModel))
  // @desc   Update a desktopComputer by its ID
  // @route  PATCH api/v1/product-category/desktopComputer/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateDesktopComputerJoiSchema),
    updateResourceByIdHandler(DesktopComputerModel),
  );

export { desktopComputerRouter };
