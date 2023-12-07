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

const expenseClaimRouter = Router();

expenseClaimRouter
  .route("/")
  .get(getQueriedExpenseClaimsHandler)
  .post(createNewExpenseClaimHandler);

expenseClaimRouter.route("/delete-all").delete(deleteAllExpenseClaimsHandler);

expenseClaimRouter.route("/user").get(getQueriedExpenseClaimsByUserHandler);

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
