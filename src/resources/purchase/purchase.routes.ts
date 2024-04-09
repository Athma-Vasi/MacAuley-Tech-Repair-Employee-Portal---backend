import { Router } from "express";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";

import {
  updatePurchasesBulkHandler,
  createNewPurchaseHandler,
  createNewPurchasesBulkHandler,
  deleteAllPurchasesHandler,
  deletePurchaseHandler,
  getAllPurchasesBulkHandler,
  getPurchaseByIdHandler,
  getQueriedPurchasesHandler,
  getQueriedPurchasesByUserHandler,
  updatePurchaseByIdHandler,
} from "./purchase.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createPurchaseJoiSchema, updatePurchaseJoiSchema } from "./purchase.validation";

const purchaseRouter = Router();

purchaseRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

purchaseRouter
  .route("/")
  .post(
    validateSchemaMiddleware(createPurchaseJoiSchema, "purchaseSchema"),
    createNewPurchaseHandler
  )
  .get(getQueriedPurchasesHandler);

purchaseRouter.route("/user").get(getQueriedPurchasesByUserHandler);

purchaseRouter.route("/delete-all").delete(deleteAllPurchasesHandler);

// DEV ROUTES
purchaseRouter
  .route("/dev")
  .post(createNewPurchasesBulkHandler)
  .get(getAllPurchasesBulkHandler)
  .patch(updatePurchasesBulkHandler);

purchaseRouter
  .route("/:purchaseId")
  .get(getPurchaseByIdHandler)
  .delete(deletePurchaseHandler)
  .patch(validateSchemaMiddleware(updatePurchaseJoiSchema), updatePurchaseByIdHandler);

export { purchaseRouter };
