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
  getBenefitsByUserHandler,
} from './benefits.controller';
import {
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getAllBenefitsService,
  getBenefitByIdService,
  getBenefitsByUserService,
} from './benefits.service';

import type { BenefitsDocument, BenefitsSchema, BenefitsPlanKind } from './benefits.model';
import type {
  BenefitsServerResponse,
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetAllBenefitsRequest,
  GetBenefitsByIdRequest,
  GetBenefitsByUserRequest,
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
  getBenefitsByUserHandler,
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getAllBenefitsService,
  getBenefitByIdService,
  getBenefitsByUserService,
};

export type {
  BenefitsDocument,
  BenefitsSchema,
  BenefitsPlanKind,
  BenefitsServerResponse,
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetAllBenefitsRequest,
  GetBenefitsByIdRequest,
  GetBenefitsByUserRequest,
};
