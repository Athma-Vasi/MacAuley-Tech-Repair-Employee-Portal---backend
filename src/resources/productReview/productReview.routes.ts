import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../middlewares';

import {
  addFieldToProductReviewsBulkHandler,
  createNewProductReviewHandler,
  createNewProductReviewsBulkHandler,
  deleteAllProductReviewsHandler,
  deleteProductReviewHandler,
  getAllProductReviewsBulkHandler,
  getProductReviewByIdHandler,
  getQueriedProductReviewsHandler,
  getQueriedPurchasesOnlineByUserHandler,
  updateProductReviewByIdHandler,
} from './productReview.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../constants';

const productReviewRouter = Router();

productReviewRouter.use(verifyRoles());

productReviewRouter
  .route('/')
  .post(createNewProductReviewHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedProductReviewsHandler)
  .delete(deleteProductReviewHandler);

productReviewRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPurchasesOnlineByUserHandler);

productReviewRouter.route('/delete-all').delete(deleteAllProductReviewsHandler);

// DEV ROUTES
productReviewRouter
  .route('/dev')
  .post(createNewProductReviewsBulkHandler)
  .get(getAllProductReviewsBulkHandler);
productReviewRouter.route('/dev/add-field').post(addFieldToProductReviewsBulkHandler);

productReviewRouter
  .route('/:productReviewId')
  .get(getProductReviewByIdHandler)
  .patch(updateProductReviewByIdHandler);

export { productReviewRouter };
