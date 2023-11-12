import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../types';
import { ProductDocument, ProductModel, ProductSchema } from './product.model';

async function createNewProductService(product: ProductSchema): Promise<ProductDocument> {
  try {
    const newProduct = await ProductModel.create(product);
    return newProduct;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewProductService' });
  }
}

async function getQueriedProductsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ProductDocument>): DatabaseResponse<ProductDocument> {
  try {
    const products = await ProductModel.find(filter, projection, options).lean().exec();
    return products;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedProductsService' });
  }
}

async function getQueriedTotalProductsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<ProductDocument>): Promise<number> {
  try {
    const totalProducts = await ProductModel.countDocuments(filter).lean().exec();
    return totalProducts;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalProductsService' });
  }
}

async function getProductsByIdService(
  productId: Types.ObjectId | string
): DatabaseResponseNullable<ProductDocument> {
  try {
    const product = await ProductModel.findById(productId).select('-__v').lean().exec();
    return product;
  } catch (error: any) {
    throw new Error(error, { cause: 'getProductsByIdService' });
  }
}

async function updateProductByIdService({
  fieldsToUpdate,
  productId,
}: {
  productId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof ProductDocument, ProductDocument[keyof ProductDocument]>;
}): DatabaseResponseNullable<ProductDocument> {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return product;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateProductByIdService' });
  }
}

async function deleteAllProductsService(): Promise<DeleteResult> {
  try {
    const products = await ProductModel.deleteMany({}).lean().exec();
    return products;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllProductsService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const products = await ProductModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = products.flatMap((product) => product.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteAProductService(productId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const product = await ProductModel.deleteOne({ _id: productId }).lean().exec();
    return product;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAProductService' });
  }
}

export {
  createNewProductService,
  getQueriedProductsService,
  getQueriedTotalProductsService,
  getProductsByIdService,
  updateProductByIdService,
  deleteAllProductsService,
  returnAllUploadedFileIdsService,
  deleteAProductService,
};
