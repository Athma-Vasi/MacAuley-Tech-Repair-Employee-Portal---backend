import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createSpeakerJoiSchema,
  updateSpeakerJoiSchema,
} from "./speaker.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { SpeakerModel } from "./speaker.model";

const speakerRouter = Router();

speakerRouter
  .route("/")
  // @desc   Get all speakers
  // @route  GET api/v1/product-category/speaker
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(SpeakerModel))
  // @desc   Create a new speaker
  // @route  POST api/v1/product-category/speaker
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createSpeakerJoiSchema, "schema"),
    createNewResourceHandler(SpeakerModel),
  );

// @desc   Delete many speakers
// @route  DELETE api/v1/product-category/speaker/delete-many
// @access Private/Admin/Manager
speakerRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(SpeakerModel),
);

// @desc   Get all speakers by user
// @route  GET api/v1/product-category/speaker/user
// @access Private/Admin/Manager
speakerRouter.route("/user").get(
  getQueriedResourcesByUserHandler(SpeakerModel),
);

speakerRouter
  .route("/:resourceId")
  // @desc   Get a speaker by its ID
  // @route  GET api/v1/product-category/speaker/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(SpeakerModel))
  // @desc   Delete a speaker by its ID
  // @route  DELETE api/v1/product-category/speaker/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(SpeakerModel))
  // @desc   Update a speaker by its ID
  // @route  PATCH api/v1/product-category/speaker/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateSpeakerJoiSchema),
    updateResourceByIdHandler(SpeakerModel),
  );

export { speakerRouter };
