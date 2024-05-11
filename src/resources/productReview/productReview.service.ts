import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { ProductReviewDocument, ProductReviewSchema } from "./productReview.model";
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";

import { ProductReviewModel } from "./productReview.model";
import createHttpError from "http-errors";

async function createNewProductReviewService(
  productReviewSchema: ProductReviewSchema
): Promise<ProductReviewDocument> {
  try {
    const productReview = await ProductReviewModel.create(productReviewSchema);
    return productReview;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewProductReviewService");
  }
}

async function getAllProductReviewsService(): DatabaseResponse<ProductReviewDocument> {
  try {
    const productReviews = await ProductReviewModel.find({}).lean().exec();
    return productReviews;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getAllProductReviewsService");
  }
}

async function getQueriedProductReviewsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ProductReviewDocument>): DatabaseResponse<ProductReviewDocument> {
  try {
    const productReviews = await ProductReviewModel.find(filter, projection, options)
      .lean()
      .exec();
    return productReviews;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedProductReviewsService");
  }
}

async function getQueriedTotalProductReviewsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<ProductReviewDocument>): Promise<number> {
  try {
    const totalProductReviews = await ProductReviewModel.countDocuments(filter)
      .lean()
      .exec();
    return totalProductReviews;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalProductReviewsService");
  }
}

async function getQueriedProductReviewsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ProductReviewDocument>): DatabaseResponse<ProductReviewDocument> {
  try {
    const productReviews = await ProductReviewModel.find(filter, projection, options)
      .lean()
      .exec();
    return productReviews;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "getQueriedProductReviewsByUserService"
    );
  }
}

async function getProductReviewByIdService(
  productReviewId: Types.ObjectId | string
): DatabaseResponseNullable<ProductReviewDocument> {
  try {
    const productReview = await ProductReviewModel.findById(productReviewId)
      .lean()
      .exec();
    return productReview;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getProductReviewByIdService");
  }
}

async function updateProductReviewByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<ProductReviewDocument>): DatabaseResponseNullable<ProductReviewDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const productReview = await ProductReviewModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return productReview;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateProductReviewByIdService");
  }
}

async function deleteAProductReviewService(
  productReviewId: string | Types.ObjectId
): Promise<DeleteResult> {
  try {
    const productReview = await ProductReviewModel.deleteOne({
      _id: productReviewId,
    })
      .lean()
      .exec();
    return productReview;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAProductReviewService");
  }
}

async function deleteAllProductReviewsService(): Promise<DeleteResult> {
  try {
    const productReviews = await ProductReviewModel.deleteMany({}).lean().exec();
    return productReviews;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllProductReviewsService");
  }
}

export {
  createNewProductReviewService,
  getAllProductReviewsService,
  getProductReviewByIdService,
  deleteAProductReviewService,
  deleteAllProductReviewsService,
  getQueriedProductReviewsService,
  getQueriedProductReviewsByUserService,
  getQueriedTotalProductReviewsService,
  updateProductReviewByIdService,
};
