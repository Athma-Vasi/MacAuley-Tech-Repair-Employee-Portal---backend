import { Router } from "express";
import {
  createNewBenefitHandler,
  getQueriedBenefitsHandler,
  getBenefitsByUserHandler,
  getBenefitByIdHandler,
  deleteBenefitHandler,
  deleteAllBenefitsHandler,
  updateBenefitStatusByIdHandler,
  createNewBenefitsBulkHandler,
  updateBenefitsBulkHandler,
} from "./benefit.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const benefitRouter = Router();

benefitRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedBenefitsHandler)
  .post(createNewBenefitHandler);

benefitRouter.route("/delete-all").delete(deleteAllBenefitsHandler);

benefitRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getBenefitsByUserHandler);

// DEV ROUTES
benefitRouter
  .route("/dev")
  .post(createNewBenefitsBulkHandler)
  .patch(updateBenefitsBulkHandler);

benefitRouter
  .route("/:benefitId")
  .get(getBenefitByIdHandler)
  .delete(deleteBenefitHandler)
  .patch(updateBenefitStatusByIdHandler);

export { benefitRouter };
