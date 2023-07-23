/**
 * This barrel file is used to import/export benefits model, router, types, handlers and services
 */

/**
 * Imports
 */

import { BenefitsModel } from './benefits.model';
import { benefitsRouter } from './benefits.routes';
import {
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getBenefitByIdHandler,
  getQueriedBenefitsByUserHandler,
} from './benefits.controller';
import {
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getQueriedBenefitsService,
  getBenefitByIdService,
  getQueriedBenefitsByUserService,
} from './benefits.service';

import type {
  BenefitsDocument,
  BenefitsSchema,
  BenefitsPlanKind,
  Currency,
} from './benefits.model';
import type {
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  GetBenefitsByIdRequest,
  GetQueriedBenefitsByUserRequest,
} from './benefits.types';

/**
 * Exports
 */

export {
  BenefitsModel,
  benefitsRouter,
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getBenefitByIdHandler,
  getQueriedBenefitsByUserHandler,
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getQueriedBenefitsService,
  getBenefitByIdService,
  getQueriedBenefitsByUserService,
};

export type {
  BenefitsDocument,
  BenefitsSchema,
  BenefitsPlanKind,
  Currency,
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  GetBenefitsByIdRequest,
  GetQueriedBenefitsByUserRequest,
};
