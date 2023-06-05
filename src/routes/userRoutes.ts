import { Router } from 'express';

import {
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,
} from '../controllers';

const userRouter = Router();

userRouter
  .route('/')
  .get(getAllUsersHandler)
  .post(createNewUserHandler)
  .patch(updateUserHandler)
  .delete(deleteUserHandler);

export { userRouter };
