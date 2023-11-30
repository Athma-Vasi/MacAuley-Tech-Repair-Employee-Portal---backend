import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
	CreateNewSpeakerBulkRequest,
	CreateNewSpeakerRequest,
	DeleteASpeakerRequest,
	DeleteAllSpeakersRequest,
	GetSpeakerByIdRequest,
	GetQueriedSpeakersRequest,
	UpdateSpeakerByIdRequest,
	UpdateSpeakersBulkRequest,
} from "./speaker.types";
import type {
	GetQueriedResourceRequestServerResponse,
	QueryObjectParsedWithDefaults,
	ResourceRequestServerResponse,
} from "../../../types";
import type { SpeakerDocument, SpeakerSchema } from "./speaker.model";

import {
	createNewSpeakerService,
	deleteASpeakerService,
	deleteAllSpeakersService,
	getSpeakerByIdService,
	getQueriedSpeakersService,
	getQueriedTotalSpeakersService,
	returnAllSpeakersUploadedFileIdsService,
	updateSpeakerByIdService,
} from "./speaker.service";
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

// @desc   Create new speaker
// @route  POST /api/v1/product-category/speaker
// @access Private/Admin/Manager
const createNewSpeakerHandler = expressAsyncHandler(
	async (
		request: CreateNewSpeakerRequest,
		response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
	) => {
		const { speakerSchema } = request.body;

		const speakerDocument: SpeakerDocument =
			await createNewSpeakerService(speakerSchema);

		if (!speakerDocument) {
			response.status(400).json({
				message: "Could not create new speaker",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created new ${speakerDocument.model} speaker`,
			resourceData: [speakerDocument],
		});
	},
);

// DEV ROUTE
// @desc   Create new speakers bulk
// @route  POST /api/v1/product-category/speaker/dev
// @access Private/Admin/Manager
const createNewSpeakerBulkHandler = expressAsyncHandler(
	async (
		request: CreateNewSpeakerBulkRequest,
		response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
	) => {
		const { speakerSchemas } = request.body;

		const newSpeakers = await Promise.all(
			speakerSchemas.map(async (speakerSchema) => {
				const newSpeaker = await createNewSpeakerService(speakerSchema);
				return newSpeaker;
			}),
		);

		// filter out any speakers that were not created
		const successfullyCreatedSpeakers = newSpeakers.filter(
			(speaker) => speaker,
		);

		// check if any speakers were created
		if (successfullyCreatedSpeakers.length === speakerSchemas.length) {
			response.status(201).json({
				message: `Successfully created ${successfullyCreatedSpeakers.length} speakers`,
				resourceData: successfullyCreatedSpeakers,
			});
			return;
		}

		if (successfullyCreatedSpeakers.length === 0) {
			response.status(400).json({
				message: "Could not create any speakers",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully created ${
				speakerSchemas.length - successfullyCreatedSpeakers.length
			} speakers`,
			resourceData: successfullyCreatedSpeakers,
		});
		return;
	},
);

// @desc   Update speakers bulk
// @route  PATCH /api/v1/product-category/speaker/dev
// @access Private/Admin/Manager
const updateSpeakersBulkHandler = expressAsyncHandler(
	async (
		request: UpdateSpeakersBulkRequest,
		response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
	) => {
		const { speakerFields } = request.body;

		const updatedSpeakers = await Promise.all(
			speakerFields.map(async (speakerField) => {
				const {
					documentId,
					documentUpdate: { fields, updateOperator },
				} = speakerField;

				const updatedSpeaker = await updateSpeakerByIdService({
					_id: documentId,
					fields,
					updateOperator,
				});

				return updatedSpeaker;
			}),
		);

		// filter out any speakers that were not updated
		const successfullyUpdatedSpeakers = updatedSpeakers.filter(
			removeUndefinedAndNullValues,
		);

		// check if any speakers were updated
		if (successfullyUpdatedSpeakers.length === speakerFields.length) {
			response.status(201).json({
				message: `Successfully updated ${successfullyUpdatedSpeakers.length} speakers`,
				resourceData: successfullyUpdatedSpeakers,
			});
			return;
		}

		if (successfullyUpdatedSpeakers.length === 0) {
			response.status(400).json({
				message: "Could not update any speakers",
				resourceData: [],
			});
			return;
		}

		response.status(201).json({
			message: `Successfully updated ${
				speakerFields.length - successfullyUpdatedSpeakers.length
			} speakers`,
			resourceData: successfullyUpdatedSpeakers,
		});
		return;
	},
);

// @desc   Get all speakers
// @route  GET /api/v1/product-category/speaker
// @access Private/Admin/Manager
const getQueriedSpeakersHandler = expressAsyncHandler(
	async (
		request: GetQueriedSpeakersRequest,
		response: Response<
			GetQueriedResourceRequestServerResponse<
				SpeakerDocument & {
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
			totalDocuments = await getQueriedTotalSpeakersService({
				filter: filter as FilterQuery<SpeakerDocument> | undefined,
			});
		}

		// get all speakers
		const speakers = await getQueriedSpeakersService({
			filter: filter as FilterQuery<SpeakerDocument> | undefined,
			projection: projection as QueryOptions<SpeakerDocument>,
			options: options as QueryOptions<SpeakerDocument>,
		});
		if (speakers.length === 0) {
			response.status(200).json({
				message: "No speakers that match query parameters were found",
				pages: 0,
				totalDocuments: 0,
				resourceData: [],
			});
			return;
		}

		// find all fileUploads associated with the speakers
		const fileUploadsArrArr = await Promise.all(
			speakers.map(async (speaker) => {
				const fileUploadPromises = speaker.uploadedFilesIds.map(
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

		// find all reviews associated with the speakers
		const reviewsArrArr = await Promise.all(
			speakers.map(async (speaker) => {
				const reviewPromises = speaker.productReviewsIds.map(
					async (reviewId) => {
						const review = await getProductReviewByIdService(reviewId);

						return review;
					},
				);

				// Wait for all the promises to resolve before continuing to the next iteration
				const reviews = await Promise.all(reviewPromises);

				// Filter out any undefined values (in case review was not found)
				return reviews.filter(removeUndefinedAndNullValues);
			}),
		);

		// create speakerServerResponse array
		const speakerServerResponseArray = speakers.map((speaker, index) => {
			const fileUploads = fileUploadsArrArr[index];
			const productReviews = reviewsArrArr[index];
			return {
				...speaker,
				fileUploads,
				productReviews,
			};
		});

		response.status(200).json({
			message: "Successfully retrieved speakers",
			pages: Math.ceil(totalDocuments / Number(options?.limit)),
			totalDocuments,
			resourceData: speakerServerResponseArray,
		});
	},
);

// @desc   Get speaker by id
// @route  GET /api/v1/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const getSpeakerByIdHandler = expressAsyncHandler(
	async (
		request: GetSpeakerByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				SpeakerDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const speakerId = request.params.speakerId;

		// get speaker by id
		const speaker = await getSpeakerByIdService(speakerId);
		if (!speaker) {
			response
				.status(404)
				.json({ message: "Speaker not found", resourceData: [] });
			return;
		}

		// get all fileUploads associated with the speaker
		const fileUploads = await Promise.all(
			speaker.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the speaker
		const productReviews = await Promise.all(
			speaker.productReviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create speakerServerResponse
		const speakerServerResponse = {
			...speaker,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Successfully retrieved speaker",
			resourceData: [speakerServerResponse],
		});
	},
);

// @desc   Update a speaker by id
// @route  PUT /api/v1/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const updateSpeakerByIdHandler = expressAsyncHandler(
	async (
		request: UpdateSpeakerByIdRequest,
		response: Response<
			ResourceRequestServerResponse<
				SpeakerDocument & {
					fileUploads: FileUploadDocument[];
					productReviews: ProductReviewDocument[];
				}
			>
		>,
	) => {
		const { speakerId } = request.params;
		const {
			documentUpdate: { fields, updateOperator },
		} = request.body;

		// update speaker
		const updatedSpeaker = await updateSpeakerByIdService({
			_id: speakerId,
			fields,
			updateOperator,
		});

		if (!updatedSpeaker) {
			response.status(400).json({
				message: "Speaker could not be updated",
				resourceData: [],
			});
			return;
		}

		// get all fileUploads associated with the speaker
		const fileUploads = await Promise.all(
			updatedSpeaker.uploadedFilesIds.map(async (uploadedFileId) => {
				const fileUpload = await getFileUploadByIdService(uploadedFileId);

				return fileUpload;
			}),
		);

		// get all reviews associated with the speaker
		const productReviews = await Promise.all(
			updatedSpeaker.productReviewsIds.map(async (reviewId) => {
				const review = await getProductReviewByIdService(reviewId);

				return review;
			}),
		);

		// create speakerServerResponse
		const speakerServerResponse = {
			...updatedSpeaker,
			fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
			productReviews: productReviews.filter(removeUndefinedAndNullValues),
		};

		response.status(200).json({
			message: "Speaker updated successfully",
			resourceData: [speakerServerResponse],
		});
	},
);

// @desc   Delete all speakers
// @route  DELETE /api/v1/product-category/speaker
// @access Private/Admin/Manager
const deleteAllSpeakersHandler = expressAsyncHandler(
	async (
		_request: DeleteAllSpeakersRequest,
		response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
	) => {
		// grab all speakers file upload ids
		const uploadedFilesIds = await returnAllSpeakersUploadedFileIdsService();

		// delete all file uploads associated with all speakers
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

		// delete all reviews associated with all speakers
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

		// delete all speakers
		const deleteSpeakersResult: DeleteResult = await deleteAllSpeakersService();

		if (deleteSpeakersResult.deletedCount === 0) {
			response.status(400).json({
				message: "All speakers could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response
			.status(200)
			.json({ message: "All speakers deleted", resourceData: [] });
	},
);

// @desc   Delete a speaker by id
// @route  DELETE /api/v1/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const deleteASpeakerHandler = expressAsyncHandler(
	async (
		request: DeleteASpeakerRequest,
		response: Response<ResourceRequestServerResponse<SpeakerDocument>>,
	) => {
		const speakerId = request.params.speakerId;

		// check if speaker exists
		const speakerExists = await getSpeakerByIdService(speakerId);
		if (!speakerExists) {
			response
				.status(404)
				.json({ message: "Speaker does not exist", resourceData: [] });
			return;
		}

		// find all file uploads associated with this speaker
		// if it is not an array, it is made to be an array
		const uploadedFilesIds = [...speakerExists.uploadedFilesIds];

		// delete all file uploads associated with all speakers
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

		// delete all reviews associated with all speakers
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

		// delete speaker by id
		const deleteSpeakerResult: DeleteResult =
			await deleteASpeakerService(speakerId);

		if (deleteSpeakerResult.deletedCount === 0) {
			response.status(400).json({
				message: "Speaker could not be deleted. Please try again.",
				resourceData: [],
			});
			return;
		}

		response.status(200).json({ message: "Speaker deleted", resourceData: [] });
	},
);

export {
	createNewSpeakerBulkHandler,
	createNewSpeakerHandler,
	deleteASpeakerHandler,
	deleteAllSpeakersHandler,
	getSpeakerByIdHandler,
	getQueriedSpeakersHandler,
	updateSpeakerByIdHandler,
	updateSpeakersBulkHandler,
};
