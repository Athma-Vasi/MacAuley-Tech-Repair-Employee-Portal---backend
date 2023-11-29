import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewPsuBulkRequest,
	CreateNewPsuRequest,
	DeleteAPsuRequest,
	DeleteAllPsusRequest,
	GetPsuByIdRequest,
	GetQueriedPsusRequest,
	UpdatePsuByIdRequest,
	UpdatePsusBulkRequest,
} from "./psu.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { PsuDocument, PsuSchema } from "./psu.model";

import {
	createNewPsuService,
	deleteAPsuService,
	deleteAllPsusService,
	getPsuByIdService,
	getQueriedPsusService,
	getQueriedTotalPsusService,
	returnAllPsusUploadedFileIdsService,
	updatePsuByIdService,
} from "./psu.service";
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

// @desc   Create new psu
// @route  POST /api/v1/product-category/psu
// @access Private/Admin/Manager
const createNewPsuHandler = expressAsyncHandler(
	async (
		request: CreateNewPsuRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			psuFields,
		} = request.body;

		const psuSchema: PsuSchema = {
			userId,
			username,
			...psuFields,
		};

		const psuDocument: PsuDocument = await createNewPsuService(psuSchema);

		if (!psuDocument) {
			response.status(400).json({
				message: "Could not create new psu",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${psuDocument.model} psu`,
			resourceData: [psuDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new psus bulk
// @route  POST /api/v1/product-category/psu/dev
// @access Private/Admin/Manager
const createNewPsuBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewPsuBulkRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		const { psuSchemas } = request.body;

		const newPsus = await Promise.all(
			psuSchemas.map(async (psuSchema) => {
				const newPsu = await createNewPsuService(psuSchema);
				return newPsu;
			}),
		);

		// filter out any psus that were not created
		const successfullyCreatedPsus = newPsus.filter((psu) => psu);

		// check if any psus were created
		if (successfullyCreatedPsus.length === psuSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedPsus.length} psus`,
				resourceData: successfullyCreatedPsus,
			});
			return;
		}

		if (successfullyCreatedPsus.length === 0) {
			response.status(400).json({
				message: "Could not create any psus",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				psuSchemas.length - successfullyCreatedPsus.length
			} psus`,
			resourceData: successfullyCreatedPsus,
		});
		return;
	},
);

// @desc   Update psus bulk
// @route  PATCH /api/v1/product-category/psu/dev
// @access Private/Admin/Manager
const updatePsusBulkHandler = expressAsyncHandler(
	async (
		request: UpdatePsusBulkRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		const { psuFields } = request.body;

		const updatedPsus = await Promise.all(
			psuFields.map(async (psuField) => {
				const {
					psuId,
					documentUpdate: { fields, updateOperator },
				} = psuField;

				const updatedPsu = await updatePsuByIdService({
					_id: psuId,
					fields,
					updateOperator,
				});

				return updatedPsu;
			}),
		);

		// filter out any psus that were not updated
		const successfullyUpdatedPsus = updatedPsus.filter(
			removeUndefinedAndNullValues,
		);

		// check if any psus were updated
		if (successfullyUpdatedPsus.length === psuFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedPsus.length} psus`,
				resourceData: successfullyUpdatedPsus,
			});
			return;
		}

		if (successfullyUpdatedPsus.length === 0) {
			response.status(400).json({
				message: "Could not update any psus",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				psuFields.length - successfullyUpdatedPsus.length
			} psus`,
			resourceData: successfullyUpdatedPsus,
		});
		return;
	},
);

// @desc   Get all psus
// @route  GET /api/v1/product-category/psu
// @access Private/Admin/Manager
const getQueriedPsusHandler = expressAsyncHandler(
	async (
		request: GetQueriedPsusRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				PsuDocument & {
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
			totalDocuments = await getQueriedTotalPsusService({
				filter: filter as FilterQuery<PsuDocument> | undefined,
			});
		}

		// get all psus
		const psus = await getQueriedPsusService({
			filter: filter as FilterQuery<PsuDocument> | undefined,
			projection: projection as QueryOptions<PsuDocument>,
			options: options as QueryOptions<PsuDocument>,
		});
		if (psus.length === 0) {
			response.status(200).json({
				message: "No psus that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the psus
		const fileUploadsArrArr = await Promise.all(
			psus.map(async (psu) => {
				const fileUploadPromises = psu.uploadedFilesIds.map(
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

		// find all reviews associated with the psus
		const reviewsArrArr = await Promise.all(
			psus.map(async (psu) => {
				const reviewPromises = psu.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create psuServerResponse array
		const psuServerResponseArray = psus.map((psu, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...psu,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved psus",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: psuServerResponseArray,
		});
	},
);

// @desc   Get psu by id
// @route  GET /api/v1/product-category/psu/:psuId
// @access Private/Admin/Manager
const getPsuByIdHandler = expressAsyncHandler(
	async (
		request: GetPsuByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				PsuDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const psuId = request.params.psuId;

		// get psu by id
		const psu = await getPsuByIdService(psuId);
		if (!psu) {
			response.status(404).json({ message: "Psu not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the psu
		const fileUploads = await Promise.all(
			psu.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the psu
		const productReviews = await Promise.all(
			psu.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create psuServerResponse
		const psuServerResponse = {
			...psu,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved psu",
			resourceData: [psuServerResponse],
		});
	},
);

// @desc   Update a psu by id
// @route  PUT /api/v1/product-category/psu/:psuId
// @access Private/Admin/Manager
const updatePsuByIdHandler = expressAsyncHandler(
	async (
		request: UpdatePsuByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				PsuDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { psuId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update psu
		const updatedPsu = await updatePsuByIdService({
			_id: psuId,
			fields,
			updateOperator,
		});

		if (!updatedPsu) {
			response.status(400).json({
				message: "Psu could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the psu
		const fileUploads = await Promise.all(
			updatedPsu.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the psu
		const productReviews = await Promise.all(
			updatedPsu.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create psuServerResponse
		const psuServerResponse = {
			...updatedPsu,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Psu updated successfully",
			resourceData: [psuServerResponse],
		});
	},
);

// @desc   Delete all psus
// @route  DELETE /api/v1/product-category/psu
// @access Private/Admin/Manager
const deleteAllPsusHandler = expressAsyncHandler(
	async (
		_request: DeleteAllPsusRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		// grab all psus file upload ids
		const uploadedFilesIds = await returnAllPsusUploadedFileIdsService();

		// delete all file uploads associated with all psus
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

		// delete all reviews associated with all psus
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

		// delete all psus
		const deletePsusResult: DeleteResult = await deleteAllPsusService();

		if (deletePsusResult.deletedCount === 0) {
			response.status(400).json({
				message: "All psus could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All psus deleted", resourceData: [] });
	},
);

// @desc   Delete a psu by id
// @route  DELETE /api/v1/product-category/psu/:psuId
// @access Private/Admin/Manager
const deleteAPsuHandler = expressAsyncHandler(
	async (
		request: DeleteAPsuRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		const psuId = request.params.psuId;

		// check if psu exists
		const psuExists = await getPsuByIdService(psuId);
		if (!psuExists) {
			response
				.status(404)
				.json({ message: "Psu does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this psu
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...psuExists.uploadedFilesIds];

		// delete all file uploads associated with all psus
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

		// delete all reviews associated with all psus
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

		// delete psu by id
		const deletePsuResult: DeleteResult = await deleteAPsuService(psuId);

		if (deletePsuResult.deletedCount === 0) {
			response.status(400).json({
				message: "Psu could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Psu deleted", resourceData: [] });
	},
);

export {
	createNewPsuBulkHandler,
	createNewPsuHandler,
	deleteAPsuHandler,
	deleteAllPsusHandler,
	getPsuByIdHandler,
	getQueriedPsusHandler,
	updatePsuByIdHandler,
	updatePsusBulkHandler,
};
