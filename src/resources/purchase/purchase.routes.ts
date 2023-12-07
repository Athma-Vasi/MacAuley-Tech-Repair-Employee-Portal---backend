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
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const purchaseRouter = Router();

purchaseRouter.use(
  verifyJWTMiddleware,
  verifyRoles(),
  assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS)
);

purchaseRouter.route("/").post(createNewPurchaseHandler).get(getQueriedPurchasesHandler);

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
  .patch(updatePurchaseByIdHandler)
  .delete(deletePurchaseHandler);

export { purchaseRouter };
