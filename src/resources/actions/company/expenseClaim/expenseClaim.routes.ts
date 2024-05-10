import { Router } from "express";
import {
  createNewExpenseClaimsBulkController,
  createNewExpenseClaimController,
  deleteAllExpenseClaimsController,
  deleteExpenseClaimController,
  getExpenseClaimByIdController,
  getQueriedExpenseClaimsByUserController,
  getQueriedExpenseClaimsController,
  updateExpenseClaimByIdController,
  updateExpenseClaimsBulkController,
} from "./expenseClaim.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createExpenseClaimJoiSchema,
  updateExpenseClaimJoiSchema,
} from "./expenseClaim.validation";

const expenseClaimRouter = Router();

expenseClaimRouter
  .route("/")
  .get(getQueriedExpenseClaimsController)
  .post(
    validateSchemaMiddleware(createExpenseClaimJoiSchema, "expenseClaimSchema"),
    createNewExpenseClaimController
  );

expenseClaimRouter.route("/delete-all").delete(deleteAllExpenseClaimsController);

expenseClaimRouter.route("/user").get(getQueriedExpenseClaimsByUserController);

// DEV ROUTES
expenseClaimRouter
  .route("/dev")
  .post(createNewExpenseClaimsBulkController)
  .patch(updateExpenseClaimsBulkController);

expenseClaimRouter
  .route("/:expenseClaimId")
  .get(getExpenseClaimByIdController)
  .delete(deleteExpenseClaimController)
  .patch(
    validateSchemaMiddleware(updateExpenseClaimJoiSchema),
    updateExpenseClaimByIdController
  );

export { expenseClaimRouter };
