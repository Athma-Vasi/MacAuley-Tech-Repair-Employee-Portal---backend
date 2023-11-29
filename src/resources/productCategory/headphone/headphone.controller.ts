import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewHeadphoneBulkRequest,
	CreateNewHeadphoneRequest,
	DeleteAHeadphoneRequest,
	DeleteAllHeadphonesRequest,
	GetHeadphoneByIdRequest,
	GetQueriedHeadphonesRequest,
	UpdateHeadphoneByIdRequest,
} from "./headphone.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { HeadphoneDocument, HeadphoneSchema } from "./headphone.model";

import {
	createNewHeadphoneService,
	deleteAHeadphoneService,
	deleteAllHeadphonesService,
	getHeadphoneByIdService,
	getQueriedHeadphonesService,
	getQueriedTotalHeadphonesService,
	returnAllHeadphonesUploadedFileIdsService,
	updateHeadphoneByIdService,
} from "./headphone.service";
import {
	FileUploadDocument,
	deleteFileUploadByIdService,
	getFileUploadByIdService,
} from "../../fileUpload";
import { ProductServerResponse } from "../product.types";

// @desc   Create new headphone
// @route  POST /api/v1/actions/dashboard/product-category/headphone
// @access Private/Admin/Manager
const createNewHeadphoneHandler = expressAsyncHandler(
	async (
		request: CreateNewHeadphoneRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			headphoneFields,
		} = request.body;

		const headphoneSchema: HeadphoneSchema = {
			userId,
			username,
			...headphoneFields,
		};

		const headphoneDocument: HeadphoneDocument =
			await createNewHeadphoneService(headphoneSchema);

		if (!headphoneDocument) {
			response.status(400).json({
				message: "Could not create new headphone",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${headphoneDocument.model} headphone`,
			resourceData: [headphoneDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new headphones bulk
// @route  POST /api/v1/actions/dashboard/product-category/headphone/dev
// @access Private/Admin/Manager
const createNewHeadphoneBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewHeadphoneBulkRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const { headphoneSchemas } = request.body;

		const newHeadphones = await Promise.all(
			headphoneSchemas.map(async (headphoneSchema) => {
				const newHeadphone = await createNewHeadphoneService(headphoneSchema);
				return newHeadphone;
			}),
		);

		// filter out any headphones that were not created
		const successfullyCreatedHeadphones = newHeadphones.filter(
			(headphone) => headphone,
		);

		// check if any headphones were created
		if (successfullyCreatedHeadphones.length === headphoneSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedHeadphones.length} headphones`,
				resourceData: successfullyCreatedHeadphones,
			});
			return;
		} else if (successfullyCreatedHeadphones.length === 0) {
			response.status(400).json({
				message: "Could not create any headphones",
				resourceData: [],
			});
			return;
		} else {
			response.status(201).json({
				message: `Successfully created ${
					headphoneSchemas.length - successfullyCreatedHeadphones.length
				} headphones`,
				resourceData: successfullyCreatedHeadphones,
			});
			return;
		}
	},
);

// @desc   Get all headphones
// @route  GET /api/v1/actions/dashboard/product-category/headphone
// @access Private/Admin/Manager
const getQueriedHeadphonesHandler = expressAsyncHandler(
	async (
		request: GetQueriedHeadphonesRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<HeadphoneDocument>
		>,
	) => {
		let { newQueryFlag, totalDocuments } = request.body;

		const { filter, projection, options } =
			request.query as QueryObjectParsedWithDefaults;

		// only perform a countDocuments scan if a new query is being made
		if (newQueryFlag) {
			totalDocuments = await getQueriedTotalHeadphonesService({
				filter: filter as FilterQuery<HeadphoneDocument> | undefined,
			});
		}

		// get all headphones
		const headphones = await getQueriedHeadphonesService({
			filter: filter as FilterQuery<HeadphoneDocument> | undefined,
			projection: projection as QueryOptions<HeadphoneDocument>,
			options: options as QueryOptions<HeadphoneDocument>,
		});
		if (headphones.length === 0) {
			response.status(200).json({
				message: "No headphones that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the headphones (in parallel)
		const fileUploadsArrArr = await Promise.all(
			headphones.map(async (headphone) => {
				const fileUploadPromises = headphone.uploadedFilesIds.map(
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

		// create headphoneServerResponse array
		const headphoneServerResponseArray = headphones
			.map((headphone, index) => {
				const fileUploads = fileUploadsArrArr[index];
				return {
					...headphone,
					fileUploads,
				};
			})
			.filter((headphone) => headphone);

		response.status(200).json({
			message: "Successfully retrieved headphones",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: headphoneServerResponseArray as HeadphoneDocument[],
		});
	},
);

// @desc   Get headphone by id
// @route  GET /api/v1/actions/dashboard/product-category/headphone/:headphoneId
// @access Private/Admin/Manager
const getHeadphoneByIdHandler = expressAsyncHandler(
	async (
		request: GetHeadphoneByIdRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const headphoneId = request.params.headphoneId;

		// get headphone by id
		const headphone = await getHeadphoneByIdService(headphoneId);
		if (!headphone) {
			response
				.status(404)
				.json({ message: "Headphone not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the headphone
		const fileUploadsArr = await Promise.all(
			headphone.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload as FileUploadDocument;
			}),
		);

		// create headphoneServerResponse
		const headphoneServerResponse: ProductServerResponse<HeadphoneDocument> = {
			...headphone,
			fileUploads: fileUploadsArr.filter(
				(fileUpload) => fileUpload,
			) as FileUploadDocument[],
		};

		response.status(200).json({
			message: "Successfully retrieved headphone",
			resourceData: [headphoneServerResponse],
		});
	},
);

// @desc   Update a headphone by id
// @route  PUT /api/v1/actions/dashboard/product-category/headphone/:headphoneId
// @access Private/Admin/Manager
const updateHeadphoneByIdHandler = expressAsyncHandler(
	async (
		request: UpdateHeadphoneByIdRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const { headphoneId } = request.params;
		const { headphoneFields } = request.body;

		// check if headphone exists
		const headphoneExists = await getHeadphoneByIdService(headphoneId);
		if (!headphoneExists) {
			response
				.status(404)
				.json({ message: "Headphone does not exist", resourceData: [] });
			return;
		}

		const newHeadphone = {
			...headphoneExists,
			...headphoneFields,
		};

		// update headphone
		const updatedHeadphone = await updateHeadphoneByIdService({
			headphoneId,
			fieldsToUpdate: newHeadphone,
		});

		if (!updatedHeadphone) {
			response.status(400).json({
				message: "Headphone could not be updated",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({
			message: "Headphone updated successfully",
			resourceData: [updatedHeadphone],
		});
	},
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/headphone/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForHeadphonesHandler = expressAsyncHandler(
	async (
		_request: GetHeadphoneByIdRequest,
		response: Response<ResourceRequestServerResponse<FileUploadDocument>>,
	) => {
		const fileUploadsIds = await returnAllHeadphonesUploadedFileIdsService();

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

// @desc   Delete all headphones
// @route  DELETE /api/v1/actions/dashboard/product-category/headphone
// @access Private/Admin/Manager
const deleteAllHeadphonesHandler = expressAsyncHandler(
	async (
		_request: DeleteAllHeadphonesRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		// grab all headphones file upload ids
		const fileUploadsIds = await returnAllHeadphonesUploadedFileIdsService();

		// delete all file uploads associated with all headphones
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

		// delete all headphones
		const deleteHeadphonesResult: DeleteResult =
			await deleteAllHeadphonesService();

		if (deleteHeadphonesResult.deletedCount === 0) {
			response.status(400).json({
				message: "All headphones could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All headphones deleted", resourceData: [] });
	},
);

// @desc   Delete a headphone by id
// @route  DELETE /api/v1/actions/dashboard/product-category/headphone/:headphoneId
// @access Private/Admin/Manager
const deleteAHeadphoneHandler = expressAsyncHandler(
	async (
		request: DeleteAHeadphoneRequest,
		response: Response<ResourceRequestServerResponse<HeadphoneDocument>>,
	) => {
		const headphoneId = request.params.headphoneId;

		// check if headphone exists
		const headphoneExists = await getHeadphoneByIdService(headphoneId);
		if (!headphoneExists) {
			response
				.status(404)
				.json({ message: "Headphone does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this headphone
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...headphoneExists.uploadedFilesIds];

		// delete all file uploads associated with this headphone
		const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
			uploadedFilesIds.map(async (uploadedFileId) =>
				deleteFileUploadByIdService(uploadedFileId),
			),
		);

		if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
			response.status(400).json({
				message:
					"Some file uploads associated with this headphone could not be deleted. Headphone not deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		// delete headphone by id
		const deleteHeadphoneResult: DeleteResult =
			await deleteAHeadphoneService(headphoneId);

		if (deleteHeadphoneResult.deletedCount === 0) {
			response.status(400).json({
				message: "Headphone could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "Headphone deleted", resourceData: [] });
	},
);

export {
	createNewHeadphoneBulkHandler,
	createNewHeadphoneHandler,
	deleteAHeadphoneHandler,
	deleteAllHeadphonesHandler,
	getHeadphoneByIdHandler,
	getQueriedHeadphonesHandler,
	returnAllFileUploadsForHeadphonesHandler,
	updateHeadphoneByIdHandler,
};
