import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';
import {
  createNewAnnouncementHandler,
  deleteAnnouncementHandler,
  getAllAnnouncementsHandler,
  updateAnnouncementHandler,
  getAnnouncementsFromUserIdHandler,
} from './announcement.controller';

const announcementRouter = Router();

// verifyJWT middleware is applied to all routes in this router
announcementRouter.use(verifyJWTMiddleware);

announcementRouter.route('/:userId').get(getAnnouncementsFromUserIdHandler);

announcementRouter
  .route('/')
  .get(getAllAnnouncementsHandler)
  .post(createNewAnnouncementHandler)
  .patch(updateAnnouncementHandler)
  .delete(deleteAnnouncementHandler);

export { announcementRouter };
