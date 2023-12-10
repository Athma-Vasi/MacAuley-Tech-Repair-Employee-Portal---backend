import { Router } from "express";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";

import {
  updateRMAsBulkHandler,
  createNewRMAHandler,
  createNewRMAsBulkHandler,
  deleteAllRMAsHandler,
  deleteRMAHandler,
  getAllRMAsBulkHandler,
  getRMAByIdHandler,
  getQueriedRMAsHandler,
  getQueriedRMAsByUserHandler,
  updateRMAByIdHandler,
} from "./rma.controller";

const rmaRouter = Router();

rmaRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

rmaRouter.route("/").post(createNewRMAHandler).get(getQueriedRMAsHandler);

rmaRouter.route("/user").get(getQueriedRMAsByUserHandler);

rmaRouter.route("/delete-all").delete(deleteAllRMAsHandler);

// DEV ROUTES
rmaRouter
  .route("/dev")
  .post(createNewRMAsBulkHandler)
  .get(getAllRMAsBulkHandler)
  .patch(updateRMAsBulkHandler);

rmaRouter
  .route("/:rmaId")
  .get(getRMAByIdHandler)
  .patch(updateRMAByIdHandler)
  .delete(deleteRMAHandler);

export { rmaRouter };
