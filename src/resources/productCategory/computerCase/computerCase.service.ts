import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
} from "../../../types";
import {
	ComputerCaseDocument,
	ComputerCaseModel,
	ComputerCaseSchema,
} from "./computerCase.model";

async function createNewComputerCaseService(
	computerCaseSchema: ComputerCaseSchema,
): Promise<ComputerCaseDocument> {
	try {
		const newComputerCase = await ComputerCaseModel.create(computerCaseSchema);
		return newComputerCase;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewComputerCaseService" });
	}
}

async function getQueriedComputerCasesService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<ComputerCaseDocument>): DatabaseResponse<ComputerCaseDocument> {
	try {
		const computerCases = await ComputerCaseModel.find(
			filter,
			projection,
			options,
		)
			.lean()
			.exec();
		return computerCases;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedComputerCaseService" });
	}
}

async function getQueriedTotalComputerCasesService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<ComputerCaseDocument>): Promise<number> {
	try {
		const totalComputerCase = await ComputerCaseModel.countDocuments(filter)
			.lean()
			.exec();
		return totalComputerCase;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalComputerCaseService" });
	}
}

async function getComputerCaseByIdService(
	computerCaseId: Types.ObjectId | string,
): DatabaseResponseNullable<ComputerCaseDocument> {
	try {
		const computerCase = await ComputerCaseModel.findById(computerCaseId)

			.lean()
			.exec();
		return computerCase;
	} catch (error: any) {
		throw new Error(error, { cause: "getComputerCaseByIdService" });
	}
}

async function updateComputerCaseByIdService({
	fieldsToUpdate,
	computerCaseId,
}: {
	computerCaseId: Types.ObjectId | string;
	fieldsToUpdate: Record<
		keyof ComputerCaseDocument,
		ComputerCaseDocument[keyof ComputerCaseDocument]
	>;
}): DatabaseResponseNullable<ComputerCaseDocument> {
	try {
		const computerCase = await ComputerCaseModel.findByIdAndUpdate(
			computerCaseId,
			{ $set: fieldsToUpdate },
			{ new: true },
		)

			.lean()
			.exec();
		return computerCase;
	} catch (error: any) {
		throw new Error(error, { cause: "updateComputerCaseByIdService" });
	}
}

async function deleteAllComputerCasesService(): Promise<DeleteResult> {
	try {
		const computerCases = await ComputerCaseModel.deleteMany({}).lean().exec();
		return computerCases;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllComputerCasesService" });
	}
}

async function returnAllComputerCasesUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const computerCases = await ComputerCaseModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = computerCases.flatMap(
			(computerCase) => computerCase.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllComputerCasesUploadedFileIdsService",
		});
	}
}

async function deleteAComputerCaseService(
	computerCaseId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const computerCase = await ComputerCaseModel.deleteOne({
			_id: computerCaseId,
		})
			.lean()
			.exec();
		return computerCase;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAComputerCaseService" });
	}
}

export {
	createNewComputerCaseService,
	getQueriedComputerCasesService,
	getQueriedTotalComputerCasesService,
	getComputerCaseByIdService,
	updateComputerCaseByIdService,
	deleteAllComputerCasesService,
	returnAllComputerCasesUploadedFileIdsService,
	deleteAComputerCaseService,
};
