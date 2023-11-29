import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import { StorageDocument, StorageModel, StorageSchema } from "./storage.model";

async function createNewStorageService(
	storageSchema: StorageSchema,
): Promise<StorageDocument> {
	try {
		const newStorage = await StorageModel.create(storageSchema);
		return newStorage;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewStorageService" });
	}
}

async function getQueriedStoragesService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<StorageDocument>): DatabaseResponse<StorageDocument> {
	try {
		const storages = await StorageModel.find(filter, projection, options)
			.lean()
			.exec();
		return storages;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedStoragesService" });
	}
}

async function getQueriedTotalStoragesService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<StorageDocument>): Promise<number> {
	try {
		const totalStorages = await StorageModel.countDocuments(filter)
			.lean()
			.exec();
		return totalStorages;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalStoragesService" });
	}
}

async function getStorageByIdService(
	storageId: Types.ObjectId | string,
): DatabaseResponseNullable<StorageDocument> {
	try {
		const storage = await StorageModel.findById(storageId)

			.lean()
			.exec();
		return storage;
	} catch (error: any) {
		throw new Error(error, { cause: "getStorageByIdService" });
	}
}

async function updateStorageByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<StorageDocument>): DatabaseResponseNullable<StorageDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const storage = await StorageModel.findByIdAndUpdate(_id, updateObject, {
			new: true,
		})

			.lean()
			.exec();
		return storage;
	} catch (error: any) {
		throw new Error(error, { cause: "updateStorageByIdService" });
	}
}

async function deleteAllStoragesService(): Promise<DeleteResult> {
	try {
		const storages = await StorageModel.deleteMany({}).lean().exec();
		return storages;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllStoragesService" });
	}
}

async function returnAllStoragesUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const storages = await StorageModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = storages.flatMap(
			(storage) => storage.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllStoragesUploadedFileIdsService",
		});
	}
}

async function deleteAStorageService(
	storageId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const storage = await StorageModel.deleteOne({
			_id: storageId,
		})
			.lean()
			.exec();
		return storage;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAStorageService" });
	}
}

export {
	createNewStorageService,
	getQueriedStoragesService,
	getQueriedTotalStoragesService,
	getStorageByIdService,
	updateStorageByIdService,
	deleteAllStoragesService,
	returnAllStoragesUploadedFileIdsService,
	deleteAStorageService,
};
