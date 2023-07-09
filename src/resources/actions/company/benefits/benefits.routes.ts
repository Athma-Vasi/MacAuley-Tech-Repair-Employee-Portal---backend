import { Router } from 'express';

import {
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getBenefitByIdHandler,
  getBenefitsByUserHandler,
} from './benefits.controller';

const benefitsRouter = Router();

benefitsRouter.route('/').post(createNewBenefitsHandler).get(getAllBenefitsHandler);

benefitsRouter.route('/user').get(getBenefitsByUserHandler).delete(deleteAllBenefitsByUserHandler);

benefitsRouter.route('/:benefitsId').get(getBenefitByIdHandler).delete(deleteABenefitHandler);

export { benefitsRouter };
