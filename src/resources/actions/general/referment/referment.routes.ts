import { Router } from "express";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createRefermentJoiSchema,
  updateRefermentJoiSchema,
} from "./referment.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../../handlers";
import { RefermentModel } from "./referment.model";

const refermentRouter = Router();

refermentRouter
  .route("/")
  // @desc   Get all referments
  // @route  GET api/v1/actions/general/referment
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(RefermentModel))
  // @desc   Create a new referment
  // @route  POST api/v1/actions/general/referment
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createRefermentJoiSchema, "schema"),
    createNewResourceHandler(RefermentModel),
  );

// @desc   Delete all referments
// @route  DELETE api/v1/actions/general/referment/delete-all
// @access Private/Admin/Manager
refermentRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(RefermentModel),
);

// @desc   Get all referments by user
// @route  GET api/v1/actions/general/referment/user
// @access Private/Admin/Manager
refermentRouter.route("/user").get(
  getQueriedResourcesByUserHandler(RefermentModel),
);

refermentRouter
  .route("/:resourceId")
  // @desc   Get a referment by its ID
  // @route  GET api/v1/actions/general/referment/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(RefermentModel))
  // @desc   Delete a referment by its ID
  // @route  DELETE api/v1/actions/general/referment/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(RefermentModel))
  // @desc   Update a referment by its ID
  // @route  PATCH api/v1/actions/general/referment/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateRefermentJoiSchema),
    updateResourceByIdHandler(RefermentModel),
  );

export { refermentRouter };
