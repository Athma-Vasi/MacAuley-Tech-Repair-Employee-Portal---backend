import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import { SpeakerDocument, SpeakerModel, SpeakerSchema } from "./speaker.model";

async function createNewSpeakerService(
	speakerSchema: SpeakerSchema,
): Promise<SpeakerDocument> {
	try {
		const newSpeaker = await SpeakerModel.create(speakerSchema);
		return newSpeaker;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewSpeakerService" });
	}
}

async function getQueriedSpeakersService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<SpeakerDocument>): DatabaseResponse<SpeakerDocument> {
	try {
		const speakers = await SpeakerModel.find(filter, projection, options)
			.lean()
			.exec();
		return speakers;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedSpeakersService" });
	}
}

async function getQueriedTotalSpeakersService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<SpeakerDocument>): Promise<number> {
	try {
		const totalSpeakers = await SpeakerModel.countDocuments(filter)
			.lean()
			.exec();
		return totalSpeakers;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalSpeakersService" });
	}
}

async function getSpeakerByIdService(
	speakerId: Types.ObjectId | string,
): DatabaseResponseNullable<SpeakerDocument> {
	try {
		const speaker = await SpeakerModel.findById(speakerId)

			.lean()
			.exec();
		return speaker;
	} catch (error: any) {
		throw new Error(error, { cause: "getSpeakerByIdService" });
	}
}

async function updateSpeakerByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<SpeakerDocument>): DatabaseResponseNullable<SpeakerDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const speaker = await SpeakerModel.findByIdAndUpdate(_id, updateObject, {
			new: true,
		})

			.lean()
			.exec();
		return speaker;
	} catch (error: any) {
		throw new Error(error, { cause: "updateSpeakerByIdService" });
	}
}

async function deleteAllSpeakersService(): Promise<DeleteResult> {
	try {
		const speakers = await SpeakerModel.deleteMany({}).lean().exec();
		return speakers;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllSpeakersService" });
	}
}

async function returnAllSpeakersUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const speakers = await SpeakerModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = speakers.flatMap(
			(speaker) => speaker.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllSpeakersUploadedFileIdsService",
		});
	}
}

async function deleteASpeakerService(
	speakerId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const speaker = await SpeakerModel.deleteOne({
			_id: speakerId,
		})
			.lean()
			.exec();
		return speaker;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteASpeakerService" });
	}
}

export {
	createNewSpeakerService,
	getQueriedSpeakersService,
	getQueriedTotalSpeakersService,
	getSpeakerByIdService,
	updateSpeakerByIdService,
	deleteAllSpeakersService,
	returnAllSpeakersUploadedFileIdsService,
	deleteASpeakerService,
};
