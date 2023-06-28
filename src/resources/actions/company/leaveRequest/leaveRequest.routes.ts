import { Router } from 'express';
import {
  createNewLeaveRequestHandler,
  deleteALeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  getAllLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  getLeaveRequestsByUserHandler,
} from './leaveRequest.controller';

const leaveRequestRouter = Router();

leaveRequestRouter
  .route('/')
  .post(createNewLeaveRequestHandler)
  .get(getAllLeaveRequestsHandler)
  .delete(deleteAllLeaveRequestsHandler);

leaveRequestRouter
  .route('/:leaveRequestId')
  .get(getLeaveRequestByIdHandler)
  .delete(deleteALeaveRequestHandler);

leaveRequestRouter.route('/user').get(getLeaveRequestsByUserHandler);

export { leaveRequestRouter };
