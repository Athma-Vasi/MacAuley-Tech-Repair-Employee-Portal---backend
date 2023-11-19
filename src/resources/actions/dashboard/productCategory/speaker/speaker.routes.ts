import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewSpeakerBulkHandler,
  createNewSpeakerHandler,
  deleteASpeakerHandler,
  deleteAllSpeakersHandler,
  getSpeakerByIdHandler,
  getQueriedSpeakersHandler,
  returnAllFileUploadsForSpeakersHandler,
  updateSpeakerByIdHandler,
} from './speaker.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const speakerRouter = Router();

speakerRouter.use(verifyRoles());

speakerRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedSpeakersHandler)
  .post(createNewSpeakerHandler)
  .delete(deleteAllSpeakersHandler);

// DEV ROUTE
speakerRouter.route('/dev').post(createNewSpeakerBulkHandler);

speakerRouter.route('/fileUploads').post(returnAllFileUploadsForSpeakersHandler);

speakerRouter
  .route('/:speakerId')
  .get(getSpeakerByIdHandler)
  .delete(deleteASpeakerHandler)
  .put(updateSpeakerByIdHandler);

export { speakerRouter };
