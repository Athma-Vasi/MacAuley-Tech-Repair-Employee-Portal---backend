import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewMicrophoneBulkHandler,
  createNewMicrophoneHandler,
  deleteAMicrophoneHandler,
  deleteAllMicrophonesHandler,
  getMicrophoneByIdHandler,
  getQueriedMicrophonesHandler,
  returnAllFileUploadsForMicrophonesHandler,
  updateMicrophoneByIdHandler,
} from './microphone.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const microphoneRouter = Router();

microphoneRouter.use(verifyRoles());

microphoneRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedMicrophonesHandler)
  .post(createNewMicrophoneHandler)
  .delete(deleteAllMicrophonesHandler);

// DEV ROUTE
microphoneRouter.route('/dev').post(createNewMicrophoneBulkHandler);

microphoneRouter.route('/fileUploads').post(returnAllFileUploadsForMicrophonesHandler);

microphoneRouter
  .route('/:microphoneId')
  .get(getMicrophoneByIdHandler)
  .delete(deleteAMicrophoneHandler)
  .put(updateMicrophoneByIdHandler);

export { microphoneRouter };
