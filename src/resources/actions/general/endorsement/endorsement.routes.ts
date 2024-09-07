import { Router } from "express";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createEndorsementJoiSchema,
  updateEndorsementJoiSchema,
} from "./endorsement.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../../handlers";
import { EndorsementModel } from "./endorsement.model";

const endorsementRouter = Router();

endorsementRouter
  .route("/")
  // @desc   Get all endorsements plans
  // @route  GET api/v1/actions/general/endorsement
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(EndorsementModel))
  // @desc   Create a new endorsement plan
  // @route  POST api/v1/actions/general/endorsement
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createEndorsementJoiSchema, "schema"),
    createNewResourceHandler(EndorsementModel),
  );

// @desc   Delete all endorsements plans
// @route  DELETE api/v1/actions/general/endorsement/delete-all
// @access Private/Admin/Manager
endorsementRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(EndorsementModel),
);

// @desc   Get all endorsements plans by user
// @route  GET api/v1/actions/general/endorsement/user
// @access Private/Admin/Manager
endorsementRouter.route("/user").get(
  getQueriedResourcesByUserHandler(EndorsementModel),
);

endorsementRouter
  .route("/:resourceId")
  // @desc   Get an endorsement plan by ID
  // @route  GET api/v1/actions/general/endorsement/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(EndorsementModel))
  // @desc   Delete an endorsement plan by ID
  // @route  DELETE api/v1/actions/general/endorsement/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(EndorsementModel))
  // @desc   Update an endorsements plan by ID
  // @route  PATCH api/v1/actions/general/endorsement/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateEndorsementJoiSchema),
    updateResourceByIdHandler(EndorsementModel),
  );

export { endorsementRouter };
