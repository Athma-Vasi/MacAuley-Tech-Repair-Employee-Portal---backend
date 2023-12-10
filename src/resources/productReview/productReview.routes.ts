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

const productReviewRouter = Router();

productReviewRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

productReviewRouter
  .route("/")
  .post(createNewProductReviewHandler)
  .get(getQueriedProductReviewsHandler);

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
  .patch(updateProductReviewByIdHandler)
  .delete(deleteProductReviewHandler);

export { productReviewRouter };
