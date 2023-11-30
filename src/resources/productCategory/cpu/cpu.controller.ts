import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewCpuBulkRequest,
	CreateNewCpuRequest,
	DeleteACpuRequest,
	DeleteAllCpusRequest,
	GetCpuByIdRequest,
	GetQueriedCpusRequest,
	UpdateCpuByIdRequest,
	UpdateCpusBulkRequest,
} from "./cpu.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { CpuDocument, CpuSchema } from "./cpu.model";

import {
	createNewCpuService,
	deleteACpuService,
	deleteAllCpusService,
	getCpuByIdService,
	getQueriedCpusService,
	getQueriedTotalCpusService,
	returnAllCpusUploadedFileIdsService,
	updateCpuByIdService,
} from "./cpu.service";
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

// @desc   Create new cpu
// @route  POST /api/v1/product-category/cpu
// @access Private/Admin/Manager
const createNewCpuHandler = expressAsyncHandler(
	async (
		request: CreateNewCpuRequest,
		response: Response<ResourceRequestServerResponse<CpuDocument>>,
	) => {
		const { cpuSchema } = request.body;

		const cpuDocument: CpuDocument = await createNewCpuService(cpuSchema);

		if (!cpuDocument) {
			response.status(400).json({
				message: "Could not create new cpu",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${cpuDocument.model} cpu`,
			resourceData: [cpuDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new cpus bulk
// @route  POST /api/v1/product-category/cpu/dev
// @access Private/Admin/Manager
const createNewCpuBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewCpuBulkRequest,
		response: Response<ResourceRequestServerResponse<CpuDocument>>,
	) => {
		const { cpuSchemas } = request.body;

		const newCpus = await Promise.all(
			cpuSchemas.map(async (cpuSchema) => {
				const newCpu = await createNewCpuService(cpuSchema);
				return newCpu;
			}),
		);

		// filter out any cpus that were not created
		const successfullyCreatedCpus = newCpus.filter((cpu) => cpu);

		// check if any cpus were created
		if (successfullyCreatedCpus.length === cpuSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedCpus.length} cpus`,
				resourceData: successfullyCreatedCpus,
			});
			return;
		}

		if (successfullyCreatedCpus.length === 0) {
			response.status(400).json({
				message: "Could not create any cpus",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				cpuSchemas.length - successfullyCreatedCpus.length
			} cpus`,
			resourceData: successfullyCreatedCpus,
		});
		return;
	},
);

// @desc   Update cpus bulk
// @route  PATCH /api/v1/product-category/cpu/dev
// @access Private/Admin/Manager
const updateCpusBulkHandler = expressAsyncHandler(
	async (
		request: UpdateCpusBulkRequest,
		response: Response<ResourceRequestServerResponse<CpuDocument>>,
	) => {
		const { cpuFields } = request.body;

		const updatedCpus = await Promise.all(
			cpuFields.map(async (cpuField) => {
				const {
					documentId,
					documentUpdate: { fields, updateOperator },
				} = cpuField;

				const updatedCpu = await updateCpuByIdService({
					_id: documentId,
					fields,
					updateOperator,
				});

				return updatedCpu;
			}),
		);

		// filter out any cpus that were not updated
		const successfullyUpdatedCpus = updatedCpus.filter(
			removeUndefinedAndNullValues,
		);

		// check if any cpus were updated
		if (successfullyUpdatedCpus.length === cpuFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedCpus.length} cpus`,
				resourceData: successfullyUpdatedCpus,
			});
			return;
		}

		if (successfullyUpdatedCpus.length === 0) {
			response.status(400).json({
				message: "Could not update any cpus",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				cpuFields.length - successfullyUpdatedCpus.length
			} cpus`,
			resourceData: successfullyUpdatedCpus,
		});
		return;
	},
);

// @desc   Get all cpus
// @route  GET /api/v1/product-category/cpu
// @access Private/Admin/Manager
const getQueriedCpusHandler = expressAsyncHandler(
	async (
		request: GetQueriedCpusRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				CpuDocument & {
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
			totalDocuments = await getQueriedTotalCpusService({
				filter: filter as FilterQuery<CpuDocument> | undefined,
			});
		}

		// get all cpus
		const cpus = await getQueriedCpusService({
			filter: filter as FilterQuery<CpuDocument> | undefined,
			projection: projection as QueryOptions<CpuDocument>,
			options: options as QueryOptions<CpuDocument>,
		});
		if (cpus.length === 0) {
			response.status(200).json({
				message: "No cpus that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the cpus
		const fileUploadsArrArr = await Promise.all(
			cpus.map(async (cpu) => {
				const fileUploadPromises = cpu.uploadedFilesIds.map(
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

		// find all reviews associated with the cpus
		const reviewsArrArr = await Promise.all(
			cpus.map(async (cpu) => {
				const reviewPromises = cpu.productReviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create cpuServerResponse array
		const cpuServerResponseArray = cpus.map((cpu, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...cpu,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved cpus",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: cpuServerResponseArray,
		});
	},
);

// @desc   Get cpu by id
// @route  GET /api/v1/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const getCpuByIdHandler = expressAsyncHandler(
	async (
		request: GetCpuByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				CpuDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const cpuId = request.params.cpuId;

		// get cpu by id
		const cpu = await getCpuByIdService(cpuId);
		if (!cpu) {
			response.status(404).json({ message: "Cpu not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the cpu
		const fileUploads = await Promise.all(
			cpu.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the cpu
		const productReviews = await Promise.all(
			cpu.productReviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create cpuServerResponse
		const cpuServerResponse = {
			...cpu,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved cpu",
			resourceData: [cpuServerResponse],
		});
	},
);

// @desc   Update a cpu by id
// @route  PUT /api/v1/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const updateCpuByIdHandler = expressAsyncHandler(
	async (
		request: UpdateCpuByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				CpuDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { cpuId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update cpu
		const updatedCpu = await updateCpuByIdService({
			_id: cpuId,
			fields,
			updateOperator,
		});

		if (!updatedCpu) {
			response.status(400).json({
				message: "Cpu could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the cpu
		const fileUploads = await Promise.all(
			updatedCpu.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the cpu
		const productReviews = await Promise.all(
			updatedCpu.productReviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create cpuServerResponse
		const cpuServerResponse = {
			...updatedCpu,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Cpu updated successfully",
			resourceData: [cpuServerResponse],
		});
	},
);

// @desc   Delete all cpus
// @route  DELETE /api/v1/product-category/cpu
// @access Private/Admin/Manager
const deleteAllCpusHandler = expressAsyncHandler(
	async (
		_request: DeleteAllCpusRequest,
		response: Response<ResourceRequestServerResponse<CpuDocument>>,
	) => {
		// grab all cpus file upload ids
		const uploadedFilesIds = await returnAllCpusUploadedFileIdsService();

		// delete all file uploads associated with all cpus
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

		// delete all reviews associated with all cpus
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

		// delete all cpus
		const deleteCpusResult: DeleteResult = await deleteAllCpusService();

		if (deleteCpusResult.deletedCount === 0) {
			response.status(400).json({
				message: "All cpus could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All cpus deleted", resourceData: [] });
	},
);

// @desc   Delete a cpu by id
// @route  DELETE /api/v1/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const deleteACpuHandler = expressAsyncHandler(
	async (
		request: DeleteACpuRequest,
		response: Response<ResourceRequestServerResponse<CpuDocument>>,
	) => {
		const cpuId = request.params.cpuId;

		// check if cpu exists
		const cpuExists = await getCpuByIdService(cpuId);
		if (!cpuExists) {
			response
				.status(404)
				.json({ message: "Cpu does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this cpu
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...cpuExists.uploadedFilesIds];

		// delete all file uploads associated with all cpus
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

		// delete all reviews associated with all cpus
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

		// delete cpu by id
		const deleteCpuResult: DeleteResult = await deleteACpuService(cpuId);

		if (deleteCpuResult.deletedCount === 0) {
			response.status(400).json({
				message: "Cpu could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Cpu deleted", resourceData: [] });
	},
);

export {
	createNewCpuBulkHandler,
	createNewCpuHandler,
	deleteACpuHandler,
	deleteAllCpusHandler,
	getCpuByIdHandler,
	getQueriedCpusHandler,
	updateCpuByIdHandler,
	updateCpusBulkHandler,
};
