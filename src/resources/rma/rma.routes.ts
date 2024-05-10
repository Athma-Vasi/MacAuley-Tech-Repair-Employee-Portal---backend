import { Router } from "express";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";

import {
  updateRMAsBulkController,
  createNewRMAController,
  createNewRMAsBulkController,
  deleteAllRMAsController,
  deleteRMAController,
  getAllRMAsBulkController,
  getRMAByIdController,
  getQueriedRMAsController,
  getQueriedRMAsByUserController,
  updateRMAByIdController,
} from "./rma.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createRMAJoiSchema, updateRMAJoiSchema } from "./rma.validation";

const rmaRouter = Router();

rmaRouter.use(verifyJWTMiddleware, verifyRoles, assignQueryDefaults);

rmaRouter
  .route("/")
  .post(validateSchemaMiddleware(createRMAJoiSchema, "rmaSchema"), createNewRMAController)
  .get(getQueriedRMAsController);

rmaRouter.route("/user").get(getQueriedRMAsByUserController);

rmaRouter.route("/delete-all").delete(deleteAllRMAsController);

// DEV ROUTES
rmaRouter
  .route("/dev")
  .post(createNewRMAsBulkController)
  .get(getAllRMAsBulkController)
  .patch(updateRMAsBulkController);

rmaRouter
  .route("/:rmaId")
  .get(getRMAByIdController)
  .delete(deleteRMAController)
  .patch(validateSchemaMiddleware(updateRMAJoiSchema), updateRMAByIdController);

export { rmaRouter };
