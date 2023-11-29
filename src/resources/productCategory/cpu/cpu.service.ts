import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import { CpuDocument, CpuModel, CpuSchema } from "./cpu.model";

async function createNewCpuService(cpuSchema: CpuSchema): Promise<CpuDocument> {
	try {
		const newCpu = await CpuModel.create(cpuSchema);
		return newCpu;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewCpuService" });
	}
}

async function getQueriedCpusService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<CpuDocument>): DatabaseResponse<CpuDocument> {
	try {
		const cpus = await CpuModel.find(filter, projection, options).lean().exec();
		return cpus;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedCpusService" });
	}
}

async function getQueriedTotalCpusService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<CpuDocument>): Promise<number> {
	try {
		const totalCpus = await CpuModel.countDocuments(filter).lean().exec();
		return totalCpus;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalCpusService" });
	}
}

async function getCpuByIdService(
	cpuId: Types.ObjectId | string,
): DatabaseResponseNullable<CpuDocument> {
	try {
		const cpu = await CpuModel.findById(cpuId)

			.lean()
			.exec();
		return cpu;
	} catch (error: any) {
		throw new Error(error, { cause: "getCpuByIdService" });
	}
}

async function updateCpuByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<CpuDocument>): DatabaseResponseNullable<CpuDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const cpu = await CpuModel.findByIdAndUpdate(_id, updateObject, {
			new: true,
		})

			.lean()
			.exec();
		return cpu;
	} catch (error: any) {
		throw new Error(error, { cause: "updateCpuByIdService" });
	}
}

async function deleteAllCpusService(): Promise<DeleteResult> {
	try {
		const cpus = await CpuModel.deleteMany({}).lean().exec();
		return cpus;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllCpusService" });
	}
}

async function returnAllCpusUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const cpus = await CpuModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = cpus.flatMap((cpu) => cpu.uploadedFilesIds);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllCpusUploadedFileIdsService",
		});
	}
}

async function deleteACpuService(
	cpuId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const cpu = await CpuModel.deleteOne({
			_id: cpuId,
		})
			.lean()
			.exec();
		return cpu;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteACpuService" });
	}
}

export {
	createNewCpuService,
	getQueriedCpusService,
	getQueriedTotalCpusService,
	getCpuByIdService,
	updateCpuByIdService,
	deleteAllCpusService,
	returnAllCpusUploadedFileIdsService,
	deleteACpuService,
};
