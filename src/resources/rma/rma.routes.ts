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
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const rmaRouter = Router();

rmaRouter.use(verifyJWTMiddleware, verifyRoles());

rmaRouter
  .route("/")
  .post(createNewRMAHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRMAsHandler);

rmaRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRMAsByUserHandler);

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
