import { Router } from 'express';
import { endorsementRouter } from './endorsement';

const actionsGeneralRouter = Router();

actionsGeneralRouter.use('/endorsement', endorsementRouter);

export { actionsGeneralRouter };
