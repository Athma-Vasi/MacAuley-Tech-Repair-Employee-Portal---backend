import { Router } from 'express';

import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from '../../middlewares';
import {
  createNewUserHandler,
  deleteUserHandler,
  getQueriedUsersHandler,
  getUserByIdHandler,
  getUsersDirectoryHandler,
  updateUserByIdHandler,
  updateUserPasswordHandler,
} from './user.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../constants';

const userRouter = Router();

// verifyJWT middleware is applied to all routes except [POST /users] creating a new user

userRouter
  .route('/')
  .get(
    verifyJWTMiddleware,
    verifyRoles(),
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getQueriedUsersHandler
  )
  .post(createNewUserHandler)
  .patch(verifyJWTMiddleware, verifyRoles(), updateUserByIdHandler)
  .delete(verifyJWTMiddleware, verifyRoles(), deleteUserHandler);

userRouter
  .route('/update-password')
  .put(verifyJWTMiddleware, verifyRoles(), updateUserPasswordHandler);

userRouter.route('/directory').get(verifyJWTMiddleware, verifyRoles(), getUsersDirectoryHandler);

userRouter.route('/:userId').get(verifyJWTMiddleware, verifyRoles(), getUserByIdHandler);

export { userRouter };
