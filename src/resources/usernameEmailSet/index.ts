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
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
} from "./usernameEmailSet.service";

/**
 * Exports
 */
export {
  checkUsernameEmailExistsController,
  postUsernameEmailSetController,
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
  UsernameEmailSetModel,
  usernameEmailSetRouter,
};
