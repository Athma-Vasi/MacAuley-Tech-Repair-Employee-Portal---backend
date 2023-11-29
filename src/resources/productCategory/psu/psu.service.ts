import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
} from "../../../types";
import { PsuDocument, PsuModel, PsuSchema } from "./psu.model";

async function createNewPsuService(psuSchema: PsuSchema): Promise<PsuDocument> {
	try {
		const newPsu = await PsuModel.create(psuSchema);
		return newPsu;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewPsuService" });
	}
}

async function getQueriedPsusService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<PsuDocument>): DatabaseResponse<PsuDocument> {
	try {
		const psus = await PsuModel.find(filter, projection, options).lean().exec();
		return psus;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedPsuService" });
	}
}

async function getQueriedTotalPsusService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<PsuDocument>): Promise<number> {
	try {
		const totalPsu = await PsuModel.countDocuments(filter).lean().exec();
		return totalPsu;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalPsuService" });
	}
}

async function getPsuByIdService(
	psuId: Types.ObjectId | string,
): DatabaseResponseNullable<PsuDocument> {
	try {
		const psu = await PsuModel.findById(psuId).lean().exec();
		return psu;
	} catch (error: any) {
		throw new Error(error, { cause: "getPsuByIdService" });
	}
}

async function updatePsuByIdService({
	fieldsToUpdate,
	psuId,
}: {
	psuId: Types.ObjectId | string;
	fieldsToUpdate: Record<keyof PsuDocument, PsuDocument[keyof PsuDocument]>;
}): DatabaseResponseNullable<PsuDocument> {
	try {
		const psu = await PsuModel.findByIdAndUpdate(
			psuId,
			{ $set: fieldsToUpdate },
			{ new: true },
		)

			.lean()
			.exec();
		return psu;
	} catch (error: any) {
		throw new Error(error, { cause: "updatePsuByIdService" });
	}
}

async function deleteAllPsusService(): Promise<DeleteResult> {
	try {
		const psus = await PsuModel.deleteMany({}).lean().exec();
		return psus;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllPsusService" });
	}
}

async function returnAllPsusUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const psus = await PsuModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = psus.flatMap((psu) => psu.uploadedFilesIds);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, { cause: "returnAllPsusUploadedFileIdsService" });
	}
}

async function deleteAPsuService(
	psuId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const psu = await PsuModel.deleteOne({ _id: psuId }).lean().exec();
		return psu;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAPsuService" });
	}
}

export {
	createNewPsuService,
	getQueriedPsusService,
	getQueriedTotalPsusService,
	getPsuByIdService,
	updatePsuByIdService,
	deleteAllPsusService,
	returnAllPsusUploadedFileIdsService,
	deleteAPsuService,
};
