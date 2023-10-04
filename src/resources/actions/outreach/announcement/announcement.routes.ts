import { Router } from 'express';

import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import {
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  getQueriedAnnouncementsHandler,
  updateAnnouncementHandler,
  getQueriedAnouncementsByUserHandler,
  deleteAllAnnouncementsHandler,
  getAnnouncementByIdHandler,
  updateAnnouncementRatingHandler,
  createNewAnnouncementsBulkHandler,
} from './announcement.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const announcementRouter = Router();

announcementRouter.use(verifyRoles());

announcementRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedAnnouncementsHandler)
  .post(createNewAnnouncementHandler)
  .delete(deleteAllAnnouncementsHandler);

announcementRouter.route('/user').get(getQueriedAnouncementsByUserHandler);

// DEV ROUTE
announcementRouter.route('/dev').post(createNewAnnouncementsBulkHandler);

announcementRouter
  .route('/:announcementId')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAnnouncementByIdHandler)
  .delete(deleteAnnouncementHandler)
  .patch(updateAnnouncementHandler);

announcementRouter.route('/:announcementId/rating').patch(updateAnnouncementRatingHandler);
export { announcementRouter };
