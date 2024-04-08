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
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createRefermentJoiSchema,
  updateRefermentJoiSchema,
} from "./referment.validation";

const refermentRouter = Router();

refermentRouter
  .route("/")
  .get(getQueriedRefermentsHandler)
  .post(
    validateSchemaMiddleware(createRefermentJoiSchema, "refermentSchema"),
    createNewRefermentHandler
  );

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
  .patch(validateSchemaMiddleware(updateRefermentJoiSchema), updateRefermentByIdHandler);

export { refermentRouter };
