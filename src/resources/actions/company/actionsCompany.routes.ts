import { Router } from 'express';
import { addressChangeRouter } from './addressChange/addressChange.routes';

const actionsCompanyRouter = Router();

actionsCompanyRouter.use('/address-change', addressChangeRouter);

export { actionsCompanyRouter };
