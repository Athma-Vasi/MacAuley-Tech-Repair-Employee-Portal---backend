import { Router } from 'express';
import { surveyBuilderRouter } from './surveyBuilder';
import { eventCreatorRouter } from './eventCreator';
import { announcementRouter } from './announcement';

const actionsOutreachRouter = Router();

actionsOutreachRouter.use('/survey', surveyBuilderRouter);
actionsOutreachRouter.use('/event', eventCreatorRouter);
actionsOutreachRouter.use('/announcement', announcementRouter);

export { actionsOutreachRouter };
