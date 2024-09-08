/**
 * This barrel index file is used to import/export usernameEmailSet model, router, types, handlers and services
 */

/**
 * Imports
 */
import { UsernameEmailSetModel } from "./usernameEmailSet.model";
import { usernameEmailSetRouter } from "./usernameEmailSet.routes";

import {
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
} from "./usernameEmailSet.service";

/**
 * Exports
 */
export {
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
  UsernameEmailSetModel,
  usernameEmailSetRouter,
};
