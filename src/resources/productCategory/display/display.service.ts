import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import { DisplayDocument, DisplayModel, DisplaySchema } from "./display.model";

async function createNewDisplayService(
	displaySchema: DisplaySchema,
): Promise<DisplayDocument> {
	try {
		const newDisplay = await DisplayModel.create(displaySchema);
		return newDisplay;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewDisplayService" });
	}
}

async function getQueriedDisplaysService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<DisplayDocument>): DatabaseResponse<DisplayDocument> {
	try {
		const displays = await DisplayModel.find(filter, projection, options)
			.lean()
			.exec();
		return displays;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedDisplaysService" });
	}
}

async function getQueriedTotalDisplaysService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<DisplayDocument>): Promise<number> {
	try {
		const totalDisplays = await DisplayModel.countDocuments(filter)
			.lean()
			.exec();
		return totalDisplays;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalDisplaysService" });
	}
}

async function getDisplayByIdService(
	displayId: Types.ObjectId | string,
): DatabaseResponseNullable<DisplayDocument> {
	try {
		const display = await DisplayModel.findById(displayId)

			.lean()
			.exec();
		return display;
	} catch (error: any) {
		throw new Error(error, { cause: "getDisplayByIdService" });
	}
}

async function updateDisplayByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<DisplayDocument>): DatabaseResponseNullable<DisplayDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const display = await DisplayModel.findByIdAndUpdate(_id, updateObject, {
			new: true,
		})

			.lean()
			.exec();
		return display;
	} catch (error: any) {
		throw new Error(error, { cause: "updateDisplayByIdService" });
	}
}

async function deleteAllDisplaysService(): Promise<DeleteResult> {
	try {
		const displays = await DisplayModel.deleteMany({}).lean().exec();
		return displays;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllDisplaysService" });
	}
}

async function returnAllDisplaysUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const displays = await DisplayModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = displays.flatMap(
			(display) => display.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllDisplaysUploadedFileIdsService",
		});
	}
}

async function deleteADisplayService(
	displayId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const display = await DisplayModel.deleteOne({
			_id: displayId,
		})
			.lean()
			.exec();
		return display;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteADisplayService" });
	}
}

export {
	createNewDisplayService,
	getQueriedDisplaysService,
	getQueriedTotalDisplaysService,
	getDisplayByIdService,
	updateDisplayByIdService,
	deleteAllDisplaysService,
	returnAllDisplaysUploadedFileIdsService,
	deleteADisplayService,
};
