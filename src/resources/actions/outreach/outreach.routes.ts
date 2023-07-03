import { Router } from 'express';
import { surveyBuilderRouter } from './surveyBuilder';
import { eventCreatorRouter } from './eventCreator';

const actionsOutreachRouter = Router();

actionsOutreachRouter.use('/survey-builder', surveyBuilderRouter);
actionsOutreachRouter.use('/event-creator', eventCreatorRouter);

//TODO: implement mailer service
export { actionsOutreachRouter };
