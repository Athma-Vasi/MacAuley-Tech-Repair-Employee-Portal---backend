import { Router } from "express";
import {
  createNewErrorLogController,
  getQueriedErrorLogsController,
  getErrorLogsByUserController,
  getErrorLogByIdController,
  deleteAnErrorLogController,
  deleteAllErrorLogsController,
  updateErrorLogByIdController,
  createNewErrorLogsBulkController,
  updateErrorLogsBulkController,
} from "./errorLog.controller";

const errorLogRouter = Router();

errorLogRouter
  .route("/")
  .get(getQueriedErrorLogsController)
  .post(createNewErrorLogController);

errorLogRouter.route("/delete-all").delete(deleteAllErrorLogsController);

errorLogRouter.route("/user").get(getErrorLogsByUserController);

// DEV ROUTES
errorLogRouter
  .route("/dev")
  .post(createNewErrorLogsBulkController)
  .patch(updateErrorLogsBulkController);

errorLogRouter
  .route("/:errorLogId")
  .get(getErrorLogByIdController)
  .delete(deleteAnErrorLogController)
  .patch(updateErrorLogByIdController);

export { errorLogRouter };
