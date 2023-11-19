import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewHeadphoneBulkHandler,
  createNewHeadphoneHandler,
  deleteAHeadphoneHandler,
  deleteAllHeadphonesHandler,
  getHeadphoneByIdHandler,
  getQueriedHeadphonesHandler,
  returnAllFileUploadsForHeadphonesHandler,
  updateHeadphoneByIdHandler,
} from './headphone.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const headphoneRouter = Router();

headphoneRouter.use(verifyRoles());

headphoneRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedHeadphonesHandler)
  .post(createNewHeadphoneHandler)
  .delete(deleteAllHeadphonesHandler);

// DEV ROUTE
headphoneRouter.route('/dev').post(createNewHeadphoneBulkHandler);

headphoneRouter.route('/fileUploads').post(returnAllFileUploadsForHeadphonesHandler);

headphoneRouter
  .route('/:headphoneId')
  .get(getHeadphoneByIdHandler)
  .delete(deleteAHeadphoneHandler)
  .put(updateHeadphoneByIdHandler);

export { headphoneRouter };
