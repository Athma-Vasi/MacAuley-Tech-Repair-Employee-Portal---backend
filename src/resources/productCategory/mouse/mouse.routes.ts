import { Router } from "express";
import {
  createNewMouseBulkHandler,
  createNewMouseHandler,
  deleteAMouseHandler,
  deleteAllMiceHandler,
  getMouseByIdHandler,
  getQueriedMiceHandler,
  updateMouseByIdHandler,
  updateMiceBulkHandler,
} from "./mouse.controller";

const mouseRouter = Router();

mouseRouter.route("/").get(getQueriedMiceHandler).post(createNewMouseHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
mouseRouter.route("/delete-all").delete(deleteAllMiceHandler);

// DEV ROUTE
mouseRouter.route("/dev").post(createNewMouseBulkHandler).patch(updateMiceBulkHandler);

// single document routes
mouseRouter
  .route("/:mouseId")
  .get(getMouseByIdHandler)
  .delete(deleteAMouseHandler)
  .patch(updateMouseByIdHandler);

export { mouseRouter };
