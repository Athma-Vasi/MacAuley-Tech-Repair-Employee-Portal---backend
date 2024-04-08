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
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createExpenseClaimJoiSchema,
  updateExpenseClaimJoiSchema,
} from "./expenseClaim.validation";

const expenseClaimRouter = Router();

expenseClaimRouter
  .route("/")
  .get(getQueriedExpenseClaimsHandler)
  .post(
    validateSchemaMiddleware(createExpenseClaimJoiSchema, "expenseClaimSchema"),
    createNewExpenseClaimHandler
  );

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
  .patch(
    validateSchemaMiddleware(updateExpenseClaimJoiSchema),
    updateExpenseClaimByIdHandler
  );

export { expenseClaimRouter };
