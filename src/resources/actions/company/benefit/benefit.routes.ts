import { Router } from "express";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createBenefitJoiSchema,
  updateBenefitJoiSchema,
} from "./benefit.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../../handlers";
import { BenefitModel } from "./benefit.model";

const benefitRouter = Router();

benefitRouter
  .route("/")
  // @desc   Get all benefits plans
  // @route  GET api/v1/actions/company/benefits
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(BenefitModel))
  // @desc   Create a new benefits plan
  // @route  POST api/v1/actions/company/benefits
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createBenefitJoiSchema, "schema"),
    createNewResourceHandler(BenefitModel),
  );

// @desc   Delete all benefits plans
// @route  DELETE api/v1/actions/company/benefits/delete-all
// @access Private/Admin/Manager
benefitRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(BenefitModel),
);

// @desc   Get all benefits plans by user
// @route  GET api/v1/actions/company/benefits/user
// @access Private/Admin/Manager
benefitRouter.route("/user").get(
  getQueriedResourcesByUserHandler(BenefitModel),
);

benefitRouter
  .route("/:resourceId")
  // @desc   Get a benefits plan by ID
  // @route  GET api/v1/actions/company/benefits/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(BenefitModel))
  // @desc   Delete a benefits plan by ID
  // @route  DELETE api/v1/actions/company/benefits/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(BenefitModel))
  // @desc   Update a benefits plan by ID
  // @route  PATCH api/v1/actions/company/benefits/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateBenefitJoiSchema),
    updateResourceByIdHandler(BenefitModel),
  );

export { benefitRouter };
