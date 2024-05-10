import { Router } from "express";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";

import {
  updatePurchasesBulkController,
  createNewPurchaseController,
  createNewPurchasesBulkController,
  deleteAllPurchasesController,
  deletePurchaseController,
  getAllPurchasesBulkController,
  getPurchaseByIdController,
  getQueriedPurchasesController,
  getQueriedPurchasesByUserController,
  updatePurchaseByIdController,
} from "./purchase.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createPurchaseJoiSchema, updatePurchaseJoiSchema } from "./purchase.validation";

const purchaseRouter = Router();

purchaseRouter.use(verifyJWTMiddleware, verifyRoles, assignQueryDefaults);

purchaseRouter
  .route("/")
  .post(
    validateSchemaMiddleware(createPurchaseJoiSchema, "purchaseSchema"),
    createNewPurchaseController
  )
  .get(getQueriedPurchasesController);

purchaseRouter.route("/user").get(getQueriedPurchasesByUserController);

purchaseRouter.route("/delete-all").delete(deleteAllPurchasesController);

// DEV ROUTES
purchaseRouter
  .route("/dev")
  .post(createNewPurchasesBulkController)
  .get(getAllPurchasesBulkController)
  .patch(updatePurchasesBulkController);

purchaseRouter
  .route("/:purchaseId")
  .get(getPurchaseByIdController)
  .delete(deletePurchaseController)
  .patch(validateSchemaMiddleware(updatePurchaseJoiSchema), updatePurchaseByIdController);

export { purchaseRouter };
