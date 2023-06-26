import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';
import {
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  getAllAnnouncementsHandler,
  updateAnnouncementHandler,
  getAnnouncementsByUserHandler,
  deleteAllAnnouncementsHandler,
  getAnnouncementByIdHandler,
} from './announcement.controller';

const announcementRouter = Router();

// verifyJWT middleware is applied to all routes in this router
announcementRouter.use(verifyJWTMiddleware);

announcementRouter
  .route('/')
  .get(getAllAnnouncementsHandler)
  .post(createNewAnnouncementHandler)
  .delete(deleteAllAnnouncementsHandler);

announcementRouter.route('/user').get(getAnnouncementsByUserHandler);

announcementRouter
  .route('/:announcementId')
  .get(getAnnouncementByIdHandler)
  .delete(deleteAnnouncementHandler)
  .put(updateAnnouncementHandler);
export { announcementRouter };
