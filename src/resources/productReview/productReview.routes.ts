import { Router } from "express";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";

import {
  updateProductReviewsBulkController,
  createNewProductReviewController,
  createNewProductReviewsBulkController,
  deleteAllProductReviewsController,
  deleteProductReviewController,
  getAllProductReviewsBulkController,
  getProductReviewByIdController,
  getQueriedProductReviewsController,
  getQueriedProductReviewsByUserController,
  updateProductReviewByIdController,
} from "./productReview.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  createProductReviewJoiSchema,
  updateProductReviewJoiSchema,
} from "./productReview.validation";

const productReviewRouter = Router();

productReviewRouter.use(verifyJWTMiddleware, verifyRoles, assignQueryDefaults);

productReviewRouter
  .route("/")
  .get(getQueriedProductReviewsController)
  .post(
    validateSchemaMiddleware(createProductReviewJoiSchema, "productReviewSchema"),
    createNewProductReviewController
  );

productReviewRouter.route("/user").get(getQueriedProductReviewsByUserController);

productReviewRouter.route("/delete-all").delete(deleteAllProductReviewsController);

// DEV ROUTES
productReviewRouter
  .route("/dev")
  .post(createNewProductReviewsBulkController)
  .get(getAllProductReviewsBulkController)
  .patch(updateProductReviewsBulkController);

productReviewRouter
  .route("/:productReviewId")
  .get(getProductReviewByIdController)
  .delete(deleteProductReviewController)
  .patch(
    validateSchemaMiddleware(updateProductReviewJoiSchema),
    updateProductReviewByIdController
  );

export { productReviewRouter };
