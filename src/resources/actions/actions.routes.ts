import { Router } from 'express';

import {
  fileExtensionLimiterMiddleware,
  fileSizeLimiterMiddleware,
  filesPayloadExistsMiddleware,
  fileInfoExtracterMiddleware,
  verifyJWTMiddleware,
} from '../../middlewares';
import { actionsGeneralRouter } from './general';
import { actionsCompanyRouter } from './company';
import { fileUploadRouter } from '../fileUpload';

const actionsRouter = Router();

// verifyJWT middleware is applied to all routes in this router
actionsRouter.use(verifyJWTMiddleware);

actionsRouter.use('/company', actionsCompanyRouter);
actionsRouter.use('/general', actionsGeneralRouter);
actionsRouter.use(
  '/file-uploads',
  filesPayloadExistsMiddleware,
  fileSizeLimiterMiddleware,
  fileExtensionLimiterMiddleware,
  fileInfoExtracterMiddleware,
  fileUploadRouter
);

export { actionsRouter };
