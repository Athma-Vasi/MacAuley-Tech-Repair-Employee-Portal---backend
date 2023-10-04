import { Router } from 'express';
import {
  createNewExpenseClaimHandler,
  deleteAllExpenseClaimsHandler,
  deleteAnExpenseClaimHandler,
  getQueriedExpenseClaimsHandler,
  getExpenseClaimByIdHandler,
  getQueriedExpenseClaimsByUserHandler,
  updateExpenseClaimStatusByIdHandler,
  updateExpenseClaimByIdHandler,
  createNewExpenseClaimBulkHandler,
} from './expenseClaim.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const expenseClaimRouter = Router();

expenseClaimRouter.use(verifyRoles());

expenseClaimRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedExpenseClaimsHandler)
  .post(createNewExpenseClaimHandler)
  .delete(deleteAllExpenseClaimsHandler);

expenseClaimRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedExpenseClaimsByUserHandler);

// DEV ROUTE
expenseClaimRouter.route('/dev').post(createNewExpenseClaimBulkHandler);

expenseClaimRouter
  .route('/:expenseClaimId')
  .get(getExpenseClaimByIdHandler)
  .delete(deleteAnExpenseClaimHandler)
  .patch(updateExpenseClaimStatusByIdHandler)
  .put(updateExpenseClaimByIdHandler);

export { expenseClaimRouter };
