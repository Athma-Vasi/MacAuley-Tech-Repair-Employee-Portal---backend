import { Router } from "express";
import {
  createNewBenefitController,
  getQueriedBenefitsController,
  getBenefitsByUserController,
  getBenefitByIdController,
  deleteBenefitController,
  deleteAllBenefitsController,
  updateBenefitByIdController,
  createNewBenefitsBulkController,
  updateBenefitsBulkController,
} from "./benefit.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import { createBenefitJoiSchema, updateBenefitJoiSchema } from "./benefit.validation";

const benefitRouter = Router();

benefitRouter
  .route("/")
  .get(getQueriedBenefitsController)
  .post(
    validateSchemaMiddleware(createBenefitJoiSchema, "benefitSchema"),
    createNewBenefitController
  );

benefitRouter.route("/delete-all").delete(deleteAllBenefitsController);

benefitRouter.route("/user").get(getBenefitsByUserController);

// DEV ROUTES
benefitRouter
  .route("/dev")
  .post(createNewBenefitsBulkController)
  .patch(updateBenefitsBulkController);

benefitRouter
  .route("/:benefitId")
  .get(getBenefitByIdController)
  .delete(deleteBenefitController)
  .patch(validateSchemaMiddleware(updateBenefitJoiSchema), updateBenefitByIdController);

export { benefitRouter };
