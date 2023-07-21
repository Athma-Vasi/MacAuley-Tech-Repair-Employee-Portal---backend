import { Router } from 'express';
import {
  createNewLeaveRequestHandler,
  deleteALeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  getQueriedLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  getLeaveRequestsByUserHandler,
} from './leaveRequest.controller';

const leaveRequestRouter = Router();

leaveRequestRouter
  .route('/')
  .post(createNewLeaveRequestHandler)
  .get(getQueriedLeaveRequestsHandler)
  .delete(deleteAllLeaveRequestsHandler);

leaveRequestRouter
  .route('/:leaveRequestId')
  .get(getLeaveRequestByIdHandler)
  .delete(deleteALeaveRequestHandler);

leaveRequestRouter.route('/user').get(getLeaveRequestsByUserHandler);

export { leaveRequestRouter };
