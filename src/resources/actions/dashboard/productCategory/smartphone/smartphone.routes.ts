import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewSmartphoneBulkHandler,
  createNewSmartphoneHandler,
  deleteASmartphoneHandler,
  deleteAllSmartphonesHandler,
  getSmartphoneByIdHandler,
  getQueriedSmartphonesHandler,
  returnAllFileUploadsForSmartphonesHandler,
  updateSmartphoneByIdHandler,
} from './smartphone.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const smartphoneRouter = Router();

smartphoneRouter.use(verifyRoles());

smartphoneRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedSmartphonesHandler)
  .post(createNewSmartphoneHandler)
  .delete(deleteAllSmartphonesHandler);

// DEV ROUTE
smartphoneRouter.route('/dev').post(createNewSmartphoneBulkHandler);

smartphoneRouter.route('/fileUploads').post(returnAllFileUploadsForSmartphonesHandler);

smartphoneRouter
  .route('/:smartphoneId')
  .get(getSmartphoneByIdHandler)
  .delete(deleteASmartphoneHandler)
  .put(updateSmartphoneByIdHandler);

export { smartphoneRouter };
