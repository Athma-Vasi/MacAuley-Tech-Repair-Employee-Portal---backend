import { Router } from 'express';
import { purchaseInStoreRouter } from './purchaseInStore';
import { purchaseOnlineRouter } from './purchaseOnline';

const purchaseRouter = Router();

purchaseRouter.use('/in-store', purchaseInStoreRouter);
purchaseRouter.use('/online', purchaseOnlineRouter);

export { purchaseRouter };
