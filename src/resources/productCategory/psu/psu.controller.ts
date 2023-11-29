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
import { ProductServerResponse } from "../product.types";

// @desc   Create new psu
// @route  POST /api/v1/actions/dashboard/product-category/psu
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
// @route  POST /api/v1/actions/dashboard/product-category/psu/dev
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
		} else if (successfullyCreatedPsus.length === 0) {
			response.status(400).json({
				message: "Could not create any psus",
				resourceData: [],
			});
			return;
		} else {
			response.status(201).json({
				message: `Successfully created ${
					psuSchemas.length - successfullyCreatedPsus.length
				} psus`,
				resourceData: successfullyCreatedPsus,
			});
			return;
		}
	},
);

// @desc   Get all psus
// @route  GET /api/v1/actions/dashboard/product-category/psu
// @access Private/Admin/Manager
const getQueriedPsusHandler = expressAsyncHandler(
	async (
		request: GetQueriedPsusRequest,
		response: Response<GetQueriedResourceRequestServerResponse<PsuDocument>>,
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

		// find all fileUploads associated with the psus (in parallel)
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
				return fileUploads.filter((fileUpload) => fileUpload);
			}),
		);

		// create psuServerResponse array
		const psuServerResponseArray = psus
			.map((psu, index) => {
				const fileUploads = fileUploadsArrArr[index];
				return {
					...psu,
					fileUploads,
				};
			})
			.filter((psu) => psu);

		response.status(200).json({
			message: "Successfully retrieved psus",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: psuServerResponseArray as PsuDocument[],
		});
	},
);

// @desc   Get psu by id
// @route  GET /api/v1/actions/dashboard/product-category/psu/:psuId
// @access Private/Admin/Manager
const getPsuByIdHandler = expressAsyncHandler(
	async (
		request: GetPsuByIdRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		const psuId = request.params.psuId;

		// get psu by id
		const psu = await getPsuByIdService(psuId);
		if (!psu) {
			response.status(404).json({ message: "Psu not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the psu
		const fileUploadsArr = await Promise.all(
			psu.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload as FileUploadDocument;
			}),
		);

		// create psuServerResponse
		const psuServerResponse: ProductServerResponse<PsuDocument> = {
			...psu,
			fileUploads: fileUploadsArr.filter(
				(fileUpload) => fileUpload,
			) as FileUploadDocument[],
		};

		response.status(200).json({
			message: "Successfully retrieved psu",
			resourceData: [psuServerResponse],
		});
	},
);

// @desc   Update a psu by id
// @route  PUT /api/v1/actions/dashboard/product-category/psu/:psuId
// @access Private/Admin/Manager
const updatePsuByIdHandler = expressAsyncHandler(
	async (
		request: UpdatePsuByIdRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		const { psuId } = request.params;
		const { psuFields } = request.body;

		// check if psu exists
		const psuExists = await getPsuByIdService(psuId);
		if (!psuExists) {
			response
				.status(404)
				.json({ message: "Psu does not exist", resourceData: [] });
			return;
		}

		const newPsu = {
			...psuExists,
			...psuFields,
		};

		// update psu
		const updatedPsu = await updatePsuByIdService({
			psuId,
			fieldsToUpdate: newPsu,
		});

		if (!updatedPsu) {
			response.status(400).json({
				message: "Psu could not be updated",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Psu updated successfully",
			resourceData: [updatedPsu],
		});
	},
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/psu/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForPsusHandler = expressAsyncHandler(
	async (
		_request: GetPsuByIdRequest,
		response: Response<ResourceRequestServerResponse<FileUploadDocument>>,
	) => {
		const fileUploadsIds = await returnAllPsusUploadedFileIdsService();

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

// @desc   Delete all psus
// @route  DELETE /api/v1/actions/dashboard/product-category/psu
// @access Private/Admin/Manager
const deleteAllPsusHandler = expressAsyncHandler(
	async (
		_request: DeleteAllPsusRequest,
		response: Response<ResourceRequestServerResponse<PsuDocument>>,
	) => {
		// grab all psus file upload ids
		const fileUploadsIds = await returnAllPsusUploadedFileIdsService();

		// delete all file uploads associated with all psus
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
// @route  DELETE /api/v1/actions/dashboard/product-category/psu/:psuId
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

		// delete all file uploads associated with this psu
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			uploadedFilesIds.map(async (uploadedFileId) =>
				deleteFileUploadByIdService(uploadedFileId),
			),
		);

		if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
			response.status(400).json({
				message:
					"Some file uploads associated with this psu could not be deleted. Psu not deleted. Please try again.",
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
	returnAllFileUploadsForPsusHandler,
	updatePsuByIdHandler,
};
