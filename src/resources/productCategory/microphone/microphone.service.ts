import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import {
	MicrophoneDocument,
	MicrophoneModel,
	MicrophoneSchema,
} from "./microphone.model";

async function createNewMicrophoneService(
	microphoneSchema: MicrophoneSchema,
): Promise<MicrophoneDocument> {
	try {
		const newMicrophone = await MicrophoneModel.create(microphoneSchema);
		return newMicrophone;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewMicrophoneService" });
	}
}

async function getQueriedMicrophonesService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<MicrophoneDocument>): DatabaseResponse<MicrophoneDocument> {
	try {
		const microphones = await MicrophoneModel.find(filter, projection, options)
			.lean()
			.exec();
		return microphones;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedMicrophonesService" });
	}
}

async function getQueriedTotalMicrophonesService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<MicrophoneDocument>): Promise<number> {
	try {
		const totalMicrophones = await MicrophoneModel.countDocuments(filter)
			.lean()
			.exec();
		return totalMicrophones;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalMicrophonesService" });
	}
}

async function getMicrophoneByIdService(
	microphoneId: Types.ObjectId | string,
): DatabaseResponseNullable<MicrophoneDocument> {
	try {
		const microphone = await MicrophoneModel.findById(microphoneId)

			.lean()
			.exec();
		return microphone;
	} catch (error: any) {
		throw new Error(error, { cause: "getMicrophoneByIdService" });
	}
}

async function updateMicrophoneByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<MicrophoneDocument>): DatabaseResponseNullable<MicrophoneDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const microphone = await MicrophoneModel.findByIdAndUpdate(
			_id,
			updateObject,
			{
				new: true,
			},
		)

			.lean()
			.exec();
		return microphone;
	} catch (error: any) {
		throw new Error(error, { cause: "updateMicrophoneByIdService" });
	}
}

async function deleteAllMicrophonesService(): Promise<DeleteResult> {
	try {
		const microphones = await MicrophoneModel.deleteMany({}).lean().exec();
		return microphones;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllMicrophonesService" });
	}
}

async function returnAllMicrophonesUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const microphones = await MicrophoneModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = microphones.flatMap(
			(microphone) => microphone.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllMicrophonesUploadedFileIdsService",
		});
	}
}

async function deleteAMicrophoneService(
	microphoneId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const microphone = await MicrophoneModel.deleteOne({
			_id: microphoneId,
		})
			.lean()
			.exec();
		return microphone;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAMicrophoneService" });
	}
}

export {
	createNewMicrophoneService,
	getQueriedMicrophonesService,
	getQueriedTotalMicrophonesService,
	getMicrophoneByIdService,
	updateMicrophoneByIdService,
	deleteAllMicrophonesService,
	returnAllMicrophonesUploadedFileIdsService,
	deleteAMicrophoneService,
};
