import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import { UserRoles } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';
import {
  ProductCategory,
  ProductDimensions,
  ProductDocument,
  ProductReview,
  ProductSchema,
  Specifications,
} from './product.model';
import { Currency } from '../../company/expenseClaim';
import { FileUploadDocument } from '../../../fileUpload';

interface CreateNewProductRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    product: {
      // page 1
      brand: string;
      model: string;
      productCategory: ProductCategory;
      description: string;
      price: number;
      currency: Currency;
      availability: boolean;
      quantity: number;
      weight: string;
      dimensions: ProductDimensions;
      additionalComments: string;

      // page 2
      specifications: Specifications;

      // page 3
      reviews: ProductReview[];
      uploadedFilesIds: Types.ObjectId[];
    };
  };
}

// DEV ROUTE
interface CreateNewProductBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    products: {
      userId: Types.ObjectId;
      username: string;
      // page 1
      brand: string;
      model: string;
      productCategory: ProductCategory;
      description: string;
      price: number;
      currency: Currency;
      availability: boolean;
      quantity: number;
      weight: string;
      dimensions: ProductDimensions;
      additionalComments: string;

      // page 2
      specifications: Specifications;

      // page 3
      reviews: ProductReview[];
      uploadedFilesIds: Types.ObjectId[];
      requestStatus: RequestStatus;
    }[];
  };
}

interface DeleteAProductRequest extends RequestAfterJWTVerification {
  params: { productId: string };
}

type DeleteAllProductsRequest = RequestAfterJWTVerification;

type GetQueriedProductsRequest = GetQueriedResourceRequest;

interface GetProductByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { productId: string };
}

interface UpdateProductByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    product: Record<keyof ProductSchema, ProductSchema[keyof ProductSchema]>;
  };
  params: { productId: string };
}

type ProductServerResponse = ProductDocument & {
  fileUploads: FileUploadDocument[];
};

export type {
  CreateNewProductRequest,
  CreateNewProductBulkRequest,
  DeleteAProductRequest,
  DeleteAllProductsRequest,
  GetProductByIdRequest,
  GetQueriedProductsRequest,
  UpdateProductByIdRequest,
  ProductServerResponse,
};
