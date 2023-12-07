import { Router } from "express";
import {
  createNewRefermentHandler,
  getQueriedRefermentsHandler,
  getRefermentsByUserHandler,
  getRefermentByIdHandler,
  deleteRefermentHandler,
  deleteAllRefermentsHandler,
  updateRefermentByIdHandler,
  createNewRefermentsBulkHandler,
  updateRefermentsBulkHandler,
} from "./referment.controller";

const refermentRouter = Router();

refermentRouter
  .route("/")
  .get(getQueriedRefermentsHandler)
  .post(createNewRefermentHandler);

refermentRouter.route("/delete-all").delete(deleteAllRefermentsHandler);

refermentRouter.route("/user").get(getRefermentsByUserHandler);

// DEV ROUTES
refermentRouter
  .route("/dev")
  .post(createNewRefermentsBulkHandler)
  .patch(updateRefermentsBulkHandler);

refermentRouter
  .route("/:refermentId")
  .get(getRefermentByIdHandler)
  .delete(deleteRefermentHandler)
  .patch(updateRefermentByIdHandler);

export { refermentRouter };
