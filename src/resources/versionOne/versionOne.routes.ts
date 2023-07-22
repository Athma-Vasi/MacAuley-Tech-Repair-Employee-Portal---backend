import { Router } from 'express';
import { actionsRouter } from '../actions';
import { commentRouter } from '../comment';
import { fileUploadRouter } from '../fileUpload';
import { noteRouter } from '../note';
import { userRouter } from '../user';

const versionOneRouter = Router();
// route: /api/v1
versionOneRouter.use('/actions', actionsRouter);
versionOneRouter.use('/users', userRouter);
versionOneRouter.use('/notes', noteRouter);
versionOneRouter.use('/file-uploads', fileUploadRouter);
versionOneRouter.use('/comments', commentRouter);

export { versionOneRouter };
