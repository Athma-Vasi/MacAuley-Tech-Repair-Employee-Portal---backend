import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewDesktopComputerBulkHandler,
  createNewDesktopComputerHandler,
  deleteADesktopComputerHandler,
  deleteAllDesktopComputersHandler,
  getDesktopComputerByIdHandler,
  getQueriedDesktopComputersHandler,
  returnAllFileUploadsForDesktopComputersHandler,
  updateDesktopComputerByIdHandler,
} from './desktopComputer.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const desktopComputerRouter = Router();

desktopComputerRouter.use(verifyRoles());

desktopComputerRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedDesktopComputersHandler)
  .post(createNewDesktopComputerHandler)
  .delete(deleteAllDesktopComputersHandler);

// DEV ROUTE
desktopComputerRouter.route('/dev').post(createNewDesktopComputerBulkHandler);

desktopComputerRouter.route('/fileUploads').post(returnAllFileUploadsForDesktopComputersHandler);

desktopComputerRouter
  .route('/:desktopComputerId')
  .get(getDesktopComputerByIdHandler)
  .delete(deleteADesktopComputerHandler)
  .put(updateDesktopComputerByIdHandler);

export { desktopComputerRouter };
