import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createBenefitJoiSchema,
  updateBenefitJoiSchema,
} from "./benefit.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { BenefitModel } from "./benefit.model";

const benefitRouter = Router();

benefitRouter
  .route("/")
  // @desc   Get all benefits
  // @route  GET api/v1/company/benefits
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(BenefitModel))
  // @desc   Create a new benefit
  // @route  POST api/v1/company/benefits
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createBenefitJoiSchema, "schema"),
    createNewResourceHandler(BenefitModel),
  );

// @desc   Delete many benefits
// @route  DELETE api/v1/company/benefits/delete-many
// @access Private/Admin/Manager
benefitRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(BenefitModel),
);

// @desc   Get all benefits by user
// @route  GET api/v1/company/benefits/user
// @access Private/Admin/Manager
benefitRouter.route("/user").get(
  getQueriedResourcesByUserHandler(BenefitModel),
);

benefitRouter
  .route("/:resourceId")
  // @desc   Get a benefit by ID
  // @route  GET api/v1/company/benefits/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(BenefitModel))
  // @desc   Delete a benefit by ID
  // @route  DELETE api/v1/company/benefits/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(BenefitModel))
  // @desc   Update a benefit by ID
  // @route  PATCH api/v1/company/benefits/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateBenefitJoiSchema),
    updateResourceByIdHandler(BenefitModel),
  );

export { benefitRouter };
