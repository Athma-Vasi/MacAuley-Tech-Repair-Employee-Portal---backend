import { Router } from "express";
import {
  createNewErrorLogController,
  deleteAllErrorLogsController,
  deleteAnErrorLogController,
  getErrorLogByIdController,
  getErrorLogsByUserController,
  getQueriedErrorLogsController,
  updateErrorLogByIdController,
} from "./errorLog.controller";

const errorLogRouter = Router();

errorLogRouter
  .route("/")
  .get(getQueriedErrorLogsController)
  .post(createNewErrorLogController);

errorLogRouter.route("/delete-all").delete(deleteAllErrorLogsController);

errorLogRouter.route("/user").get(getErrorLogsByUserController);

errorLogRouter
  .route("/:errorLogId")
  .get(getErrorLogByIdController)
  .delete(deleteAnErrorLogController)
  .patch(updateErrorLogByIdController);

export { errorLogRouter };
