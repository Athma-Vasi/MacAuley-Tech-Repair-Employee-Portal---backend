import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewProductBulkRequest,
  CreateNewProductRequest,
  DeleteAProductRequest,
  DeleteAllProductsRequest,
  GetProductByIdRequest,
  GetQueriedProductsRequest,
  ProductServerResponse,
  UpdateProductByIdRequest,
} from './product.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import type { ProductDocument, ProductSchema } from './product.model';

import {
  createNewProductService,
  deleteAProductService,
  deleteAllProductsService,
  getProductsByIdService,
  getQueriedProductsService,
  getQueriedTotalProductsService,
  returnAllUploadedFileIdsService,
  updateProductByIdService,
} from './product.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../fileUpload';

// @desc   Create new product
// @route  POST /product
// @access Private/Admin/Manager
const createNewProductHandler = expressAsyncHandler(
  async (
    request: CreateNewProductRequest,
    response: Response<ResourceRequestServerResponse<ProductDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      product,
    } = request.body;

    const newProductObject: ProductSchema = {
      userId,
      username,
      action: 'dashboard',
      category: 'product',
      ...product,
    };

    const newProduct = await createNewProductService(newProductObject);

    if (!newProduct) {
      response.status(400).json({
        message: 'Could not create new product',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${product.model} product`,
      resourceData: [newProduct],
    });
  }
);

// DEV ROUTE
// @desc   Create new products bulk
// @route  POST /product/dev
// @access Private/Admin/Manager
const createNewProductBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewProductBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductDocument>>
  ) => {
    const { products } = request.body;

    const newProducts = await Promise.all(
      products.map(async (product) => {
        const newProductObject: ProductSchema = {
          action: 'dashboard',
          category: 'product',
          ...product,
        };

        const newProduct = await createNewProductService(newProductObject);

        return newProduct;
      })
    );

    // filter out any products that were not created
    const successfullyCreatedProducts = newProducts.filter((product) => product);

    // check if any products were created
    if (successfullyCreatedProducts.length === products.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedProducts.length} products`,
        resourceData: successfullyCreatedProducts,
      });
      return;
    } else if (successfullyCreatedProducts.length === 0) {
      response.status(400).json({
        message: 'Could not create any products',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedProducts.length} products`,
        resourceData: successfullyCreatedProducts,
      });
      return;
    }
  }
);

// @desc   Get all products
// @route  GET /product
// @access Private/Admin/Manager
const getQueriedProductsHandler = expressAsyncHandler(
  async (
    request: GetQueriedProductsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ProductDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalProductsService({
        filter: filter as FilterQuery<ProductDocument> | undefined,
      });
    }

    // get all products
    const products = await getQueriedProductsService({
      filter: filter as FilterQuery<ProductDocument> | undefined,
      projection: projection as QueryOptions<ProductDocument>,
      options: options as QueryOptions<ProductDocument>,
    });
    if (products.length === 0) {
      response.status(200).json({
        message: 'No products that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the products (in parallel)
    const fileUploadsArrArr = await Promise.all(
      products.map(async (product) => {
        const fileUploadPromises = product.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create productServerResponse array
    const productServerResponseArray = products
      .map((product, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...product,
          fileUploads,
        };
      })
      .filter((product) => product);

    response.status(200).json({
      message: 'Successfully retrieved products',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: productServerResponseArray as ProductDocument[],
    });
  }
);

// @desc   Get product by id
// @route  GET /product/:productId
// @access Private/Admin/Manager
const getProductByIdHandler = expressAsyncHandler(
  async (
    request: GetProductByIdRequest,
    response: Response<ResourceRequestServerResponse<ProductDocument>>
  ) => {
    const productId = request.params.productId;

    // get product by id
    const product = await getProductsByIdService(productId);
    if (!product) {
      response.status(404).json({ message: 'Product not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the product
    const fileUploadsArr = await Promise.all(
      product.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create productServerResponse
    const productServerResponse: ProductServerResponse = {
      ...product,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved product',
      resourceData: [productServerResponse],
    });
  }
);

// @desc   Update a product by id
// @route  PUT /product/:productId
// @access Private/Admin/Manager
const updateProductByIdHandler = expressAsyncHandler(
  async (
    request: UpdateProductByIdRequest,
    response: Response<ResourceRequestServerResponse<ProductDocument>>
  ) => {
    const { productId } = request.params;
    const { product } = request.body;

    // check if product exists
    const productExists = await getProductsByIdService(productId);
    if (!productExists) {
      response.status(404).json({ message: 'Product does not exist', resourceData: [] });
      return;
    }

    const newProduct = {
      ...productExists,
      ...product,
    };

    // update product
    const updatedProduct = await updateProductByIdService({
      productId,
      fieldsToUpdate: newProduct,
    });

    if (updatedProduct) {
      response.status(200).json({
        message: 'Product updated successfully',
        resourceData: [updatedProduct],
      });
    } else {
      response.status(400).json({
        message: 'Product could not be updated',
        resourceData: [],
      });
    }
  }
);

// @desc   Delete all products
// @route  DELETE /product
// @access Private/Admin/Manager
const deleteAllProductsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllProductsRequest,
    response: Response<ResourceRequestServerResponse<ProductDocument>>
  ) => {
    // delete all file uploads with associated resource 'Product'
    const deleteFileUploadsResult: DeleteResult =
      await deleteAllFileUploadsByAssociatedResourceService('product');
    if (deleteFileUploadsResult.deletedCount === 0) {
      response.status(400).json({
        message:
          'All file uploads associated with all products could not be deleted. Products not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete all products
    const deleteProductsResult: DeleteResult = await deleteAllProductsService();

    if (deleteProductsResult.deletedCount > 0) {
      response.status(200).json({ message: 'All products deleted', resourceData: [] });
    } else {
      response.status(400).json({ message: 'All products could not be deleted', resourceData: [] });
    }
  }
);

// @desc   Delete a product by id
// @route  DELETE /product/:productId
// @access Private/Admin/Manager
const deleteAProductHandler = expressAsyncHandler(
  async (
    request: DeleteAProductRequest,
    response: Response<ResourceRequestServerResponse<ProductDocument>>
  ) => {
    const productId = request.params.productId;

    // check if product exists
    const productExists = await getProductsByIdService(productId);
    if (!productExists) {
      response.status(404).json({ message: 'Product does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this product
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...productExists.uploadedFilesIds];

    // delete all file uploads associated with this product
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this product could not be deleted. Product not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete product by id
    const deleteProductResult: DeleteResult = await deleteAProductService(productId);

    if (deleteProductResult.deletedCount === 1) {
      response.status(200).json({ message: 'Product deleted', resourceData: [] });
    } else {
      response.status(400).json({
        message: 'Product could not be deleted. Please try again.',
        resourceData: [],
      });
    }
  }
);

export {
  createNewProductBulkHandler,
  createNewProductHandler,
  deleteAProductHandler,
  deleteAllProductsHandler,
  getQueriedProductsHandler,
  getProductByIdHandler,
  updateProductByIdHandler,
};
