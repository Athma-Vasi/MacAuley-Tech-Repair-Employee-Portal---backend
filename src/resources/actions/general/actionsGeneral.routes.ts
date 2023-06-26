import { Router } from 'express';
import { endorsementRouter } from './endorsement';
import { printerIssueRouter } from './printerIssue/printerIssue.routes';

const actionsGeneralRouter = Router();

actionsGeneralRouter.use('/endorsements', endorsementRouter);
actionsGeneralRouter.use('/printer-issues', printerIssueRouter);

export { actionsGeneralRouter };
