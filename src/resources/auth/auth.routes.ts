import { Router } from 'express';

import { loginLimiter } from '../../middlewares';
import { loginUserHandler, logoutUserHandler, refreshTokenHandler } from './index';

const authRouter = Router();

authRouter.route('/login').post(loginLimiter, loginUserHandler);

authRouter.route('/refresh').get(refreshTokenHandler);

authRouter.route('/logout').post(logoutUserHandler);

export { authRouter };
