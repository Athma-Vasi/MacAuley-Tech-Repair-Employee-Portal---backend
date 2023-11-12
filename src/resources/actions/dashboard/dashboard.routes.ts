import { Router } from 'express';
import { productsRouter } from './products';

const actionsDashboardRouter = Router();

actionsDashboardRouter.use('/products', productsRouter);

export { actionsDashboardRouter };
