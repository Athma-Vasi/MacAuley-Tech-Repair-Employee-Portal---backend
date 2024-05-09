import { Router } from "express";
import {
  createNewErrorLogHandler,
  getQueriedErrorLogsHandler,
  getErrorLogsByUserHandler,
  getErrorLogByIdHandler,
  deleteAnErrorLogHandler,
  deleteAllErrorLogsHandler,
  updateErrorLogByIdHandler,
  createNewErrorLogsBulkHandler,
  updateErrorLogsBulkHandler,
} from "./errorLog.controller";

const errorLogRouter = Router();

errorLogRouter.route("/").get(getQueriedErrorLogsHandler).post(createNewErrorLogHandler);

errorLogRouter.route("/delete-all").delete(deleteAllErrorLogsHandler);

errorLogRouter.route("/user").get(getErrorLogsByUserHandler);

// DEV ROUTES
errorLogRouter
  .route("/dev")
  .post(createNewErrorLogsBulkHandler)
  .patch(updateErrorLogsBulkHandler);

errorLogRouter
  .route("/:errorLogId")
  .get(getErrorLogByIdHandler)
  .delete(deleteAnErrorLogHandler)
  .patch(updateErrorLogByIdHandler);

export { errorLogRouter };
