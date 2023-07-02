import { Router } from 'express';
import { surveyBuilderRouter } from './surveyBuilder';

const actionsOutreachRouter = Router();

actionsOutreachRouter.use('/survey-builder', surveyBuilderRouter);

//TODO: implement mailer service
export { actionsOutreachRouter };
