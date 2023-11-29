import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import { GpuDocument, GpuModel, GpuSchema } from "./gpu.model";

async function createNewGpuService(gpuSchema: GpuSchema): Promise<GpuDocument> {
	try {
		const newGpu = await GpuModel.create(gpuSchema);
		return newGpu;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewGpuService" });
	}
}

async function getQueriedGpusService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<GpuDocument>): DatabaseResponse<GpuDocument> {
	try {
		const gpus = await GpuModel.find(filter, projection, options).lean().exec();
		return gpus;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedGpusService" });
	}
}

async function getQueriedTotalGpusService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<GpuDocument>): Promise<number> {
	try {
		const totalGpus = await GpuModel.countDocuments(filter).lean().exec();
		return totalGpus;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalGpusService" });
	}
}

async function getGpuByIdService(
	gpuId: Types.ObjectId | string,
): DatabaseResponseNullable<GpuDocument> {
	try {
		const gpu = await GpuModel.findById(gpuId)

			.lean()
			.exec();
		return gpu;
	} catch (error: any) {
		throw new Error(error, { cause: "getGpuByIdService" });
	}
}

async function updateGpuByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<GpuDocument>): DatabaseResponseNullable<GpuDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const gpu = await GpuModel.findByIdAndUpdate(_id, updateObject, {
			new: true,
		})

			.lean()
			.exec();
		return gpu;
	} catch (error: any) {
		throw new Error(error, { cause: "updateGpuByIdService" });
	}
}

async function deleteAllGpusService(): Promise<DeleteResult> {
	try {
		const gpus = await GpuModel.deleteMany({}).lean().exec();
		return gpus;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllGpusService" });
	}
}

async function returnAllGpusUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const gpus = await GpuModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = gpus.flatMap((gpu) => gpu.uploadedFilesIds);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllGpusUploadedFileIdsService",
		});
	}
}

async function deleteAGpuService(
	gpuId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const gpu = await GpuModel.deleteOne({
			_id: gpuId,
		})
			.lean()
			.exec();
		return gpu;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAGpuService" });
	}
}

export {
	createNewGpuService,
	getQueriedGpusService,
	getQueriedTotalGpusService,
	getGpuByIdService,
	updateGpuByIdService,
	deleteAllGpusService,
	returnAllGpusUploadedFileIdsService,
	deleteAGpuService,
};
