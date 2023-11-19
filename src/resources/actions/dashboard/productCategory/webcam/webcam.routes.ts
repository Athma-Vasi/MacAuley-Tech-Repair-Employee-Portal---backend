import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewWebcamBulkHandler,
  createNewWebcamHandler,
  deleteAWebcamHandler,
  deleteAllWebcamsHandler,
  getWebcamByIdHandler,
  getQueriedWebcamsHandler,
  returnAllFileUploadsForWebcamsHandler,
  updateWebcamByIdHandler,
} from './webcam.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const webcamRouter = Router();

webcamRouter.use(verifyRoles());

webcamRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedWebcamsHandler)
  .post(createNewWebcamHandler)
  .delete(deleteAllWebcamsHandler);

// DEV ROUTE
webcamRouter.route('/dev').post(createNewWebcamBulkHandler);

webcamRouter.route('/fileUploads').post(returnAllFileUploadsForWebcamsHandler);

webcamRouter
  .route('/:webcamId')
  .get(getWebcamByIdHandler)
  .delete(deleteAWebcamHandler)
  .put(updateWebcamByIdHandler);

export { webcamRouter };
