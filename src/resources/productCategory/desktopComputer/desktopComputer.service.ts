import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import {
	DesktopComputerDocument,
	DesktopComputerModel,
	DesktopComputerSchema,
} from "./desktopComputer.model";

async function createNewDesktopComputerService(
	desktopComputerSchema: DesktopComputerSchema,
): Promise<DesktopComputerDocument> {
	try {
		const newDesktopComputer = await DesktopComputerModel.create(
			desktopComputerSchema,
		);
		return newDesktopComputer;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewDesktopComputerService" });
	}
}

async function getQueriedDesktopComputersService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<DesktopComputerDocument>): DatabaseResponse<DesktopComputerDocument> {
	try {
		const desktopComputers = await DesktopComputerModel.find(
			filter,
			projection,
			options,
		)
			.lean()
			.exec();
		return desktopComputers;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedDesktopComputersService" });
	}
}

async function getQueriedTotalDesktopComputersService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<DesktopComputerDocument>): Promise<number> {
	try {
		const totalDesktopComputers = await DesktopComputerModel.countDocuments(
			filter,
		)
			.lean()
			.exec();
		return totalDesktopComputers;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalDesktopComputersService" });
	}
}

async function getDesktopComputerByIdService(
	desktopComputerId: Types.ObjectId | string,
): DatabaseResponseNullable<DesktopComputerDocument> {
	try {
		const desktopComputer = await DesktopComputerModel.findById(
			desktopComputerId,
		)

			.lean()
			.exec();
		return desktopComputer;
	} catch (error: any) {
		throw new Error(error, { cause: "getDesktopComputerByIdService" });
	}
}

async function updateDesktopComputerByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<DesktopComputerDocument>): DatabaseResponseNullable<DesktopComputerDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const desktopComputer = await DesktopComputerModel.findByIdAndUpdate(
			_id,
			updateObject,
			{
				new: true,
			},
		)

			.lean()
			.exec();
		return desktopComputer;
	} catch (error: any) {
		throw new Error(error, { cause: "updateDesktopComputerByIdService" });
	}
}

async function deleteAllDesktopComputersService(): Promise<DeleteResult> {
	try {
		const desktopComputers = await DesktopComputerModel.deleteMany({})
			.lean()
			.exec();
		return desktopComputers;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllDesktopComputersService" });
	}
}

async function returnAllDesktopComputersUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const desktopComputers = await DesktopComputerModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = desktopComputers.flatMap(
			(desktopComputer) => desktopComputer.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllDesktopComputersUploadedFileIdsService",
		});
	}
}

async function deleteADesktopComputerService(
	desktopComputerId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const desktopComputer = await DesktopComputerModel.deleteOne({
			_id: desktopComputerId,
		})
			.lean()
			.exec();
		return desktopComputer;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteADesktopComputerService" });
	}
}

export {
	createNewDesktopComputerService,
	getQueriedDesktopComputersService,
	getQueriedTotalDesktopComputersService,
	getDesktopComputerByIdService,
	updateDesktopComputerByIdService,
	deleteAllDesktopComputersService,
	returnAllDesktopComputersUploadedFileIdsService,
	deleteADesktopComputerService,
};
