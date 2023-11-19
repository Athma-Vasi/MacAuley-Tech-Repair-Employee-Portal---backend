import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewAccessoryBulkHandler,
  createNewAccessoryHandler,
  deleteAAccessoryHandler,
  deleteAllAccessoriesHandler,
  getAccessoryByIdHandler,
  getQueriedAccessoriesHandler,
  returnAllFileUploadsForAccessoriesHandler,
  updateAccessoryByIdHandler,
} from './accessory.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const accessoryRouter = Router();

accessoryRouter.use(verifyRoles());

accessoryRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedAccessoriesHandler)
  .post(createNewAccessoryHandler)
  .delete(deleteAllAccessoriesHandler);

// DEV ROUTE
accessoryRouter.route('/dev').post(createNewAccessoryBulkHandler);

accessoryRouter.route('/fileUploads').post(returnAllFileUploadsForAccessoriesHandler);

accessoryRouter
  .route('/:accessoryId')
  .get(getAccessoryByIdHandler)
  .delete(deleteAAccessoryHandler)
  .put(updateAccessoryByIdHandler);

export { accessoryRouter };
