import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewTabletBulkRequest,
	CreateNewTabletRequest,
	DeleteATabletRequest,
	DeleteAllTabletsRequest,
	GetTabletByIdRequest,
	GetQueriedTabletsRequest,
	UpdateTabletByIdRequest,
	UpdateTabletsBulkRequest,
} from "./tablet.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { TabletDocument, TabletSchema } from "./tablet.model";

import {
	createNewTabletService,
	deleteATabletService,
	deleteAllTabletsService,
	getTabletByIdService,
	getQueriedTabletsService,
	getQueriedTotalTabletsService,
	returnAllTabletsUploadedFileIdsService,
	updateTabletByIdService,
} from "./tablet.service";
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

// @desc   Create new tablet
// @route  POST /api/v1/product-category/tablet
// @access Private/Admin/Manager
const createNewTabletHandler = expressAsyncHandler(
	async (
		request: CreateNewTabletRequest,
		response: Response<ResourceRequestServerResponse<TabletDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			tabletFields,
		} = request.body;

		const tabletSchema: TabletSchema = {
			userId,
			username,
			...tabletFields,
		};

		const tabletDocument: TabletDocument =
			await createNewTabletService(tabletSchema);

		if (!tabletDocument) {
			response.status(400).json({
				message: "Could not create new tablet",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${tabletDocument.model} tablet`,
			resourceData: [tabletDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new tablets bulk
// @route  POST /api/v1/product-category/tablet/dev
// @access Private/Admin/Manager
const createNewTabletBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewTabletBulkRequest,
		response: Response<ResourceRequestServerResponse<TabletDocument>>,
	) => {
		const { tabletSchemas } = request.body;

		const newTablets = await Promise.all(
			tabletSchemas.map(async (tabletSchema) => {
				const newTablet = await createNewTabletService(tabletSchema);
				return newTablet;
			}),
		);

		// filter out any tablets that were not created
		const successfullyCreatedTablets = newTablets.filter((tablet) => tablet);

		// check if any tablets were created
		if (successfullyCreatedTablets.length === tabletSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedTablets.length} tablets`,
				resourceData: successfullyCreatedTablets,
			});
			return;
		}

		if (successfullyCreatedTablets.length === 0) {
			response.status(400).json({
				message: "Could not create any tablets",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				tabletSchemas.length - successfullyCreatedTablets.length
			} tablets`,
			resourceData: successfullyCreatedTablets,
		});
		return;
	},
);

// @desc   Update tablets bulk
// @route  PATCH /api/v1/product-category/tablet/dev
// @access Private/Admin/Manager
const updateTabletsBulkHandler = expressAsyncHandler(
	async (
		request: UpdateTabletsBulkRequest,
		response: Response<ResourceRequestServerResponse<TabletDocument>>,
	) => {
		const { tabletFields } = request.body;

		const updatedTablets = await Promise.all(
			tabletFields.map(async (tabletField) => {
				const {
					tabletId,
					documentUpdate: { fields, updateOperator },
				} = tabletField;

				const updatedTablet = await updateTabletByIdService({
					_id: tabletId,
					fields,
					updateOperator,
				});

				return updatedTablet;
			}),
		);

		// filter out any tablets that were not updated
		const successfullyUpdatedTablets = updatedTablets.filter(
			removeUndefinedAndNullValues,
		);

		// check if any tablets were updated
		if (successfullyUpdatedTablets.length === tabletFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedTablets.length} tablets`,
				resourceData: successfullyUpdatedTablets,
			});
			return;
		}

		if (successfullyUpdatedTablets.length === 0) {
			response.status(400).json({
				message: "Could not update any tablets",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				tabletFields.length - successfullyUpdatedTablets.length
			} tablets`,
			resourceData: successfullyUpdatedTablets,
		});
		return;
	},
);

// @desc   Get all tablets
// @route  GET /api/v1/product-category/tablet
// @access Private/Admin/Manager
const getQueriedTabletsHandler = expressAsyncHandler(
	async (
		request: GetQueriedTabletsRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				TabletDocument & {
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
			totalDocuments = await getQueriedTotalTabletsService({
				filter: filter as FilterQuery<TabletDocument> | undefined,
			});
		}

		// get all tablets
		const tablets = await getQueriedTabletsService({
			filter: filter as FilterQuery<TabletDocument> | undefined,
			projection: projection as QueryOptions<TabletDocument>,
			options: options as QueryOptions<TabletDocument>,
		});
		if (tablets.length === 0) {
			response.status(200).json({
				message: "No tablets that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the tablets
		const fileUploadsArrArr = await Promise.all(
			tablets.map(async (tablet) => {
				const fileUploadPromises = tablet.uploadedFilesIds.map(
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

		// find all reviews associated with the tablets
		const reviewsArrArr = await Promise.all(
			tablets.map(async (tablet) => {
				const reviewPromises = tablet.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create tabletServerResponse array
		const tabletServerResponseArray = tablets.map((tablet, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...tablet,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved tablets",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: tabletServerResponseArray,
		});
	},
);

// @desc   Get tablet by id
// @route  GET /api/v1/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const getTabletByIdHandler = expressAsyncHandler(
	async (
		request: GetTabletByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				TabletDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const tabletId = request.params.tabletId;

		// get tablet by id
		const tablet = await getTabletByIdService(tabletId);
		if (!tablet) {
			response
				.status(404)
				.json({ message: "Tablet not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the tablet
		const fileUploads = await Promise.all(
			tablet.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the tablet
		const productReviews = await Promise.all(
			tablet.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create tabletServerResponse
		const tabletServerResponse = {
			...tablet,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved tablet",
			resourceData: [tabletServerResponse],
		});
	},
);

// @desc   Update a tablet by id
// @route  PUT /api/v1/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const updateTabletByIdHandler = expressAsyncHandler(
	async (
		request: UpdateTabletByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				TabletDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { tabletId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update tablet
		const updatedTablet = await updateTabletByIdService({
			_id: tabletId,
			fields,
			updateOperator,
		});

		if (!updatedTablet) {
			response.status(400).json({
				message: "Tablet could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the tablet
		const fileUploads = await Promise.all(
			updatedTablet.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the tablet
		const productReviews = await Promise.all(
			updatedTablet.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create tabletServerResponse
		const tabletServerResponse = {
			...updatedTablet,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Tablet updated successfully",
			resourceData: [tabletServerResponse],
		});
	},
);

// @desc   Delete all tablets
// @route  DELETE /api/v1/product-category/tablet
// @access Private/Admin/Manager
const deleteAllTabletsHandler = expressAsyncHandler(
	async (
		_request: DeleteAllTabletsRequest,
		response: Response<ResourceRequestServerResponse<TabletDocument>>,
	) => {
		// grab all tablets file upload ids
		const uploadedFilesIds = await returnAllTabletsUploadedFileIdsService();

		// delete all file uploads associated with all tablets
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

		// delete all reviews associated with all tablets
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

		// delete all tablets
		const deleteTabletsResult: DeleteResult = await deleteAllTabletsService();

		if (deleteTabletsResult.deletedCount === 0) {
			response.status(400).json({
				message: "All tablets could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All tablets deleted", resourceData: [] });
	},
);

// @desc   Delete a tablet by id
// @route  DELETE /api/v1/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const deleteATabletHandler = expressAsyncHandler(
	async (
		request: DeleteATabletRequest,
		response: Response<ResourceRequestServerResponse<TabletDocument>>,
	) => {
		const tabletId = request.params.tabletId;

		// check if tablet exists
		const tabletExists = await getTabletByIdService(tabletId);
		if (!tabletExists) {
			response
				.status(404)
				.json({ message: "Tablet does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this tablet
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...tabletExists.uploadedFilesIds];

		// delete all file uploads associated with all tablets
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

		// delete all reviews associated with all tablets
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

		// delete tablet by id
		const deleteTabletResult: DeleteResult =
			await deleteATabletService(tabletId);

		if (deleteTabletResult.deletedCount === 0) {
			response.status(400).json({
				message: "Tablet could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Tablet deleted", resourceData: [] });
	},
);

export {
	createNewTabletBulkHandler,
	createNewTabletHandler,
	deleteATabletHandler,
	deleteAllTabletsHandler,
	getTabletByIdHandler,
	getQueriedTabletsHandler,
	updateTabletByIdHandler,
	updateTabletsBulkHandler,
};
