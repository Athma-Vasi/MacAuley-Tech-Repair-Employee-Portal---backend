import { Router } from 'express';
import {
  createNewLeaveRequestHandler,
  deleteALeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  getQueriedLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  getQueriedLeaveRequestsByUserHandler,
  updateLeaveRequestStatusByIdHandler,
} from './leaveRequest.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const leaveRequestRouter = Router();

leaveRequestRouter.use(verifyRoles());

leaveRequestRouter
  .route('/')
  .post(createNewLeaveRequestHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedLeaveRequestsHandler)
  .delete(deleteAllLeaveRequestsHandler);

leaveRequestRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedLeaveRequestsByUserHandler);

leaveRequestRouter
  .route('/:leaveRequestId')
  .get(getLeaveRequestByIdHandler)
  .delete(deleteALeaveRequestHandler)
  .patch(updateLeaveRequestStatusByIdHandler);

export { leaveRequestRouter };
