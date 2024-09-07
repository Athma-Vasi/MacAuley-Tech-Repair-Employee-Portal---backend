/**
 * This barrel file is used to import/export user model, router, types, handlers and services
 */

/**
 * Imports
 */
import { UserModel } from "./user.model";
import { userRouter } from "./user.routes";

import type {
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  PreferredPronouns,
  Province,
  StatesUS,
  UserDocument,
  UserRoles,
  UserSchema,
} from "./user.model";

/**
 * Exports
 */
export { UserModel, userRouter };
export type {
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  PreferredPronouns,
  Province,
  StatesUS,
  UserDocument,
  UserRoles,
  UserSchema,
};
