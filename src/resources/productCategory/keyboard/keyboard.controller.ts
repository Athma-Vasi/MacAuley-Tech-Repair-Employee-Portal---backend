import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewKeyboardBulkRequest,
	CreateNewKeyboardRequest,
	DeleteAKeyboardRequest,
	DeleteAllKeyboardsRequest,
	GetKeyboardByIdRequest,
	GetQueriedKeyboardsRequest,
	UpdateKeyboardByIdRequest,
	UpdateKeyboardsBulkRequest,
} from "./keyboard.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { KeyboardDocument, KeyboardSchema } from "./keyboard.model";

import {
	createNewKeyboardService,
	deleteAKeyboardService,
	deleteAllKeyboardsService,
	getKeyboardByIdService,
	getQueriedKeyboardsService,
	getQueriedTotalKeyboardsService,
	returnAllKeyboardsUploadedFileIdsService,
	updateKeyboardByIdService,
} from "./keyboard.service";
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

// @desc   Create new keyboard
// @route  POST /api/v1/product-category/keyboard
// @access Private/Admin/Manager
const createNewKeyboardHandler = expressAsyncHandler(
	async (
		request: CreateNewKeyboardRequest,
		response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
	) => {
		const {
			userInfo: { userId, username },
			keyboardFields,
		} = request.body;

		const keyboardSchema: KeyboardSchema = {
			userId,
			username,
			...keyboardFields,
		};

		const keyboardDocument: KeyboardDocument =
			await createNewKeyboardService(keyboardSchema);

		if (!keyboardDocument) {
			response.status(400).json({
				message: "Could not create new keyboard",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${keyboardDocument.model} keyboard`,
			resourceData: [keyboardDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new keyboards bulk
// @route  POST /api/v1/product-category/keyboard/dev
// @access Private/Admin/Manager
const createNewKeyboardBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewKeyboardBulkRequest,
		response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
	) => {
		const { keyboardSchemas } = request.body;

		const newKeyboards = await Promise.all(
			keyboardSchemas.map(async (keyboardSchema) => {
				const newKeyboard = await createNewKeyboardService(keyboardSchema);
				return newKeyboard;
			}),
		);

		// filter out any keyboards that were not created
		const successfullyCreatedKeyboards = newKeyboards.filter(
			(keyboard) => keyboard,
		);

		// check if any keyboards were created
		if (successfullyCreatedKeyboards.length === keyboardSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedKeyboards.length} keyboards`,
				resourceData: successfullyCreatedKeyboards,
			});
			return;
		}

		if (successfullyCreatedKeyboards.length === 0) {
			response.status(400).json({
				message: "Could not create any keyboards",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				keyboardSchemas.length - successfullyCreatedKeyboards.length
			} keyboards`,
			resourceData: successfullyCreatedKeyboards,
		});
		return;
	},
);

// @desc   Update keyboards bulk
// @route  PATCH /api/v1/product-category/keyboard/dev
// @access Private/Admin/Manager
const updateKeyboardsBulkHandler = expressAsyncHandler(
	async (
		request: UpdateKeyboardsBulkRequest,
		response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
	) => {
		const { keyboardFields } = request.body;

		const updatedKeyboards = await Promise.all(
			keyboardFields.map(async (keyboardField) => {
				const {
					keyboardId,
					documentUpdate: { fields, updateOperator },
				} = keyboardField;

				const updatedKeyboard = await updateKeyboardByIdService({
					_id: keyboardId,
					fields,
					updateOperator,
				});

				return updatedKeyboard;
			}),
		);

		// filter out any keyboards that were not updated
		const successfullyUpdatedKeyboards = updatedKeyboards.filter(
			removeUndefinedAndNullValues,
		);

		// check if any keyboards were updated
		if (successfullyUpdatedKeyboards.length === keyboardFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedKeyboards.length} keyboards`,
				resourceData: successfullyUpdatedKeyboards,
			});
			return;
		}

		if (successfullyUpdatedKeyboards.length === 0) {
			response.status(400).json({
				message: "Could not update any keyboards",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				keyboardFields.length - successfullyUpdatedKeyboards.length
			} keyboards`,
			resourceData: successfullyUpdatedKeyboards,
		});
		return;
	},
);

// @desc   Get all keyboards
// @route  GET /api/v1/product-category/keyboard
// @access Private/Admin/Manager
const getQueriedKeyboardsHandler = expressAsyncHandler(
	async (
		request: GetQueriedKeyboardsRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				KeyboardDocument & {
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
			totalDocuments = await getQueriedTotalKeyboardsService({
				filter: filter as FilterQuery<KeyboardDocument> | undefined,
			});
		}

		// get all keyboards
		const keyboards = await getQueriedKeyboardsService({
			filter: filter as FilterQuery<KeyboardDocument> | undefined,
			projection: projection as QueryOptions<KeyboardDocument>,
			options: options as QueryOptions<KeyboardDocument>,
		});
		if (keyboards.length === 0) {
			response.status(200).json({
				message: "No keyboards that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the keyboards
		const fileUploadsArrArr = await Promise.all(
			keyboards.map(async (keyboard) => {
				const fileUploadPromises = keyboard.uploadedFilesIds.map(
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

		// find all reviews associated with the keyboards
		const reviewsArrArr = await Promise.all(
			keyboards.map(async (keyboard) => {
				const reviewPromises = keyboard.reviewsIds.map(async (reviewId) => {
					const review = await getProductReviewByIdService(reviewId);

					return review;
				});

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create keyboardServerResponse array
		const keyboardServerResponseArray = keyboards.map((keyboard, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...keyboard,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved keyboards",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: keyboardServerResponseArray,
		});
	},
);

// @desc   Get keyboard by id
// @route  GET /api/v1/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const getKeyboardByIdHandler = expressAsyncHandler(
	async (
		request: GetKeyboardByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				KeyboardDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const keyboardId = request.params.keyboardId;

		// get keyboard by id
		const keyboard = await getKeyboardByIdService(keyboardId);
		if (!keyboard) {
			response
				.status(404)
				.json({ message: "Keyboard not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the keyboard
		const fileUploads = await Promise.all(
			keyboard.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the keyboard
		const productReviews = await Promise.all(
			keyboard.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create keyboardServerResponse
		const keyboardServerResponse = {
			...keyboard,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved keyboard",
			resourceData: [keyboardServerResponse],
		});
	},
);

// @desc   Update a keyboard by id
// @route  PUT /api/v1/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const updateKeyboardByIdHandler = expressAsyncHandler(
	async (
		request: UpdateKeyboardByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				KeyboardDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { keyboardId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update keyboard
		const updatedKeyboard = await updateKeyboardByIdService({
			_id: keyboardId,
			fields,
			updateOperator,
		});

		if (!updatedKeyboard) {
			response.status(400).json({
				message: "Keyboard could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the keyboard
		const fileUploads = await Promise.all(
			updatedKeyboard.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the keyboard
		const productReviews = await Promise.all(
			updatedKeyboard.reviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create keyboardServerResponse
		const keyboardServerResponse = {
			...updatedKeyboard,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Keyboard updated successfully",
			resourceData: [keyboardServerResponse],
		});
	},
);

// @desc   Delete all keyboards
// @route  DELETE /api/v1/product-category/keyboard
// @access Private/Admin/Manager
const deleteAllKeyboardsHandler = expressAsyncHandler(
	async (
		_request: DeleteAllKeyboardsRequest,
		response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
	) => {
		// grab all keyboards file upload ids
		const uploadedFilesIds = await returnAllKeyboardsUploadedFileIdsService();

		// delete all file uploads associated with all keyboards
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

		// delete all reviews associated with all keyboards
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

		// delete all keyboards
		const deleteKeyboardsResult: DeleteResult =
			await deleteAllKeyboardsService();

		if (deleteKeyboardsResult.deletedCount === 0) {
			response.status(400).json({
				message: "All keyboards could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All keyboards deleted", resourceData: [] });
	},
);

// @desc   Delete a keyboard by id
// @route  DELETE /api/v1/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const deleteAKeyboardHandler = expressAsyncHandler(
	async (
		request: DeleteAKeyboardRequest,
		response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
	) => {
		const keyboardId = request.params.keyboardId;

		// check if keyboard exists
		const keyboardExists = await getKeyboardByIdService(keyboardId);
		if (!keyboardExists) {
			response
				.status(404)
				.json({ message: "Keyboard does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this keyboard
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...keyboardExists.uploadedFilesIds];

		// delete all file uploads associated with all keyboards
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

		// delete all reviews associated with all keyboards
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

		// delete keyboard by id
		const deleteKeyboardResult: DeleteResult =
			await deleteAKeyboardService(keyboardId);

		if (deleteKeyboardResult.deletedCount === 0) {
			response.status(400).json({
				message: "Keyboard could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "Keyboard deleted", resourceData: [] });
	},
);

export {
	createNewKeyboardBulkHandler,
	createNewKeyboardHandler,
	deleteAKeyboardHandler,
	deleteAllKeyboardsHandler,
	getKeyboardByIdHandler,
	getQueriedKeyboardsHandler,
	updateKeyboardByIdHandler,
	updateKeyboardsBulkHandler,
};
