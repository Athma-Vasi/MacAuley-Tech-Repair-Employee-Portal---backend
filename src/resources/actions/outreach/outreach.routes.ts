import { Router } from 'express';
import { surveyBuilderRouter } from './surveyBuilder';
import { eventCreatorRouter } from './eventCreator';
import { announcementRouter } from './announcement';

const actionsOutreachRouter = Router();

actionsOutreachRouter.use('/survey-builder', surveyBuilderRouter);
actionsOutreachRouter.use('/event-creator', eventCreatorRouter);
actionsOutreachRouter.use('/announcement', announcementRouter);

export { actionsOutreachRouter };
