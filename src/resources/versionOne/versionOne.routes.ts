import { Router } from 'express';
import { actionsRouter } from '../actions';
import { commentRouter } from '../comment';
import { fileUploadRouter } from '../fileUpload';
import { userRouter } from '../user';
import { repairNoteRouter } from '../repairNote';

const versionOneRouter = Router();
// route: /api/v1
versionOneRouter.use('/actions', actionsRouter);
versionOneRouter.use('/users', userRouter);
versionOneRouter.use('/repair-note', repairNoteRouter);
versionOneRouter.use('/file-upload', fileUploadRouter);
versionOneRouter.use('/comment', commentRouter);

export { versionOneRouter };
