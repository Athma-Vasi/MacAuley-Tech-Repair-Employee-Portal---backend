import { Router } from 'express';

import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from '../../middlewares';
import {
  createNewUserHandler,
  deleteUserHandler,
  getQueriedUsersHandler,
  updateUserHandler,
  updateUserPasswordHandler,
} from './user.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../constants';

const userRouter = Router();

userRouter.use(verifyRoles());

// verifyJWT middleware is applied to all routes except [POST /users] creating a new user

userRouter
  .route('/')
  .get(
    verifyJWTMiddleware,
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getQueriedUsersHandler
  )
  .post(createNewUserHandler)
  .patch(verifyJWTMiddleware, updateUserHandler)
  .delete(verifyJWTMiddleware, deleteUserHandler);

userRouter.route('/update-password').put(verifyJWTMiddleware, updateUserPasswordHandler);

export { userRouter };
