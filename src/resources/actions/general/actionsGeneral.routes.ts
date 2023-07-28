import { Router } from 'express';
import { endorsementRouter } from './endorsement';
import { printerIssueRouter } from './printerIssue';
import { anonymousRequestRouter } from './anonymousRequest';
import { refermentRouter } from './referment';

const actionsGeneralRouter = Router();

actionsGeneralRouter.use('/endorsement', endorsementRouter);
actionsGeneralRouter.use('/printer-issue', printerIssueRouter);
actionsGeneralRouter.use('/anonymous-request', anonymousRequestRouter);
actionsGeneralRouter.use('/referment', refermentRouter);

export { actionsGeneralRouter };
