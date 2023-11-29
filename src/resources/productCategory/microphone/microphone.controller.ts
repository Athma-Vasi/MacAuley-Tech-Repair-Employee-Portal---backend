import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewMicrophoneBulkRequest,
	CreateNewMicrophoneRequest,
	DeleteAMicrophoneRequest,
	DeleteAllMicrophonesRequest,
	GetMicrophoneByIdRequest,
	GetQueriedMicrophonesRequest,
	UpdateMicrophoneByIdRequest,
} from "./microphone.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { MicrophoneDocument, MicrophoneSchema } from "./microphone.model";

import {
	createNewMicrophoneService,
	deleteAMicrophoneService,
	deleteAllMicrophonesService,
	getMicrophoneByIdService,
	getQueriedMicrophonesService,
	getQueriedTotalMicrophonesService,
	returnAllMicrophonesUploadedFileIdsService,
	updateMicrophoneByIdService,
} from "./microphone.service";
import {
	FileUploadDocument,
	deleteFileUploadByIdService,
	getFileUploadByIdService,
} from "../../fileUpload";
import { ProductServerResponse } from "../product.types";

// @desc   Create new microphone
// @route  POST /api/v1/actions/dashboard/product-category/microphone
// @access Private/Admin/Manager
const createNewMicrophoneHandler = expressAsyncHandler(
	async (
		request: CreateNewMicrophoneRequest,
		response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			microphoneFields,
		} = request.body;

		const microphoneSchema: MicrophoneSchema = {
			userId,
			username,
			...microphoneFields,
		};

		const microphoneDocument: MicrophoneDocument =
			await createNewMicrophoneService(microphoneSchema);

		if (!microphoneDocument) {
			response.status(400).json({
				message: "Could not create new microphone",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${microphoneDocument.model} microphone`,
			resourceData: [microphoneDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new microphones bulk
// @route  POST /api/v1/actions/dashboard/product-category/microphone/dev
// @access Private/Admin/Manager
const createNewMicrophoneBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewMicrophoneBulkRequest,
		response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
	) => {
		const { microphoneSchemas } = request.body;

		const newMicrophones = await Promise.all(
			microphoneSchemas.map(async (microphoneSchema) => {
				const newMicrophone =
					await createNewMicrophoneService(microphoneSchema);
				return newMicrophone;
			}),
		);

		// filter out any microphones that were not created
		const successfullyCreatedMicrophones = newMicrophones.filter(
			(microphone) => microphone,
		);

		// check if any microphones were created
		if (successfullyCreatedMicrophones.length === microphoneSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedMicrophones.length} microphones`,
				resourceData: successfullyCreatedMicrophones,
			});
			return;
		} else if (successfullyCreatedMicrophones.length === 0) {
			response.status(400).json({
				message: "Could not create any microphones",
				resourceData: [],
			});
			return;
		} else {
			response.status(201).json({
				message: `Successfully created ${
					microphoneSchemas.length - successfullyCreatedMicrophones.length
				} microphones`,
				resourceData: successfullyCreatedMicrophones,
			});
			return;
		}
	},
);

// @desc   Get all microphones
// @route  GET /api/v1/actions/dashboard/product-category/microphone
// @access Private/Admin/Manager
const getQueriedMicrophonesHandler = expressAsyncHandler(
	async (
		request: GetQueriedMicrophonesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<MicrophoneDocument>
		>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalMicrophonesService({
				filter: filter as FilterQuery<MicrophoneDocument> | undefined,
			});
		}

		// get all microphones
		const microphones = await getQueriedMicrophonesService({
			filter: filter as FilterQuery<MicrophoneDocument> | undefined,
			projection: projection as QueryOptions<MicrophoneDocument>,
			options: options as QueryOptions<MicrophoneDocument>,
		});
		if (microphones.length === 0) {
			response.status(200).json({
				message: "No microphones that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the microphones (in parallel)
		const fileUploadsArrArr = await Promise.all(
			microphones.map(async (microphone) => {
				const fileUploadPromises = microphone.uploadedFilesIds.map(
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

		// create microphoneServerResponse array
		const microphoneServerResponseArray = microphones
			.map((microphone, index) => {
				const fileUploads = fileUploadsArrArr[index];
				return {
					...microphone,
					fileUploads,
				};
			})
			.filter((microphone) => microphone);

		response.status(200).json({
			message: "Successfully retrieved microphones",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: microphoneServerResponseArray as MicrophoneDocument[],
		});
	},
);

// @desc   Get microphone by id
// @route  GET /api/v1/actions/dashboard/product-category/microphone/:microphoneId
// @access Private/Admin/Manager
const getMicrophoneByIdHandler = expressAsyncHandler(
	async (
		request: GetMicrophoneByIdRequest,
		response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
	) => {
		const microphoneId = request.params.microphoneId;

		// get microphone by id
		const microphone = await getMicrophoneByIdService(microphoneId);
		if (!microphone) {
			response
				.status(404)
				.json({ message: "Microphone not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the microphone
		const fileUploadsArr = await Promise.all(
			microphone.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload as FileUploadDocument;
			}),
		);

		// create microphoneServerResponse
		const microphoneServerResponse: ProductServerResponse<MicrophoneDocument> =
			{
				...microphone,
				fileUploads: fileUploadsArr.filter(
					(fileUpload) => fileUpload,
				) as FileUploadDocument[],
			};

		response.status(200).json({
			message: "Successfully retrieved microphone",
			resourceData: [microphoneServerResponse],
		});
	},
);

// @desc   Update a microphone by id
// @route  PUT /api/v1/actions/dashboard/product-category/microphone/:microphoneId
// @access Private/Admin/Manager
const updateMicrophoneByIdHandler = expressAsyncHandler(
	async (
		request: UpdateMicrophoneByIdRequest,
		response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
	) => {
		const { microphoneId } = request.params;
		const { microphoneFields } = request.body;

		// check if microphone exists
		const microphoneExists = await getMicrophoneByIdService(microphoneId);
		if (!microphoneExists) {
			response
				.status(404)
				.json({ message: "Microphone does not exist", resourceData: [] });
			return;
		}

		const newMicrophone = {
			...microphoneExists,
			...microphoneFields,
		};

		// update microphone
		const updatedMicrophone = await updateMicrophoneByIdService({
			microphoneId,
			fieldsToUpdate: newMicrophone,
		});

		if (!updatedMicrophone) {
			response.status(400).json({
				message: "Microphone could not be updated",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Microphone updated successfully",
			resourceData: [updatedMicrophone],
		});
	},
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/microphone/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForMicrophonesHandler = expressAsyncHandler(
	async (
		_request: GetMicrophoneByIdRequest,
		response: Response<ResourceRequestServerResponse<FileUploadDocument>>,
	) => {
		const fileUploadsIds = await returnAllMicrophonesUploadedFileIdsService();

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

// @desc   Delete all microphones
// @route  DELETE /api/v1/actions/dashboard/product-category/microphone
// @access Private/Admin/Manager
const deleteAllMicrophonesHandler = expressAsyncHandler(
	async (
		_request: DeleteAllMicrophonesRequest,
		response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
	) => {
		// grab all microphones file upload ids
		const fileUploadsIds = await returnAllMicrophonesUploadedFileIdsService();

		// delete all file uploads associated with all microphones
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

		// delete all microphones
		const deleteMicrophonesResult: DeleteResult =
			await deleteAllMicrophonesService();

		if (deleteMicrophonesResult.deletedCount === 0) {
			response.status(400).json({
				message: "All microphones could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All microphones deleted", resourceData: [] });
	},
);

// @desc   Delete a microphone by id
// @route  DELETE /api/v1/actions/dashboard/product-category/microphone/:microphoneId
// @access Private/Admin/Manager
const deleteAMicrophoneHandler = expressAsyncHandler(
	async (
		request: DeleteAMicrophoneRequest,
		response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
	) => {
		const microphoneId = request.params.microphoneId;

		// check if microphone exists
		const microphoneExists = await getMicrophoneByIdService(microphoneId);
		if (!microphoneExists) {
			response
				.status(404)
				.json({ message: "Microphone does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this microphone
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...microphoneExists.uploadedFilesIds];

		// delete all file uploads associated with this microphone
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			uploadedFilesIds.map(async (uploadedFileId) =>
				deleteFileUploadByIdService(uploadedFileId),
			),
		);

		if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
			response.status(400).json({
				message:
					"Some file uploads associated with this microphone could not be deleted. Microphone not deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete microphone by id
		const deleteMicrophoneResult: DeleteResult =
			await deleteAMicrophoneService(microphoneId);

		if (deleteMicrophoneResult.deletedCount === 0) {
			response.status(400).json({
				message: "Microphone could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "Microphone deleted", resourceData: [] });
	},
);

export {
	createNewMicrophoneBulkHandler,
	createNewMicrophoneHandler,
	deleteAMicrophoneHandler,
	deleteAllMicrophonesHandler,
	getMicrophoneByIdHandler,
	getQueriedMicrophonesHandler,
	returnAllFileUploadsForMicrophonesHandler,
	updateMicrophoneByIdHandler,
};
