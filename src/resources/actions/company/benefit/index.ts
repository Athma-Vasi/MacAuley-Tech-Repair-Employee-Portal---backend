/**
 * This barrel file is used to import/export benefit model, router, types, handlers and services
 */

/**
 * Imports
 */
import { BenefitModel } from "./benefit.model";
import { benefitRouter } from "./benefit.routes";
import {
  createNewBenefitHandler,
  createNewBenefitsBulkHandler,
  deleteAllBenefitsHandler,
  deleteBenefitHandler,
  getBenefitByIdHandler,
  getBenefitsByUserHandler,
  getQueriedBenefitsHandler,
  updateBenefitStatusByIdHandler,
  updateBenefitsBulkHandler,
} from "./benefit.controller";
import {
  createNewBenefitService,
  deleteBenefitByIdService,
  deleteAllBenefitsService,
  getBenefitByIdService,
  getQueriedBenefitsByUserService,
  getQueriedBenefitsService,
  getQueriedTotalBenefitsService,
  updateBenefitByIdService,
} from "./benefit.service";

import type { BenefitDocument, BenefitSchema } from "./benefit.model";
import type {
  CreateNewBenefitRequest,
  CreateNewBenefitsBulkRequest,
  DeleteAllBenefitsRequest,
  DeleteAnBenefitRequest,
  GetBenefitByIdRequest,
  GetQueriedBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  UpdateBenefitByIdRequest,
  UpdateBenefitsBulkRequest,
} from "./benefit.types";

/**
 * Exports
 */
export {
  BenefitModel,
  benefitRouter,
  createNewBenefitHandler,
  createNewBenefitService,
  createNewBenefitsBulkHandler,
  deleteBenefitByIdService,
  deleteAllBenefitsHandler,
  deleteAllBenefitsService,
  deleteBenefitHandler,
  getBenefitByIdHandler,
  getBenefitByIdService,
  getBenefitsByUserHandler,
  getQueriedBenefitsByUserService,
  getQueriedBenefitsHandler,
  getQueriedBenefitsService,
  getQueriedTotalBenefitsService,
  updateBenefitByIdService,
  updateBenefitStatusByIdHandler,
  updateBenefitsBulkHandler,
};

export type {
  BenefitDocument,
  BenefitSchema,
  CreateNewBenefitRequest,
  CreateNewBenefitsBulkRequest,
  DeleteAllBenefitsRequest,
  DeleteAnBenefitRequest,
  GetBenefitByIdRequest,
  GetQueriedBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  UpdateBenefitByIdRequest,
  UpdateBenefitsBulkRequest,
};
