import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../middlewares';

import {
  addFieldToPurchaseInStoresBulkHandler,
  createNewPurchaseInStoreHandler,
  createNewPurchaseInStoresBulkHandler,
  deletePurchaseInStoreHandler,
  getAllPurchaseInStoresBulkHandler,
  getPurchaseInStoreByIdHandler,
  getQueriedPurchaseInStoresHandler,
  getQueriedPurchasesInStoreByUserHandler,
  updatePurchaseInStoreByIdHandler,
} from './purchaseInStore.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../constants';

const purchaseInStoreRouter = Router();

purchaseInStoreRouter.use(verifyRoles());

purchaseInStoreRouter
  .route('/')
  .post(createNewPurchaseInStoreHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPurchaseInStoresHandler)
  .delete(deletePurchaseInStoreHandler);

purchaseInStoreRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPurchasesInStoreByUserHandler);

// DEV ROUTES
purchaseInStoreRouter
  .route('/dev')
  .post(createNewPurchaseInStoresBulkHandler)
  .get(getAllPurchaseInStoresBulkHandler);
purchaseInStoreRouter.route('/dev/add-field').post(addFieldToPurchaseInStoresBulkHandler);

purchaseInStoreRouter
  .route('/:purchaseInStoreId')
  .get(getPurchaseInStoreByIdHandler)
  .patch(updatePurchaseInStoreByIdHandler);
