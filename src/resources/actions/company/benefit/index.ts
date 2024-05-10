/**
 * This barrel file is used to import/export benefit model, router, types, handlers and services
 */

/**
 * Imports
 */
import { BenefitModel } from "./benefit.model";
import { benefitRouter } from "./benefit.routes";
import {
  createNewBenefitController,
  createNewBenefitsBulkController,
  deleteAllBenefitsController,
  deleteBenefitController,
  getBenefitByIdController,
  getBenefitsByUserController,
  getQueriedBenefitsController,
  updateBenefitByIdController,
  updateBenefitsBulkController,
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
  createNewBenefitController,
  createNewBenefitService,
  createNewBenefitsBulkController,
  deleteBenefitByIdService,
  deleteAllBenefitsController,
  deleteAllBenefitsService,
  deleteBenefitController,
  getBenefitByIdController,
  getBenefitByIdService,
  getBenefitsByUserController,
  getQueriedBenefitsByUserService,
  getQueriedBenefitsController,
  getQueriedBenefitsService,
  getQueriedTotalBenefitsService,
  updateBenefitByIdService,
  updateBenefitByIdController,
  updateBenefitsBulkController,
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
