/**
 * This barrel index file is used to import/export usernameEmailSet model, router, types, handlers and services
 */

/**
 * Imports
 */
import { UsernameEmailSetModel } from "./usernameEmailSet.model";
import { usernameEmailSetRouter } from "./usernameEmailSet.routes";

import {
  checkUsernameEmailExistsController,
  postUsernameEmailSetController,
} from "./usernameEmailSet.controller";

import {
  checkEmailExistsService,
  checkUsernameExistsService,
  createUsernameEmailSetService,
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
} from "./usernameEmailSet.service";

import type {
  GetUsernameEmailExistsRequest,
  UsernameEmailSetResponse,
  PostUsernameEmailSetRequest,
} from "./usernameEmailSet.types";

/**
 * Exports
 */
export {
  UsernameEmailSetModel,
  usernameEmailSetRouter,
  checkUsernameEmailExistsController,
  postUsernameEmailSetController,
  checkEmailExistsService,
  checkUsernameExistsService,
  createUsernameEmailSetService,
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
};

export type {
  GetUsernameEmailExistsRequest,
  UsernameEmailSetResponse,
  PostUsernameEmailSetRequest,
};
