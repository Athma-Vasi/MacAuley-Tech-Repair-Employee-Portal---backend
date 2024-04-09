import Joi from "joi";
import {
  ARTICLE_TITLE_REGEX,
  FULL_NAME_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  GRAMMAR_TEXT_INPUT_REGEX,
} from "../../../../regex";

const createAnnouncementJoiSchema = Joi.object({
  title: Joi.string().regex(ARTICLE_TITLE_REGEX).required(),
  author: Joi.string().regex(FULL_NAME_REGEX).required(),
  bannerImageSrc: Joi.string().uri().optional().allow(""),
  bannerImageSrcCompressed: Joi.string().uri().optional().allow(""),
  bannerImageAlt: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).optional().allow(""),
  article: Joi.array().items(Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)).required(),
  timeToRead: Joi.number().integer().required(),
  ratingResponse: Joi.object({
    ratingEmotion: Joi.object({
      estatic: Joi.number().integer().required(),
      happy: Joi.number().integer().required(),
      neutral: Joi.number().integer().required(),
      annoyed: Joi.number().integer().required(),
      devastated: Joi.number().integer().required(),
    }).required(),
    ratingCount: Joi.number().integer().required(),
  }).required(),
  ratedUserIds: Joi.array().items(Joi.string().optional()).required(),
}).required();

const updateAnnouncementJoiSchema = Joi.object({
  title: Joi.string().regex(ARTICLE_TITLE_REGEX),
  author: Joi.string().regex(FULL_NAME_REGEX),
  bannerImageSrc: Joi.string().uri(),
  bannerImageSrcCompressed: Joi.string().uri(),
  bannerImageAlt: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
  article: Joi.array().items(Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)),
  timeToRead: Joi.number().integer(),
  ratingResponse: Joi.object({
    ratingEmotion: Joi.object({
      estatic: Joi.number().integer().required(),
      happy: Joi.number().integer().required(),
      neutral: Joi.number().integer().required(),
      annoyed: Joi.number().integer().required(),
      devastated: Joi.number().integer().required(),
    }).required(),
    ratingCount: Joi.number().integer().required(),
  }),
  ratedUserIds: Joi.array().items(Joi.string()),
});

export { createAnnouncementJoiSchema, updateAnnouncementJoiSchema };
