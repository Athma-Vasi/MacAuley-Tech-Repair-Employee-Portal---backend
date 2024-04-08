import { Router } from "express";
import {
  createNewBenefitHandler,
  getQueriedBenefitsHandler,
  getBenefitsByUserHandler,
  getBenefitByIdHandler,
  deleteBenefitHandler,
  deleteAllBenefitsHandler,
  updateBenefitByIdHandler,
  createNewBenefitsBulkHandler,
  updateBenefitsBulkHandler,
} from "./benefit.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import { createBenefitJoiSchema, updateBenefitJoiSchema } from "./benefit.validation";

const benefitRouter = Router();

benefitRouter
  .route("/")
  .get(getQueriedBenefitsHandler)
  .post(
    validateSchemaMiddleware(createBenefitJoiSchema, "benefitSchema"),
    createNewBenefitHandler
  );

benefitRouter.route("/delete-all").delete(deleteAllBenefitsHandler);

benefitRouter.route("/user").get(getBenefitsByUserHandler);

// DEV ROUTES
benefitRouter
  .route("/dev")
  .post(createNewBenefitsBulkHandler)
  .patch(updateBenefitsBulkHandler);

benefitRouter
  .route("/:benefitId")
  .get(getBenefitByIdHandler)
  .delete(deleteBenefitHandler)
  .patch(validateSchemaMiddleware(updateBenefitJoiSchema), updateBenefitByIdHandler);

export { benefitRouter };
