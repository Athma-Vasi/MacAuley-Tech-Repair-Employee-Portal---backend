import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewGpuBulkRequest,
	CreateNewGpuRequest,
	DeleteAGpuRequest,
	DeleteAllGpusRequest,
	GetGpuByIdRequest,
	GetQueriedGpusRequest,
	UpdateGpuByIdRequest,
} from "./gpu.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { GpuDocument, GpuSchema } from "./gpu.model";

import {
	createNewGpuService,
	deleteAGpuService,
	deleteAllGpusService,
	getGpuByIdService,
	getQueriedGpusService,
	getQueriedTotalGpusService,
	returnAllGpusUploadedFileIdsService,
	updateGpuByIdService,
} from "./gpu.service";
import {
	FileUploadDocument,
	deleteFileUploadByIdService,
	getFileUploadByIdService,
} from "../../fileUpload";
import { ProductServerResponse } from "../product.types";

// @desc   Create new gpu
// @route  POST /api/v1/actions/dashboard/product-category/gpu
// @access Private/Admin/Manager
const createNewGpuHandler = expressAsyncHandler(
	async (
		request: CreateNewGpuRequest,
		response: Response<ResourceRequestServerResponse<GpuDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			gpuFields,
		} = request.body;

		const gpuSchema: GpuSchema = {
			userId,
			username,
			...gpuFields,
		};

		const gpuDocument: GpuDocument = await createNewGpuService(gpuSchema);

		if (!gpuDocument) {
			response.status(400).json({
				message: "Could not create new gpu",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${gpuDocument.model} gpu`,
			resourceData: [gpuDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new gpus bulk
// @route  POST /api/v1/actions/dashboard/product-category/gpu/dev
// @access Private/Admin/Manager
const createNewGpuBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewGpuBulkRequest,
		response: Response<ResourceRequestServerResponse<GpuDocument>>,
	) => {
		const { gpuSchemas } = request.body;

		const newGpus = await Promise.all(
			gpuSchemas.map(async (gpuSchema) => {
				const newGpu = await createNewGpuService(gpuSchema);
				return newGpu;
			}),
		);

		// filter out any gpus that were not created
		const successfullyCreatedGpus = newGpus.filter((gpu) => gpu);

		// check if any gpus were created
		if (successfullyCreatedGpus.length === gpuSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedGpus.length} gpus`,
				resourceData: successfullyCreatedGpus,
			});
			return;
		} else if (successfullyCreatedGpus.length === 0) {
			response.status(400).json({
				message: "Could not create any gpus",
				resourceData: [],
			});
			return;
		} else {
			response.status(201).json({
				message: `Successfully created ${
					gpuSchemas.length - successfullyCreatedGpus.length
				} gpus`,
				resourceData: successfullyCreatedGpus,
			});
			return;
		}
	},
);

// @desc   Get all gpus
// @route  GET /api/v1/actions/dashboard/product-category/gpu
// @access Private/Admin/Manager
const getQueriedGpusHandler = expressAsyncHandler(
	async (
		request: GetQueriedGpusRequest,
		response: Response<GetQueriedResourceRequestServerResponse<GpuDocument>>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalGpusService({
				filter: filter as FilterQuery<GpuDocument> | undefined,
			});
		}

		// get all gpus
		const gpus = await getQueriedGpusService({
			filter: filter as FilterQuery<GpuDocument> | undefined,
			projection: projection as QueryOptions<GpuDocument>,
			options: options as QueryOptions<GpuDocument>,
		});
		if (gpus.length === 0) {
			response.status(200).json({
				message: "No gpus that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the gpus (in parallel)
		const fileUploadsArrArr = await Promise.all(
			gpus.map(async (gpu) => {
				const fileUploadPromises = gpu.uploadedFilesIds.map(
					async (uploadedFileId) => {
						const fileUpload = await getFileUploadByIdService(uploadedFileId);

						return fileUpload;
					},
				);

				// Wait for all the promises to resolve before continuing to the next iteration
				const fileUploads = await Promise.all(fileUploadPromises);

				// Filter out any undefined values (in case fileUpload was not found)
				return fileUploads.filter((fileUpload) => fileUpload);
			}),
		);

		// create gpuServerResponse array
		const gpuServerResponseArray = gpus
			.map((gpu, index) => {
				const fileUploads = fileUploadsArrArr[index];
				return {
					...gpu,
					fileUploads,
				};
			})
			.filter((gpu) => gpu);

		response.status(200).json({
			message: "Successfully retrieved gpus",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: gpuServerResponseArray as GpuDocument[],
		});
	},
);

// @desc   Get gpu by id
// @route  GET /api/v1/actions/dashboard/product-category/gpu/:gpuId
// @access Private/Admin/Manager
const getGpuByIdHandler = expressAsyncHandler(
	async (
		request: GetGpuByIdRequest,
		response: Response<ResourceRequestServerResponse<GpuDocument>>,
	) => {
		const gpuId = request.params.gpuId;

		// get gpu by id
		const gpu = await getGpuByIdService(gpuId);
		if (!gpu) {
			response.status(404).json({ message: "Gpu not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the gpu
		const fileUploadsArr = await Promise.all(
			gpu.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload as FileUploadDocument;
			}),
		);

		// create gpuServerResponse
		const gpuServerResponse: ProductServerResponse<GpuDocument> = {
			...gpu,
			fileUploads: fileUploadsArr.filter(
				(fileUpload) => fileUpload,
			) as FileUploadDocument[],
		};

		response.status(200).json({
			message: "Successfully retrieved gpu",
			resourceData: [gpuServerResponse],
		});
	},
);

// @desc   Update a gpu by id
// @route  PUT /api/v1/actions/dashboard/product-category/gpu/:gpuId
// @access Private/Admin/Manager
const updateGpuByIdHandler = expressAsyncHandler(
	async (
		request: UpdateGpuByIdRequest,
		response: Response<ResourceRequestServerResponse<GpuDocument>>,
	) => {
		const { gpuId } = request.params;
		const { gpuFields } = request.body;

		// check if gpu exists
		const gpuExists = await getGpuByIdService(gpuId);
		if (!gpuExists) {
			response
				.status(404)
				.json({ message: "Gpu does not exist", resourceData: [] });
			return;
		}

		const newGpu = {
			...gpuExists,
			...gpuFields,
		};

		// update gpu
		const updatedGpu = await updateGpuByIdService({
			gpuId,
			fieldsToUpdate: newGpu,
		});

		if (!updatedGpu) {
			response.status(400).json({
				message: "Gpu could not be updated",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Gpu updated successfully",
			resourceData: [updatedGpu],
		});
	},
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/gpu/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForGpusHandler = expressAsyncHandler(
	async (
		_request: GetGpuByIdRequest,
		response: Response<ResourceRequestServerResponse<FileUploadDocument>>,
	) => {
		const fileUploadsIds = await returnAllGpusUploadedFileIdsService();

		if (fileUploadsIds.length === 0) {
			response
				.status(404)
				.json({ message: "No file uploads found", resourceData: [] });
			return;
		}

		const fileUploads = (await Promise.all(
			fileUploadsIds.map(async (fileUploadId) => {
				const fileUpload = await getFileUploadByIdService(fileUploadId);

				return fileUpload;
			}),
		)) as FileUploadDocument[];

		// filter out any undefined values (in case fileUpload was not found)
		const filteredFileUploads = fileUploads.filter((fileUpload) => fileUpload);

		if (filteredFileUploads.length !== fileUploadsIds.length) {
			response.status(404).json({
				message: "Some file uploads could not be found.",
				resourceData: filteredFileUploads,
			});
			return;
		}

		response.status(200).json({
			message: "Successfully retrieved file uploads",
			resourceData: filteredFileUploads,
		});
	},
);

// @desc   Delete all gpus
// @route  DELETE /api/v1/actions/dashboard/product-category/gpu
// @access Private/Admin/Manager
const deleteAllGpusHandler = expressAsyncHandler(
	async (
		_request: DeleteAllGpusRequest,
		response: Response<ResourceRequestServerResponse<GpuDocument>>,
	) => {
		// grab all gpus file upload ids
		const fileUploadsIds = await returnAllGpusUploadedFileIdsService();

		// delete all file uploads associated with all gpus
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			fileUploadsIds.map(async (fileUploadId) =>
				deleteFileUploadByIdService(fileUploadId),
			),
		);
		if (!deleteFileUploadsResult.every((result) => result.deletedCount !== 0)) {
			response.status(400).json({
				message: "Some file uploads could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete all gpus
		const deleteGpusResult: DeleteResult = await deleteAllGpusService();

		if (deleteGpusResult.deletedCount === 0) {
			response.status(400).json({
				message: "All gpus could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All gpus deleted", resourceData: [] });
	},
);

// @desc   Delete a gpu by id
// @route  DELETE /api/v1/actions/dashboard/product-category/gpu/:gpuId
// @access Private/Admin/Manager
const deleteAGpuHandler = expressAsyncHandler(
	async (
		request: DeleteAGpuRequest,
		response: Response<ResourceRequestServerResponse<GpuDocument>>,
	) => {
		const gpuId = request.params.gpuId;

		// check if gpu exists
		const gpuExists = await getGpuByIdService(gpuId);
		if (!gpuExists) {
			response
				.status(404)
				.json({ message: "Gpu does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this gpu
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...gpuExists.uploadedFilesIds];

		// delete all file uploads associated with this gpu
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			uploadedFilesIds.map(async (uploadedFileId) =>
				deleteFileUploadByIdService(uploadedFileId),
			),
		);

		if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
			response.status(400).json({
				message:
					"Some file uploads associated with this gpu could not be deleted. Gpu not deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete gpu by id
		const deleteGpuResult: DeleteResult = await deleteAGpuService(gpuId);

		if (deleteGpuResult.deletedCount === 0) {
			response.status(400).json({
				message: "Gpu could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Gpu deleted", resourceData: [] });
	},
);

export {
	createNewGpuBulkHandler,
	createNewGpuHandler,
	deleteAGpuHandler,
	deleteAllGpusHandler,
	getGpuByIdHandler,
	getQueriedGpusHandler,
	returnAllFileUploadsForGpusHandler,
	updateGpuByIdHandler,
};
