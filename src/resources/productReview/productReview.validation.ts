/**
 * type RatingKind =
  | "halfStar"
  | "oneStar"
  | "oneAndHalfStars"
  | "twoStars"
  | "twoAndHalfStars"
  | "threeStars"
  | "threeAndHalfStars"
  | "fourStars"
  | "fourAndHalfStars"
  | "fiveStars";

type ProductReviewSchema = {
  userId: Types.ObjectId; // customer id
  username: string; // customer username
  productId: Types.ObjectId;
  productCategory: ProductCategory;
  productBrand: string;
  productModel: string;
  productReview: string;
  productRating: RatingKind;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isVerifiedPurchase: boolean;
};
 */

import Joi from "joi";
import {
  BRAND_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  PRODUCT_CATEGORY_REGEX,
  RATING_KIND_REGEX,
  SERIAL_ID_REGEX,
} from "../../regex";

const createProductReviewJoiSchema = Joi.object({
  productId: Joi.string().required(),
  productCategory: Joi.string().regex(PRODUCT_CATEGORY_REGEX).required(),
  productBrand: Joi.string().regex(BRAND_REGEX).required(),
  productModel: Joi.string().regex(SERIAL_ID_REGEX).required(),
  productReview: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  productRating: Joi.string().regex(RATING_KIND_REGEX).required(),
  helpfulVotes: Joi.number().required(),
  unhelpfulVotes: Joi.number().required(),
  isVerifiedPurchase: Joi.boolean().required(),
});

const updateProductReviewJoiSchema = Joi.object({
  productReview: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),
  productRating: Joi.string().regex(RATING_KIND_REGEX).optional(),
  helpfulVotes: Joi.number().optional(),
  unhelpfulVotes: Joi.number().optional(),
  isVerifiedPurchase: Joi.boolean().optional(),
});

export { createProductReviewJoiSchema, updateProductReviewJoiSchema };
