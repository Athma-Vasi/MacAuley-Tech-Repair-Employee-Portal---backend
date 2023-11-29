import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import { RamDocument, RamModel, RamSchema } from "./ram.model";

async function createNewRamService(ramSchema: RamSchema): Promise<RamDocument> {
	try {
		const newRam = await RamModel.create(ramSchema);
		return newRam;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewRamService" });
	}
}

async function getQueriedRamsService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<RamDocument>): DatabaseResponse<RamDocument> {
	try {
		const rams = await RamModel.find(filter, projection, options).lean().exec();
		return rams;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedRamsService" });
	}
}

async function getQueriedTotalRamsService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<RamDocument>): Promise<number> {
	try {
		const totalRams = await RamModel.countDocuments(filter).lean().exec();
		return totalRams;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalRamsService" });
	}
}

async function getRamByIdService(
	ramId: Types.ObjectId | string,
): DatabaseResponseNullable<RamDocument> {
	try {
		const ram = await RamModel.findById(ramId)

			.lean()
			.exec();
		return ram;
	} catch (error: any) {
		throw new Error(error, { cause: "getRamByIdService" });
	}
}

async function updateRamByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<RamDocument>): DatabaseResponseNullable<RamDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const ram = await RamModel.findByIdAndUpdate(_id, updateObject, {
			new: true,
		})

			.lean()
			.exec();
		return ram;
	} catch (error: any) {
		throw new Error(error, { cause: "updateRamByIdService" });
	}
}

async function deleteAllRamsService(): Promise<DeleteResult> {
	try {
		const rams = await RamModel.deleteMany({}).lean().exec();
		return rams;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllRamsService" });
	}
}

async function returnAllRamsUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const rams = await RamModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = rams.flatMap((ram) => ram.uploadedFilesIds);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllRamsUploadedFileIdsService",
		});
	}
}

async function deleteARamService(
	ramId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const ram = await RamModel.deleteOne({
			_id: ramId,
		})
			.lean()
			.exec();
		return ram;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteARamService" });
	}
}

export {
	createNewRamService,
	getQueriedRamsService,
	getQueriedTotalRamsService,
	getRamByIdService,
	updateRamByIdService,
	deleteAllRamsService,
	returnAllRamsUploadedFileIdsService,
	deleteARamService,
};
