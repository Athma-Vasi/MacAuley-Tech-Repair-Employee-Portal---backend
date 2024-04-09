import Joi from "joi";
import {
  EVENT_KIND_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  GRAMMAR_TEXT_INPUT_REGEX,
  TIME_RAILWAY_REGEX,
  USER_ROLES_REGEX,
} from "../../../../regex";

const createEventJoiSchema = Joi.object({
  creatorRole: Joi.string().regex(USER_ROLES_REGEX).required(),
  eventTitle: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
  eventKind: Joi.string().regex(EVENT_KIND_REGEX).required(),
  eventStartDate: Joi.date().required(),
  eventEndDate: Joi.date().required(),
  eventStartTime: Joi.string().regex(TIME_RAILWAY_REGEX).required(),
  eventEndTime: Joi.string().regex(TIME_RAILWAY_REGEX).required(),
  eventDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  eventLocation: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
  eventAttendees: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional().allow(""),
  requiredItems: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional().allow(""),
  rsvpDeadline: Joi.date().required(),
});

const updateEventJoiSchema = Joi.object({
  creatorRole: Joi.string().regex(USER_ROLES_REGEX),
  eventTitle: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
  eventKind: Joi.string().regex(EVENT_KIND_REGEX),
  eventStartDate: Joi.date(),
  eventEndDate: Joi.date(),
  eventStartTime: Joi.string().regex(TIME_RAILWAY_REGEX),
  eventEndTime: Joi.string().regex(TIME_RAILWAY_REGEX),
  eventDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  eventLocation: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
  eventAttendees: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  requiredItems: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  rsvpDeadline: Joi.date(),
});

export { createEventJoiSchema, updateEventJoiSchema };
