import { Router } from 'express';
import { productRouter } from './product';

const actionsDashboardRouter = Router();

actionsDashboardRouter.use('/product', productRouter);

export { actionsDashboardRouter };
