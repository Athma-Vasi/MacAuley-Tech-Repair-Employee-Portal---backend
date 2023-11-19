import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewMouseBulkHandler,
  createNewMouseHandler,
  deleteAMouseHandler,
  deleteAllMousesHandler,
  getMouseByIdHandler,
  getQueriedMousesHandler,
  returnAllFileUploadsForMousesHandler,
  updateMouseByIdHandler,
} from './mouse.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const mouseRouter = Router();

mouseRouter.use(verifyRoles());

mouseRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedMousesHandler)
  .post(createNewMouseHandler)
  .delete(deleteAllMousesHandler);

// DEV ROUTE
mouseRouter.route('/dev').post(createNewMouseBulkHandler);

mouseRouter.route('/fileUploads').post(returnAllFileUploadsForMousesHandler);

mouseRouter
  .route('/:mouseId')
  .get(getMouseByIdHandler)
  .delete(deleteAMouseHandler)
  .put(updateMouseByIdHandler);

export { mouseRouter };
