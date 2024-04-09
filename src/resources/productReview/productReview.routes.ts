import { Router } from "express";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";

import {
  updateProductReviewsBulkHandler,
  createNewProductReviewHandler,
  createNewProductReviewsBulkHandler,
  deleteAllProductReviewsHandler,
  deleteProductReviewHandler,
  getAllProductReviewsBulkHandler,
  getProductReviewByIdHandler,
  getQueriedProductReviewsHandler,
  getQueriedProductReviewsByUserHandler,
  updateProductReviewByIdHandler,
} from "./productReview.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  createProductReviewJoiSchema,
  updateProductReviewJoiSchema,
} from "./productReview.validation";

const productReviewRouter = Router();

productReviewRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

productReviewRouter
  .route("/")
  .get(getQueriedProductReviewsHandler)
  .post(
    validateSchemaMiddleware(createProductReviewJoiSchema, "productReviewSchema"),
    createNewProductReviewHandler
  );

productReviewRouter.route("/user").get(getQueriedProductReviewsByUserHandler);

productReviewRouter.route("/delete-all").delete(deleteAllProductReviewsHandler);

// DEV ROUTES
productReviewRouter
  .route("/dev")
  .post(createNewProductReviewsBulkHandler)
  .get(getAllProductReviewsBulkHandler)
  .patch(updateProductReviewsBulkHandler);

productReviewRouter
  .route("/:productReviewId")
  .get(getProductReviewByIdHandler)
  .delete(deleteProductReviewHandler)
  .patch(
    validateSchemaMiddleware(updateProductReviewJoiSchema),
    updateProductReviewByIdHandler
  );

export { productReviewRouter };
