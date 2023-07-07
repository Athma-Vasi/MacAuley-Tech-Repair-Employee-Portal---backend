import { Router } from 'express';
import { addressChangeRouter } from './addressChange';
import { leaveRequestRouter } from './leaveRequest';
import { expenseClaimRouter } from './expenseClaim';
import { requestResourceRouter } from './requestResource';

const actionsCompanyRouter = Router();

actionsCompanyRouter.use('/address-change', addressChangeRouter);
actionsCompanyRouter.use('/leave-request', leaveRequestRouter);
actionsCompanyRouter.use('/expense-claim', expenseClaimRouter);
actionsCompanyRouter.use('/resource-request', requestResourceRouter);

export { actionsCompanyRouter };
