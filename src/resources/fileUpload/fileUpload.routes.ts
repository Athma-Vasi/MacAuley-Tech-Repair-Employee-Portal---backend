import { Router } from 'express';
import expressFileUpload from 'express-fileupload';

import {
  verifyJWTMiddleware,
  filesPayloadExistsMiddleware,
  fileSizeLimiterMiddleware,
  fileExtensionLimiterMiddleware,
  fileInfoExtracterMiddleware,
} from '../../middlewares';
import { ALLOWED_FILE_EXTENSIONS } from '../../constants';
import {
  createNewFileUploadHandler,
  deleteAFileUploadHandler,
  deleteAllFileUploadsHandler,
  getAllFileUploadsHandler,
  getFileUploadByIdHandler,
  getFileUploadsByUserHandler,
  insertAssociatedResourceDocumentIdHandler,
} from './fileUpload.controller';

const fileUploadRouter = Router();

fileUploadRouter.use(verifyJWTMiddleware);

fileUploadRouter
  .route('/')
  .get(getAllFileUploadsHandler)
  .post(
    expressFileUpload({ createParentPath: true }),
    filesPayloadExistsMiddleware,
    fileSizeLimiterMiddleware,
    fileExtensionLimiterMiddleware(ALLOWED_FILE_EXTENSIONS),
    fileInfoExtracterMiddleware,
    createNewFileUploadHandler
  )
  .delete(deleteAllFileUploadsHandler);

fileUploadRouter.route('/user').get(getFileUploadsByUserHandler);

fileUploadRouter
  .route('/:fileUploadId')
  .get(getFileUploadByIdHandler)
  .delete(deleteAFileUploadHandler)
  .put(insertAssociatedResourceDocumentIdHandler);

export { fileUploadRouter };
