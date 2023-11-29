import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewRamBulkRequest,
	CreateNewRamRequest,
	DeleteARamRequest,
	DeleteAllRamsRequest,
	GetRamByIdRequest,
	GetQueriedRamsRequest,
	UpdateRamByIdRequest,
} from "./ram.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { RamDocument, RamSchema } from "./ram.model";

import {
	createNewRamService,
	deleteARamService,
	deleteAllRamsService,
	getRamByIdService,
	getQueriedRamsService,
	getQueriedTotalRamsService,
	returnAllRamsUploadedFileIdsService,
	updateRamByIdService,
} from "./ram.service";
import {
	FileUploadDocument,
	deleteFileUploadByIdService,
	getFileUploadByIdService,
} from "../../fileUpload";
import { ProductServerResponse } from "../product.types";

// @desc   Create new ram
// @route  POST /api/v1/actions/dashboard/product-category/ram
// @access Private/Admin/Manager
const createNewRamHandler = expressAsyncHandler(
	async (
		request: CreateNewRamRequest,
		response: Response<ResourceRequestServerResponse<RamDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			ramFields,
		} = request.body;

		const ramSchema: RamSchema = {
			userId,
			username,
			...ramFields,
		};

		const ramDocument: RamDocument = await createNewRamService(ramSchema);

		if (!ramDocument) {
			response.status(400).json({
				message: "Could not create new RAM",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${ramDocument.model} RAM`,
			resourceData: [ramDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new rams bulk
// @route  POST /api/v1/actions/dashboard/product-category/ram/dev
// @access Private/Admin/Manager
const createNewRamBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewRamBulkRequest,
		response: Response<ResourceRequestServerResponse<RamDocument>>,
	) => {
		const { ramSchemas } = request.body;

		const newRams = await Promise.all(
			ramSchemas.map(async (ramSchema) => {
				const newRam = await createNewRamService(ramSchema);
				return newRam;
			}),
		);

		// filter out any rams that were not created
		const successfullyCreatedRams = newRams.filter((ram) => ram);

		// check if any rams were created
		if (successfullyCreatedRams.length === ramSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedRams.length} rams`,
				resourceData: successfullyCreatedRams,
			});
			return;
		} else if (successfullyCreatedRams.length === 0) {
			response.status(400).json({
				message: "Could not create any RAMs",
				resourceData: [],
			});
			return;
		} else {
			response.status(201).json({
				message: `Successfully created ${
					ramSchemas.length - successfullyCreatedRams.length
				} rams`,
				resourceData: successfullyCreatedRams,
			});
			return;
		}
	},
);

// @desc   Get all rams
// @route  GET /api/v1/actions/dashboard/product-category/ram
// @access Private/Admin/Manager
const getQueriedRamsHandler = expressAsyncHandler(
	async (
		request: GetQueriedRamsRequest,
		response: Response<GetQueriedResourceRequestServerResponse<RamDocument>>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalRamsService({
				filter: filter as FilterQuery<RamDocument> | undefined,
			});
		}

		// get all rams
		const rams = await getQueriedRamsService({
			filter: filter as FilterQuery<RamDocument> | undefined,
			projection: projection as QueryOptions<RamDocument>,
			options: options as QueryOptions<RamDocument>,
		});
		if (rams.length === 0) {
			response.status(200).json({
				message: "No RAMs that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the rams (in parallel)
		const fileUploadsArrArr = await Promise.all(
			rams.map(async (ram) => {
				const fileUploadPromises = ram.uploadedFilesIds.map(
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

		// create ramServerResponse array
		const ramServerResponseArray = rams
			.map((ram, index) => {
				const fileUploads = fileUploadsArrArr[index];
				return {
					...ram,
					fileUploads,
				};
			})
			.filter((ram) => ram);

		response.status(200).json({
			message: "Successfully retrieved RAMs",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: ramServerResponseArray as RamDocument[],
		});
	},
);

// @desc   Get ram by id
// @route  GET /api/v1/actions/dashboard/product-category/ram/:ramId
// @access Private/Admin/Manager
const getRamByIdHandler = expressAsyncHandler(
	async (
		request: GetRamByIdRequest,
		response: Response<ResourceRequestServerResponse<RamDocument>>,
	) => {
		const ramId = request.params.ramId;

		// get ram by id
		const ram = await getRamByIdService(ramId);
		if (!ram) {
			response.status(404).json({ message: "RAM not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the ram
		const fileUploadsArr = await Promise.all(
			ram.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload as FileUploadDocument;
			}),
		);

		// create ramServerResponse
		const ramServerResponse: ProductServerResponse<RamDocument> = {
			...ram,
			fileUploads: fileUploadsArr.filter(
				(fileUpload) => fileUpload,
			) as FileUploadDocument[],
		};

		response.status(200).json({
			message: "Successfully retrieved RAM",
			resourceData: [ramServerResponse],
		});
	},
);

// @desc   Update a ram by id
// @route  PUT /api/v1/actions/dashboard/product-category/ram/:ramId
// @access Private/Admin/Manager
const updateRamByIdHandler = expressAsyncHandler(
	async (
		request: UpdateRamByIdRequest,
		response: Response<ResourceRequestServerResponse<RamDocument>>,
	) => {
		const { ramId } = request.params;
		const { ramFields } = request.body;

		// check if ram exists
		const ramExists = await getRamByIdService(ramId);
		if (!ramExists) {
			response
				.status(404)
				.json({ message: "RAM does not exist", resourceData: [] });
			return;
		}

		const newRam = {
			...ramExists,
			...ramFields,
		};

		// update ram
		const updatedRam = await updateRamByIdService({
			ramId,
			fieldsToUpdate: newRam,
		});

		if (!updatedRam) {
			response.status(400).json({
				message: "RAM could not be updated",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "RAM updated successfully",
			resourceData: [updatedRam],
		});
	},
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/ram/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForRamsHandler = expressAsyncHandler(
	async (
		_request: GetRamByIdRequest,
		response: Response<ResourceRequestServerResponse<FileUploadDocument>>,
	) => {
		const fileUploadsIds = await returnAllRamsUploadedFileIdsService();

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

// @desc   Delete all rams
// @route  DELETE /api/v1/actions/dashboard/product-category/ram
// @access Private/Admin/Manager
const deleteAllRamsHandler = expressAsyncHandler(
	async (
		_request: DeleteAllRamsRequest,
		response: Response<ResourceRequestServerResponse<RamDocument>>,
	) => {
		// grab all rams file upload ids
		const fileUploadsIds = await returnAllRamsUploadedFileIdsService();

		// delete all file uploads associated with all rams
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

		// delete all rams
		const deleteRamsResult: DeleteResult = await deleteAllRamsService();

		if (deleteRamsResult.deletedCount === 0) {
			response.status(400).json({
				message: "All RAMs could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All RAMs deleted", resourceData: [] });
	},
);

// @desc   Delete a ram by id
// @route  DELETE /api/v1/actions/dashboard/product-category/ram/:ramId
// @access Private/Admin/Manager
const deleteARamHandler = expressAsyncHandler(
	async (
		request: DeleteARamRequest,
		response: Response<ResourceRequestServerResponse<RamDocument>>,
	) => {
		const ramId = request.params.ramId;

		// check if ram exists
		const ramExists = await getRamByIdService(ramId);
		if (!ramExists) {
			response
				.status(404)
				.json({ message: "RAM does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this ram
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...ramExists.uploadedFilesIds];

		// delete all file uploads associated with this ram
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			uploadedFilesIds.map(async (uploadedFileId) =>
				deleteFileUploadByIdService(uploadedFileId),
			),
		);

		if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
			response.status(400).json({
				message:
					"Some file uploads associated with this ram could not be deleted. RAM not deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete ram by id
		const deleteRamResult: DeleteResult = await deleteARamService(ramId);

		if (deleteRamResult.deletedCount === 0) {
			response.status(400).json({
				message: "RAM could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "RAM deleted", resourceData: [] });
	},
);

export {
	createNewRamBulkHandler,
	createNewRamHandler,
	deleteARamHandler,
	deleteAllRamsHandler,
	getRamByIdHandler,
	getQueriedRamsHandler,
	returnAllFileUploadsForRamsHandler,
	updateRamByIdHandler,
};
