/**
 * This barrel file is used to import/export products router, model, types, controllers and services
 */

/**
 * Imports
 */
import { productRouter } from './product.routes';
import { ProductModel } from './product.model';

import type { ProductDocument, ProductSchema } from './product.model';
import type {
  CreateNewProductRequest,
  DeleteAProductRequest,
  DeleteAllProductsRequest,
  GetProductByIdRequest,
  GetQueriedProductsRequest,
  UpdateProductByIdRequest,
  ProductServerResponse,
} from './product.types';

/**
 * Exports
 */
export { productRouter, ProductModel };

export type {
  ProductDocument,
  ProductSchema,
  CreateNewProductRequest,
  DeleteAProductRequest,
  DeleteAllProductsRequest,
  GetProductByIdRequest,
  GetQueriedProductsRequest,
  UpdateProductByIdRequest,
  ProductServerResponse,
};
