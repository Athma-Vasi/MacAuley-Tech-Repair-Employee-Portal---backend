import { Router } from "express";
import {
  createNewExpenseClaimsBulkHandler,
  createNewExpenseClaimHandler,
  deleteAllExpenseClaimsHandler,
  deleteExpenseClaimHandler,
  getExpenseClaimByIdHandler,
  getQueriedExpenseClaimsByUserHandler,
  getQueriedExpenseClaimsHandler,
  updateExpenseClaimByIdHandler,
  updateExpenseClaimsBulkHandler,
} from "./expenseClaim.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const expenseClaimRouter = Router();

expenseClaimRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedExpenseClaimsHandler)
  .post(createNewExpenseClaimHandler);

expenseClaimRouter.route("/delete-all").delete(deleteAllExpenseClaimsHandler);

expenseClaimRouter
  .route("/user")
  .get(
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getQueriedExpenseClaimsByUserHandler
  );

// DEV ROUTES
expenseClaimRouter
  .route("/dev")
  .post(createNewExpenseClaimsBulkHandler)
  .patch(updateExpenseClaimsBulkHandler);

expenseClaimRouter
  .route("/:expenseClaimId")
  .get(getExpenseClaimByIdHandler)
  .delete(deleteExpenseClaimHandler)
  .patch(updateExpenseClaimByIdHandler);

export { expenseClaimRouter };
