import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import {
  createNewProductBulkHandler,
  createNewProductHandler,
  deleteAProductHandler,
  deleteAllProductsHandler,
  getProductByIdHandler,
  getQueriedProductsHandler,
  updateProductByIdHandler,
} from './product.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const productCategoryRouter = Router();

productCategoryRouter.use(verifyRoles());

productCategoryRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedProductsHandler)
  .post(createNewProductHandler)
  .delete(deleteAllProductsHandler);

// DEV ROUTE
productCategoryRouter.route('/dev').post(createNewProductBulkHandler);

productCategoryRouter
  .route('/:productId')
  .get(getProductByIdHandler)
  .delete(deleteAProductHandler)
  .put(updateProductByIdHandler);

export { productCategoryRouter };
