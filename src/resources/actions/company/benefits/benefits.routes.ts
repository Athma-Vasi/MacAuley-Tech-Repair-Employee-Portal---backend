import { Router } from 'express';

import {
  createNewBenefitsBulkHandler,
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getBenefitByIdHandler,
  getQueriedBenefitsByUserHandler,
  updateBenefitStatusByIdHandler,
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

// dev route
benefitsRouter.route('/dev').post(createNewBenefitsBulkHandler);

benefitsRouter
  .route('/:benefitId')
  .get(getBenefitByIdHandler)
  .delete(deleteABenefitHandler)
  .patch(updateBenefitStatusByIdHandler);

export { benefitsRouter };
