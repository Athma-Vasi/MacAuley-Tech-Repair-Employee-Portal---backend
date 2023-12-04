/**
 * This barrel file is used to import/export benefits model, router, types, handlers and services
 */

/**
 * Imports
 */

import { BenefitModel } from "./benefit.model";
import { benefitsRouter } from "./benefit.routes";
import {
  createNewBenefitsHandler,
  deleteABenefitHandler,
  deleteAllBenefitsByUserHandler,
  getAllBenefitsHandler,
  getBenefitByIdHandler,
  getQueriedBenefitsByUserHandler,
} from "./benefit.controller";
import {
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getQueriedBenefitsService,
  getBenefitByIdService,
  getQueriedBenefitsByUserService,
} from "./benefit.service";

import type {
  BenefitDocument,
  BenefitSchema,
  BenefitsPlanKind,
  Currency,
} from "./benefit.model";
import type {
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  GetBenefitsByIdRequest,
  GetQueriedBenefitsByUserRequest,
} from "./benefit.types";

/**
 * Exports
 */

export {
  BenefitModel,
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
  BenefitDocument,
  BenefitSchema,
  BenefitsPlanKind,
  Currency,
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  GetBenefitsByIdRequest,
  GetQueriedBenefitsByUserRequest,
};
