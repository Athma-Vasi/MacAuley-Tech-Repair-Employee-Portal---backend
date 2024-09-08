import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createRefermentJoiSchema,
  updateRefermentJoiSchema,
} from "./referment.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { RefermentModel } from "./referment.model";

const refermentRouter = Router();

refermentRouter
  .route("/")
  // @desc   Get all referments
  // @route  GET api/v1/general/referment
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(RefermentModel))
  // @desc   Create a new referment
  // @route  POST api/v1/general/referment
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createRefermentJoiSchema, "schema"),
    createNewResourceHandler(RefermentModel),
  );

// @desc   Delete many referments
// @route  DELETE api/v1/general/referment/delete-many
// @access Private/Admin/Manager
refermentRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(RefermentModel),
);

// @desc   Get all referments by user
// @route  GET api/v1/general/referment/user
// @access Private/Admin/Manager
refermentRouter.route("/user").get(
  getQueriedResourcesByUserHandler(RefermentModel),
);

refermentRouter
  .route("/:resourceId")
  // @desc   Get a referment by its ID
  // @route  GET api/v1/general/referment/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(RefermentModel))
  // @desc   Delete a referment by its ID
  // @route  DELETE api/v1/general/referment/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(RefermentModel))
  // @desc   Update a referment by its ID
  // @route  PATCH api/v1/general/referment/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateRefermentJoiSchema),
    updateResourceByIdHandler(RefermentModel),
  );

export { refermentRouter };
