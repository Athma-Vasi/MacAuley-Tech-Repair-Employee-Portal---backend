import { Router } from 'express';

import {
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getBenefitByIdHandler,
  getQueriedBenefitsByUserHandler,
} from './benefits.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const benefitsRouter = Router();

benefitsRouter.use(verifyRoles());

benefitsRouter
  .route('/')
  .post(createNewBenefitsHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAllBenefitsHandler);

benefitsRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedBenefitsByUserHandler)
  .delete(deleteAllBenefitsByUserHandler);

benefitsRouter.route('/:benefitsId').get(getBenefitByIdHandler).delete(deleteABenefitHandler);

export { benefitsRouter };
