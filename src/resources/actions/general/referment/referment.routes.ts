import { Router } from "express";
import {
  createNewRefermentController,
  getQueriedRefermentsController,
  getRefermentsByUserController,
  getRefermentByIdController,
  deleteRefermentController,
  deleteAllRefermentsController,
  updateRefermentByIdController,
  createNewRefermentsBulkController,
  updateRefermentsBulkController,
} from "./referment.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createRefermentJoiSchema,
  updateRefermentJoiSchema,
} from "./referment.validation";

const refermentRouter = Router();

refermentRouter
  .route("/")
  .get(getQueriedRefermentsController)
  .post(
    validateSchemaMiddleware(createRefermentJoiSchema, "refermentSchema"),
    createNewRefermentController
  );

refermentRouter.route("/delete-all").delete(deleteAllRefermentsController);

refermentRouter.route("/user").get(getRefermentsByUserController);

// DEV ROUTES
refermentRouter
  .route("/dev")
  .post(createNewRefermentsBulkController)
  .patch(updateRefermentsBulkController);

refermentRouter
  .route("/:refermentId")
  .get(getRefermentByIdController)
  .delete(deleteRefermentController)
  .patch(
    validateSchemaMiddleware(updateRefermentJoiSchema),
    updateRefermentByIdController
  );

export { refermentRouter };
