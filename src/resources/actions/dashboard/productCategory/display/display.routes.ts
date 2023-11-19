import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewDisplayBulkHandler,
  createNewDisplayHandler,
  deleteADisplayHandler,
  deleteAllDisplaysHandler,
  getDisplayByIdHandler,
  getQueriedDisplaysHandler,
  returnAllFileUploadsForDisplaysHandler,
  updateDisplayByIdHandler,
} from './display.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const displayRouter = Router();

displayRouter.use(verifyRoles());

displayRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedDisplaysHandler)
  .post(createNewDisplayHandler)
  .delete(deleteAllDisplaysHandler);

// DEV ROUTE
displayRouter.route('/dev').post(createNewDisplayBulkHandler);

displayRouter.route('/fileUploads').post(returnAllFileUploadsForDisplaysHandler);

displayRouter
  .route('/:displayId')
  .get(getDisplayByIdHandler)
  .delete(deleteADisplayHandler)
  .put(updateDisplayByIdHandler);

export { displayRouter };
