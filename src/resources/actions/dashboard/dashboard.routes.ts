import { Router } from 'express';
import { productCategoryRouter } from './productCategory';

const actionsDashboardRouter = Router();

actionsDashboardRouter.use('/product-category', productCategoryRouter);

export { actionsDashboardRouter };
