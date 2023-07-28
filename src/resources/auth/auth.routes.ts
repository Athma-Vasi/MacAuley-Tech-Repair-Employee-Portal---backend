import { Router } from 'express';

import { loginLimiter } from '../../middlewares';
import { loginUserHandler, logoutUserHandler, refreshTokenHandler } from '../auth/auth.controller';

const authRouter = Router();

// ADD LOGIN LIMITER FOR PRODUCTION
// authRouter.route('/login').post(loginLimiter, loginUserHandler);
authRouter.route('/login').post(loginUserHandler);

authRouter.route('/refresh').get(refreshTokenHandler);

authRouter.route('/logout').post(logoutUserHandler);

export { authRouter };
