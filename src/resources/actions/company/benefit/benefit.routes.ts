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

const benefitRouter = Router();

benefitRouter.route("/").get(getQueriedBenefitsHandler).post(createNewBenefitHandler);

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
  .patch(updateBenefitByIdHandler);

export { benefitRouter };
