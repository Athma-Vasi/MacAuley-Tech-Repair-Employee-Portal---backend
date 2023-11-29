import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
} from "../../../types";
import {
	KeyboardDocument,
	KeyboardModel,
	KeyboardSchema,
} from "./keyboard.model";

async function createNewKeyboardService(
	keyboardSchema: KeyboardSchema,
): Promise<KeyboardDocument> {
	try {
		const newKeyboard = await KeyboardModel.create(keyboardSchema);
		return newKeyboard;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewKeyboardService" });
	}
}

async function getQueriedKeyboardsService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<KeyboardDocument>): DatabaseResponse<KeyboardDocument> {
	try {
		const keyboards = await KeyboardModel.find(filter, projection, options)
			.lean()
			.exec();
		return keyboards;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedKeyboardService" });
	}
}

async function getQueriedTotalKeyboardsService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<KeyboardDocument>): Promise<number> {
	try {
		const totalKeyboard = await KeyboardModel.countDocuments(filter)
			.lean()
			.exec();
		return totalKeyboard;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalKeyboardService" });
	}
}

async function getKeyboardByIdService(
	keyboardId: Types.ObjectId | string,
): DatabaseResponseNullable<KeyboardDocument> {
	try {
		const keyboard = await KeyboardModel.findById(keyboardId)

			.lean()
			.exec();
		return keyboard;
	} catch (error: any) {
		throw new Error(error, { cause: "getKeyboardByIdService" });
	}
}

async function updateKeyboardByIdService({
	fieldsToUpdate,
	keyboardId,
}: {
	keyboardId: Types.ObjectId | string;
	fieldsToUpdate: Record<
		keyof KeyboardDocument,
		KeyboardDocument[keyof KeyboardDocument]
	>;
}): DatabaseResponseNullable<KeyboardDocument> {
	try {
		const keyboard = await KeyboardModel.findByIdAndUpdate(
			keyboardId,
			{ $set: fieldsToUpdate },
			{ new: true },
		)

			.lean()
			.exec();
		return keyboard;
	} catch (error: any) {
		throw new Error(error, { cause: "updateKeyboardByIdService" });
	}
}

async function deleteAllKeyboardsService(): Promise<DeleteResult> {
	try {
		const keyboards = await KeyboardModel.deleteMany({}).lean().exec();
		return keyboards;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllKeyboardsService" });
	}
}

async function returnAllKeyboardsUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const keyboards = await KeyboardModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = keyboards.flatMap(
			(keyboard) => keyboard.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllKeyboardsUploadedFileIdsService",
		});
	}
}

async function deleteAKeyboardService(
	keyboardId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const keyboard = await KeyboardModel.deleteOne({ _id: keyboardId })
			.lean()
			.exec();
		return keyboard;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAKeyboardService" });
	}
}

export {
	createNewKeyboardService,
	getQueriedKeyboardsService,
	getQueriedTotalKeyboardsService,
	getKeyboardByIdService,
	updateKeyboardByIdService,
	deleteAllKeyboardsService,
	returnAllKeyboardsUploadedFileIdsService,
	deleteAKeyboardService,
};
