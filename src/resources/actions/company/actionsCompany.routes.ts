import { Router } from 'express';
import { addressChangeRouter } from './addressChange';
import { leaveRequestRouter } from './leaveRequest';
import { expenseClaimRouter } from './expenseClaim';
import { requestResourceRouter } from './requestResource';
import { benefitsRouter } from './benefits';

const actionsCompanyRouter = Router();

actionsCompanyRouter.use('/address-change', addressChangeRouter);
actionsCompanyRouter.use('/leave-request', leaveRequestRouter);
actionsCompanyRouter.use('/expense-claim', expenseClaimRouter);
actionsCompanyRouter.use('/request-resource', requestResourceRouter);
actionsCompanyRouter.use('/benefit', benefitsRouter);

export { actionsCompanyRouter };
