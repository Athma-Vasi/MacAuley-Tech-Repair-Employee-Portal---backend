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
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createRMAJoiSchema, updateRMAJoiSchema } from "./rma.validation";

const rmaRouter = Router();

rmaRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

rmaRouter
  .route("/")
  .post(validateSchemaMiddleware(createRMAJoiSchema, "rmaSchema"), createNewRMAHandler)
  .get(getQueriedRMAsHandler);

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
  .delete(deleteRMAHandler)
  .patch(validateSchemaMiddleware(updateRMAJoiSchema), updateRMAByIdHandler);

export { rmaRouter };
