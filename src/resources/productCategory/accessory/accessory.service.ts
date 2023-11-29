import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import {
	AccessoryDocument,
	AccessoryModel,
	AccessorySchema,
} from "./accessory.model";

async function createNewAccessoryService(
	accessorySchema: AccessorySchema,
): Promise<AccessoryDocument> {
	try {
		const newAccessory = await AccessoryModel.create(accessorySchema);
		return newAccessory;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewAccessoryService" });
	}
}

async function getQueriedAccessoriesService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<AccessoryDocument>): DatabaseResponse<AccessoryDocument> {
	try {
		const accessories = await AccessoryModel.find(filter, projection, options)
			.lean()
			.exec();
		return accessories;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedAccessoriesService" });
	}
}

async function getQueriedTotalAccessoriesService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<AccessoryDocument>): Promise<number> {
	try {
		const totalAccessories = await AccessoryModel.countDocuments(filter)
			.lean()
			.exec();
		return totalAccessories;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalAccessoriesService" });
	}
}

async function getAccessoryByIdService(
	accessoryId: Types.ObjectId | string,
): DatabaseResponseNullable<AccessoryDocument> {
	try {
		const accessory = await AccessoryModel.findById(accessoryId)

			.lean()
			.exec();
		return accessory;
	} catch (error: any) {
		throw new Error(error, { cause: "getAccessoryByIdService" });
	}
}

async function updateAccessoryByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<AccessoryDocument>): DatabaseResponseNullable<AccessoryDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const accessory = await AccessoryModel.findByIdAndUpdate(
			_id,
			updateObject,
			{ new: true },
		)

			.lean()
			.exec();
		return accessory;
	} catch (error: any) {
		throw new Error(error, { cause: "updateAccessoryByIdService" });
	}
}

async function deleteAllAccessoriesService(): Promise<DeleteResult> {
	try {
		const accessories = await AccessoryModel.deleteMany({}).lean().exec();
		return accessories;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllAccessoriesService" });
	}
}

async function returnAllAccessoriesUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const accessories = await AccessoryModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = accessories.flatMap(
			(accessory) => accessory.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllAccessoriesUploadedFileIdsService",
		});
	}
}

async function deleteAnAccessoryService(
	accessoryId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const accessory = await AccessoryModel.deleteOne({ _id: accessoryId })
			.lean()
			.exec();
		return accessory;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAAccessoryService" });
	}
}

export {
	createNewAccessoryService,
	getQueriedAccessoriesService,
	getQueriedTotalAccessoriesService,
	getAccessoryByIdService,
	updateAccessoryByIdService,
	deleteAllAccessoriesService,
	returnAllAccessoriesUploadedFileIdsService,
	deleteAnAccessoryService,
};
