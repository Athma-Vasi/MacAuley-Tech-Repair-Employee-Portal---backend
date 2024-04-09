/**
 * type CommentSchema = {
  userId: Types.ObjectId;
  username: string;
  roles: UserRoles;

  firstName: string;
  middleName: string;
  lastName: string;
  jobPosition: JobPosition;
  department: Department;
  profilePictureUrl: string;
  parentResourceId: Types.ObjectId;
  comment: string;
  quotedUsername: string;
  quotedComment: string;
  likesCount: number;
  dislikesCount: number;
  reportsCount: number;

  isFeatured: boolean;
  isDeleted: boolean;

  likedUserIds: Types.ObjectId[];
  dislikedUserIds: Types.ObjectId[];
  reportedUserIds: Types.ObjectId[];
};
 */

import Joi from "joi";
import {
  DEPARTMENT_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  JOB_POSITION_REGEX,
  NAME_REGEX,
  USERNAME_REGEX,
} from "../../regex";

const createCommentJoiSchema = Joi.object({
  firstName: Joi.string().regex(NAME_REGEX).required(),
  middleName: Joi.string().regex(NAME_REGEX).allow("").optional(),
  lastName: Joi.string().regex(NAME_REGEX).required(),
  jobPosition: Joi.string().regex(JOB_POSITION_REGEX).required(),
  department: Joi.string().regex(DEPARTMENT_REGEX).required(),
  profilePictureUrl: Joi.string().uri().required(),
  parentResourceId: Joi.string().required(),
  comment: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  quotedUsername: Joi.string().regex(USERNAME_REGEX).allow("").optional(),
  quotedComment: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).allow("").optional(),
  likesCount: Joi.number().required(),
  dislikesCount: Joi.number().required(),
  reportsCount: Joi.number().required(),
  isFeatured: Joi.boolean().required(),
  isDeleted: Joi.boolean().required(),
  likedUserIds: Joi.array().items(Joi.string()).required(),
  dislikedUserIds: Joi.array().items(Joi.string()).required(),
  reportedUserIds: Joi.array().items(Joi.string()).required(),
});

const updateCommentJoiSchema = Joi.object({
  firstName: Joi.string().regex(NAME_REGEX).optional(),
  middleName: Joi.string().regex(NAME_REGEX).allow("").optional(),
  lastName: Joi.string().regex(NAME_REGEX).optional(),
  jobPosition: Joi.string().regex(JOB_POSITION_REGEX).optional(),
  department: Joi.string().regex(DEPARTMENT_REGEX).optional(),
  profilePictureUrl: Joi.string().uri().optional(),
  parentResourceId: Joi.string().optional(),
  comment: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),
  quotedUsername: Joi.string().regex(USERNAME_REGEX).allow("").optional(),
  quotedComment: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).allow("").optional(),
  likesCount: Joi.number().optional(),
  dislikesCount: Joi.number().optional(),
  reportsCount: Joi.number().optional(),
  isFeatured: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional(),
  likedUserIds: Joi.array().items(Joi.string()).optional(),
  dislikedUserIds: Joi.array().items(Joi.string()).optional(),
  reportedUserIds: Joi.array().items(Joi.string()).optional(),
});

export { createCommentJoiSchema, updateCommentJoiSchema };
