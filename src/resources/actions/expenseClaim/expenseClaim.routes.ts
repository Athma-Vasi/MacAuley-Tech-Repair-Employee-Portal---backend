import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createExpenseClaimJoiSchema,
  updateExpenseClaimJoiSchema,
} from "./expenseClaim.validation";
import {
  getQueriedResourcesHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { ExpenseClaimModel } from "./expenseClaim.model";
import {
  createNewExpenseClaimHandler,
  deleteExpenseClaimByIdHandler,
  getExpenseClaimByIdHandler,
  getQueriedExpenseClaimsByUserHandler,
} from "./expenseClaim.handler";

const expenseClaimRouter = Router();

expenseClaimRouter
  .route("/")
  // @desc   Get all expense claims
  // @route  GET api/v1/company/expense-claim
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(ExpenseClaimModel))
  // @desc   Create a new expense claim request
  // @route  POST api/v1/company/expense-claim
  // @access Private
  .post(
    validateSchemaMiddleware(
      createExpenseClaimJoiSchema,
      "schema",
    ),
    createNewExpenseClaimHandler(ExpenseClaimModel),
  );

// @desc   Get all expense claim requests by user
// @route  GET api/v1/company/expense-claim/user
// @access Private
expenseClaimRouter.route("/user").get(
  getQueriedExpenseClaimsByUserHandler(ExpenseClaimModel),
);

expenseClaimRouter
  .route("/:resourceId")
  // @desc   Get an expense claim request by its id
  // @route  GET api/v1/company/expense-claim/:resourceId
  // @access Private
  .get(getExpenseClaimByIdHandler(ExpenseClaimModel))
  // @desc   Delete an expense claim request by its id
  // @route  DELETE api/v1/company/expense-claim/:resourceId
  // @access Private
  .delete(deleteExpenseClaimByIdHandler(ExpenseClaimModel))
  // @desc   Update expense claim status
  // @route  PATCH api/v1/company/expense-claim/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateExpenseClaimJoiSchema),
    updateResourceByIdHandler(ExpenseClaimModel),
  );

export { expenseClaimRouter };
