import { Router } from 'express';
import {
  createNewExpenseClaimHandler,
  deleteAllExpenseClaimsHandler,
  deleteAnExpenseClaimHandler,
  getAllExpenseClaimsHandler,
  getExpenseClaimByIdHandler,
  getExpenseClaimsByUserHandler,
} from './expenseClaim.controller';

const expenseClaimRouter = Router();

expenseClaimRouter
  .route('/')
  .get(getAllExpenseClaimsHandler)
  .post(createNewExpenseClaimHandler)
  .delete(deleteAllExpenseClaimsHandler);

expenseClaimRouter.route('/user').get(getExpenseClaimsByUserHandler);

expenseClaimRouter
  .route('/:expenseClaimId')
  .get(getExpenseClaimByIdHandler)
  .delete(deleteAnExpenseClaimHandler);

export { expenseClaimRouter };
