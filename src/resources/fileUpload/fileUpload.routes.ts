import { Router } from "express";
import expressFileUpload from "express-fileupload";

import {
  assignQueryDefaults,
  fileExtensionLimiterMiddleware,
  fileInfoExtracterMiddleware,
  fileSizeLimiterMiddleware,
  filesPayloadExistsMiddleware,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../middlewares";
import { ALLOWED_FILE_EXTENSIONS } from "../../constants";
import {
  createNewFileUploadController,
  deleteAFileUploadController,
  deleteAllFileUploadsController,
  getAllFileUploadsController,
  getFileUploadByIdController,
  getQueriedFileUploadsByUserController,
  insertAssociatedResourceDocumentIdController,
} from "./fileUpload.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createFileUploadJoiSchema } from "./fileUpload.validation";

const fileUploadRouter = Router();

fileUploadRouter.use(verifyJWTMiddleware, verifyRoles, assignQueryDefaults);
fileUploadRouter.use(verifyRoles);

fileUploadRouter
  .route("/")
  .get(getAllFileUploadsController)
  .post(
    expressFileUpload({ createParentPath: true }),
    filesPayloadExistsMiddleware,
    fileSizeLimiterMiddleware,
    fileExtensionLimiterMiddleware(ALLOWED_FILE_EXTENSIONS),
    fileInfoExtracterMiddleware,
    validateSchemaMiddleware(createFileUploadJoiSchema, "fileUploadSchema"),
    createNewFileUploadController,
  );

fileUploadRouter.route("/delete-many").delete(deleteAllFileUploadsController);

fileUploadRouter.route("/user").get(getQueriedFileUploadsByUserController);

fileUploadRouter
  .route("/:fileUploadId")
  .get(getFileUploadByIdController)
  .delete(deleteAFileUploadController)
  .put(insertAssociatedResourceDocumentIdController);

export { fileUploadRouter };
