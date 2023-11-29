import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../middlewares";

import {
	updateProductReviewsBulkHandler,
	createNewProductReviewHandler,
	createNewProductReviewsBulkHandler,
	deleteAllProductReviewsHandler,
	deleteProductReviewHandler,
	getAllProductReviewsBulkHandler,
	getProductReviewByIdHandler,
	getQueriedProductReviewsHandler,
	getQueriedPurchasesOnlineByUserHandler,
	updateProductReviewByIdHandler,
} from "./productReview.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const productReviewRouter = Router();

productReviewRouter.use(verifyJWTMiddleware, verifyRoles());

productReviewRouter.route("/").post(createNewProductReviewHandler).get(
	assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
	getQueriedProductReviewsHandler,
);

productReviewRouter.route("/user").get(
	assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
	getQueriedPurchasesOnlineByUserHandler,
);

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
