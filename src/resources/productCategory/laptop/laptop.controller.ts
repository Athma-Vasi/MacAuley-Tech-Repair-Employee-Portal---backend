import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewLaptopBulkRequest,
	CreateNewLaptopRequest,
	DeleteALaptopRequest,
	DeleteAllLaptopsRequest,
	GetLaptopByIdRequest,
	GetQueriedLaptopsRequest,
	UpdateLaptopByIdRequest,
	UpdateLaptopsBulkRequest,
} from "./laptop.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { LaptopDocument, LaptopSchema } from "./laptop.model";

import {
	createNewLaptopService,
	deleteALaptopService,
	deleteAllLaptopsService,
	getLaptopByIdService,
	getQueriedLaptopsService,
	getQueriedTotalLaptopsService,
	returnAllLaptopsUploadedFileIdsService,
	updateLaptopByIdService,
} from "./laptop.service";
import {
	FileUploadDocument,
	deleteFileUploadByIdService,
	getFileUploadByIdService,
} from "../../fileUpload";

import {
	ProductReviewDocument,
	deleteAProductReviewService,
	getProductReviewByIdService,
} from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";

// @desc   Create new laptop
// @route  POST /api/v1/product-category/laptop
// @access Private/Admin/Manager
const createNewLaptopHandler = expressAsyncHandler(
	async (
		request: CreateNewLaptopRequest,
		response: Response<ResourceRequestServerResponse<LaptopDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			laptopFields,
		} = request.body;

		const laptopSchema: LaptopSchema = {
			userId,
			username,
			...laptopFields,
		};

		const laptopDocument: LaptopDocument =
			await createNewLaptopService(laptopSchema);

		if (!laptopDocument) {
			response.status(400).json({
				message: "Could not create new laptop",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${laptopDocument.model} laptop`,
			resourceData: [laptopDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new laptops bulk
// @route  POST /api/v1/product-category/laptop/dev
// @access Private/Admin/Manager
const createNewLaptopBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewLaptopBulkRequest,
		response: Response<ResourceRequestServerResponse<LaptopDocument>>,
	) => {
		const { laptopSchemas } = request.body;

		const newLaptops = await Promise.all(
			laptopSchemas.map(async (laptopSchema) => {
				const newLaptop = await createNewLaptopService(laptopSchema);
				return newLaptop;
			}),
		);

		// filter out any laptops that were not created
		const successfullyCreatedLaptops = newLaptops.filter((laptop) => laptop);

		// check if any laptops were created
		if (successfullyCreatedLaptops.length === laptopSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedLaptops.length} laptops`,
				resourceData: successfullyCreatedLaptops,
			});
			return;
		}

		if (successfullyCreatedLaptops.length === 0) {
			response.status(400).json({
				message: "Could not create any laptops",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				laptopSchemas.length - successfullyCreatedLaptops.length
			} laptops`,
			resourceData: successfullyCreatedLaptops,
		});
		return;
	},
);

// @desc   Update laptops bulk
// @route  PATCH /api/v1/product-category/laptop/dev
// @access Private/Admin/Manager
const updateLaptopsBulkHandler = expressAsyncHandler(
	async (
		request: UpdateLaptopsBulkRequest,
		response: Response<ResourceRequestServerResponse<LaptopDocument>>,
	) => {
		const { laptopFields } = request.body;

		const updatedLaptops = await Promise.all(
			laptopFields.map(async (laptopField) => {
				const {
					laptopId,
					documentUpdate: { fields, updateOperator },
				} = laptopField;

				const updatedLaptop = await updateLaptopByIdService({
					_id: laptopId,
					fields,
					updateOperator,
				});

				return updatedLaptop;
			}),
		);

		// filter out any laptops that were not updated
		const successfullyUpdatedLaptops = updatedLaptops.filter(
			removeUndefinedAndNullValues,
		);

		// check if any laptops were updated
		if (successfullyUpdatedLaptops.length === laptopFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedLaptops.length} laptops`,
				resourceData: successfullyUpdatedLaptops,
			});
			return;
		}

		if (successfullyUpdatedLaptops.length === 0) {
			response.status(400).json({
				message: "Could not update any laptops",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				laptopFields.length - successfullyUpdatedLaptops.length
			} laptops`,
			resourceData: successfullyUpdatedLaptops,
		});
		return;
	},
);

// @desc   Get all laptops
// @route  GET /api/v1/product-category/laptop
// @access Private/Admin/Manager
const getQueriedLaptopsHandler = expressAsyncHandler(
	async (
		request: GetQueriedLaptopsRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				LaptopDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalLaptopsService({
				filter: filter as FilterQuery<LaptopDocument> | undefined,
			});
		}

		// get all laptops
		const laptops = await getQueriedLaptopsService({
			filter: filter as FilterQuery<LaptopDocument> | undefined,
			projection: projection as QueryOptions<LaptopDocument>,
			options: options as QueryOptions<LaptopDocument>,
		});
		if (laptops.length === 0) {
			response.status(200).json({
				message: "No laptops that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the laptops
		const fileUploadsArrArr = await Promise.all(
			laptops.map(async (laptop) => {
				const fileUploadPromises = laptop.uploadedFilesIds.map(
					async (uploadedFileId) => {
						const fileUpload = await getFileUploadByIdService(uploadedFileId);

						return fileUpload;
					},
				);

				// Wait for all the promises to resolve before continuing to the next iteration
				const fileUploads = await Promise.all(fileUploadPromises);

				// Filter out any undefined values (in case fileUpload was not found)
				return fileUploads.filter(removeUndefinedAndNullValues);
			}),
		);

		// find all reviews associated with the laptops
		const reviewsArrArr = await Promise.all(
			laptops.map(async (laptop) => {
				const reviewPromises = laptop.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create laptopServerResponse array
		const laptopServerResponseArray = laptops.map((laptop, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...laptop,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved laptops",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: laptopServerResponseArray,
		});
	},
);

// @desc   Get laptop by id
// @route  GET /api/v1/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const getLaptopByIdHandler = expressAsyncHandler(
	async (
		request: GetLaptopByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				LaptopDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const laptopId = request.params.laptopId;

		// get laptop by id
		const laptop = await getLaptopByIdService(laptopId);
		if (!laptop) {
			response
				.status(404)
				.json({ message: "Laptop not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the laptop
		const fileUploads = await Promise.all(
			laptop.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the laptop
		const productReviews = await Promise.all(
			laptop.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create laptopServerResponse
		const laptopServerResponse = {
			...laptop,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved laptop",
			resourceData: [laptopServerResponse],
		});
	},
);

// @desc   Update a laptop by id
// @route  PUT /api/v1/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const updateLaptopByIdHandler = expressAsyncHandler(
	async (
		request: UpdateLaptopByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				LaptopDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { laptopId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update laptop
		const updatedLaptop = await updateLaptopByIdService({
			_id: laptopId,
			fields,
			updateOperator,
		});

		if (!updatedLaptop) {
			response.status(400).json({
				message: "Laptop could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the laptop
		const fileUploads = await Promise.all(
			updatedLaptop.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the laptop
		const productReviews = await Promise.all(
			updatedLaptop.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create laptopServerResponse
		const laptopServerResponse = {
			...updatedLaptop,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Laptop updated successfully",
			resourceData: [laptopServerResponse],
		});
	},
);

// @desc   Delete all laptops
// @route  DELETE /api/v1/product-category/laptop
// @access Private/Admin/Manager
const deleteAllLaptopsHandler = expressAsyncHandler(
	async (
		_request: DeleteAllLaptopsRequest,
		response: Response<ResourceRequestServerResponse<LaptopDocument>>,
	) => {
		// grab all laptops file upload ids
		const uploadedFilesIds = await returnAllLaptopsUploadedFileIdsService();

		// delete all file uploads associated with all laptops
		const deletedFileUploads = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId),
			),
		);

		if (
			deletedFileUploads.some(
				(deletedFileUpload) => deletedFileUpload.deletedCount === 0,
			)
		) {
			response.status(400).json({
				message: "Some File uploads could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete all reviews associated with all laptops
		const deletedReviews = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteAProductReviewService(fileUploadId),
			),
		);

		if (
			deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)
		) {
			response.status(400).json({
				message: "Some reviews could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete all laptops
		const deleteLaptopsResult: DeleteResult = await deleteAllLaptopsService();

		if (deleteLaptopsResult.deletedCount === 0) {
			response.status(400).json({
				message: "All laptops could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All laptops deleted", resourceData: [] });
	},
);

// @desc   Delete a laptop by id
// @route  DELETE /api/v1/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const deleteALaptopHandler = expressAsyncHandler(
	async (
		request: DeleteALaptopRequest,
		response: Response<ResourceRequestServerResponse<LaptopDocument>>,
	) => {
		const laptopId = request.params.laptopId;

		// check if laptop exists
		const laptopExists = await getLaptopByIdService(laptopId);
		if (!laptopExists) {
			response
				.status(404)
				.json({ message: "Laptop does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this laptop
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...laptopExists.uploadedFilesIds];

		// delete all file uploads associated with all laptops
		const deletedFileUploads = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId),
			),
		);

		if (
			deletedFileUploads.some(
				(deletedFileUpload) => deletedFileUpload.deletedCount === 0,
			)
		) {
			response.status(400).json({
				message: "Some File uploads could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete all reviews associated with all laptops
		const deletedReviews = await Promise.all(
			uploadedFilesIds.map(
				async (fileUploadId) => await deleteAProductReviewService(fileUploadId),
			),
		);

		if (
			deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)
		) {
			response.status(400).json({
				message: "Some reviews could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete laptop by id
		const deleteLaptopResult: DeleteResult =
			await deleteALaptopService(laptopId);

		if (deleteLaptopResult.deletedCount === 0) {
			response.status(400).json({
				message: "Laptop could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Laptop deleted", resourceData: [] });
	},
);

export {
	createNewLaptopBulkHandler,
	createNewLaptopHandler,
	deleteALaptopHandler,
	deleteAllLaptopsHandler,
	getLaptopByIdHandler,
	getQueriedLaptopsHandler,
	updateLaptopByIdHandler,
	updateLaptopsBulkHandler,
};
