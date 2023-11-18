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

const productRouter = Router();

productRouter.use(verifyRoles());

productRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedProductsHandler)
  .post(createNewProductHandler)
  .delete(deleteAllProductsHandler);

// DEV ROUTE
productRouter.route('/dev').post(createNewProductBulkHandler);

productRouter
  .route('/:productId')
  .get(getProductByIdHandler)
  .delete(deleteAProductHandler)
  .put(updateProductByIdHandler);

export { productRouter };
