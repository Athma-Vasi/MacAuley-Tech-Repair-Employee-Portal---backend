import { Router } from "express";
import expressFileUpload from "express-fileupload";

import {
  verifyJWTMiddleware,
  filesPayloadExistsMiddleware,
  fileSizeLimiterMiddleware,
  fileExtensionLimiterMiddleware,
  fileInfoExtracterMiddleware,
  verifyRoles,
  assignQueryDefaults,
} from "../../middlewares";
import { ALLOWED_FILE_EXTENSIONS, FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";
import {
  createNewFileUploadHandler,
  deleteAFileUploadHandler,
  deleteAllFileUploadsHandler,
  getAllFileUploadsHandler,
  getFileUploadByIdHandler,
  getQueriedFileUploadsByUserHandler,
  insertAssociatedResourceDocumentIdHandler,
} from "./fileUpload.controller";

const fileUploadRouter = Router();

fileUploadRouter.use(
  verifyJWTMiddleware,
  verifyRoles(),
  assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS)
);
fileUploadRouter.use(verifyRoles());

fileUploadRouter
  .route("/")
  .get(getAllFileUploadsHandler)
  .post(
    expressFileUpload({ createParentPath: true }),
    filesPayloadExistsMiddleware,
    fileSizeLimiterMiddleware,
    fileExtensionLimiterMiddleware(ALLOWED_FILE_EXTENSIONS),
    fileInfoExtracterMiddleware,
    createNewFileUploadHandler
  );

fileUploadRouter.route("/delete-all").delete(deleteAllFileUploadsHandler);

fileUploadRouter.route("/user").get(getQueriedFileUploadsByUserHandler);

fileUploadRouter
  .route("/:fileUploadId")
  .get(getFileUploadByIdHandler)
  .delete(deleteAFileUploadHandler)
  .put(insertAssociatedResourceDocumentIdHandler);

export { fileUploadRouter };
