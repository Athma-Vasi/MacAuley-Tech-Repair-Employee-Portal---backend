import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import {
	HeadphoneDocument,
	HeadphoneModel,
	HeadphoneSchema,
} from "./headphone.model";

async function createNewHeadphoneService(
	headphoneSchema: HeadphoneSchema,
): Promise<HeadphoneDocument> {
	try {
		const newHeadphone = await HeadphoneModel.create(headphoneSchema);
		return newHeadphone;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewHeadphoneService" });
	}
}

async function getQueriedHeadphonesService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<HeadphoneDocument>): DatabaseResponse<HeadphoneDocument> {
	try {
		const headphones = await HeadphoneModel.find(filter, projection, options)
			.lean()
			.exec();
		return headphones;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedHeadphonesService" });
	}
}

async function getQueriedTotalHeadphonesService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<HeadphoneDocument>): Promise<number> {
	try {
		const totalHeadphones = await HeadphoneModel.countDocuments(filter)
			.lean()
			.exec();
		return totalHeadphones;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalHeadphonesService" });
	}
}

async function getHeadphoneByIdService(
	headphoneId: Types.ObjectId | string,
): DatabaseResponseNullable<HeadphoneDocument> {
	try {
		const headphone = await HeadphoneModel.findById(headphoneId)

			.lean()
			.exec();
		return headphone;
	} catch (error: any) {
		throw new Error(error, { cause: "getHeadphoneByIdService" });
	}
}

async function updateHeadphoneByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<HeadphoneDocument>): DatabaseResponseNullable<HeadphoneDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const headphone = await HeadphoneModel.findByIdAndUpdate(
			_id,
			updateObject,
			{
				new: true,
			},
		)

			.lean()
			.exec();
		return headphone;
	} catch (error: any) {
		throw new Error(error, { cause: "updateHeadphoneByIdService" });
	}
}

async function deleteAllHeadphonesService(): Promise<DeleteResult> {
	try {
		const headphones = await HeadphoneModel.deleteMany({}).lean().exec();
		return headphones;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllHeadphonesService" });
	}
}

async function returnAllHeadphonesUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const headphones = await HeadphoneModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = headphones.flatMap(
			(headphone) => headphone.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllHeadphonesUploadedFileIdsService",
		});
	}
}

async function deleteAHeadphoneService(
	headphoneId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const headphone = await HeadphoneModel.deleteOne({
			_id: headphoneId,
		})
			.lean()
			.exec();
		return headphone;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAHeadphoneService" });
	}
}

export {
	createNewHeadphoneService,
	getQueriedHeadphonesService,
	getQueriedTotalHeadphonesService,
	getHeadphoneByIdService,
	updateHeadphoneByIdService,
	deleteAllHeadphonesService,
	returnAllHeadphonesUploadedFileIdsService,
	deleteAHeadphoneService,
};
