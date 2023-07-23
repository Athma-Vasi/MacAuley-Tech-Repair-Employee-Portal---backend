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

announcementRouter
  .route('/:announcementId')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAnnouncementByIdHandler)
  .delete(deleteAnnouncementHandler)
  .put(updateAnnouncementHandler);
export { announcementRouter };
