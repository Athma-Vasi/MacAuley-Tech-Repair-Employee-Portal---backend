import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';
import {
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  updateUserPasswordHandler,
} from './user.controller';

const userRouter = Router();

// verifyJWT middleware is applied to all routes except [POST /users] creating a new user

userRouter
  .route('/')
  .get(verifyJWTMiddleware, getAllUsersHandler)
  .post(createNewUserHandler)
  .patch(verifyJWTMiddleware, updateUserHandler)
  .delete(verifyJWTMiddleware, deleteUserHandler);

userRouter.route('/update-password').put(verifyJWTMiddleware, updateUserPasswordHandler);

export { userRouter };
