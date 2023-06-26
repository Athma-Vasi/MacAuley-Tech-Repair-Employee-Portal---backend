import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';
import {
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  getAllAnnouncementsHandler,
  updateAnnouncementHandler,
  getAnnouncementsByUserHandler,
} from './announcement.controller';

const announcementRouter = Router();

// verifyJWT middleware is applied to all routes in this router
announcementRouter.use(verifyJWTMiddleware);

announcementRouter
  .route('/')
  .get(getAllAnnouncementsHandler)
  .post(createNewAnnouncementHandler)
  .put(updateAnnouncementHandler)
  .delete(deleteAnnouncementHandler);

announcementRouter.route('/user').get(getAnnouncementsByUserHandler);
export { announcementRouter };
