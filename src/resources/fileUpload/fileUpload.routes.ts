import { Router } from 'express';
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

fileUploadRouter
  .route('/')
  .get(getAllFileUploadsHandler)
  .post(createNewFileUploadHandler)
  .delete(deleteAllFileUploadsHandler);

fileUploadRouter.route('/user').get(getFileUploadsByUserHandler);

fileUploadRouter
  .route('/:fileUploadId')
  .get(getFileUploadByIdHandler)
  .delete(deleteAFileUploadHandler)
  .put(insertAssociatedResourceDocumentIdHandler);

export { fileUploadRouter };
