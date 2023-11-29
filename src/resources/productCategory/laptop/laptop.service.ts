import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
	QueriedResourceGetRequestServiceInput,
	DatabaseResponse,
	DatabaseResponseNullable,
	UpdateDocumentByIdServiceInput,
} from "../../../types";
import { LaptopDocument, LaptopModel, LaptopSchema } from "./laptop.model";

async function createNewLaptopService(
	laptopSchema: LaptopSchema,
): Promise<LaptopDocument> {
	try {
		const newLaptop = await LaptopModel.create(laptopSchema);
		return newLaptop;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewLaptopService" });
	}
}

async function getQueriedLaptopsService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<LaptopDocument>): DatabaseResponse<LaptopDocument> {
	try {
		const laptops = await LaptopModel.find(filter, projection, options)
			.lean()
			.exec();
		return laptops;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedLaptopsService" });
	}
}

async function getQueriedTotalLaptopsService({
	filter = {},
}: QueriedResourceGetRequestServiceInput<LaptopDocument>): Promise<number> {
	try {
		const totalLaptops = await LaptopModel.countDocuments(filter).lean().exec();
		return totalLaptops;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalLaptopsService" });
	}
}

async function getLaptopByIdService(
	laptopId: Types.ObjectId | string,
): DatabaseResponseNullable<LaptopDocument> {
	try {
		const laptop = await LaptopModel.findById(laptopId)

			.lean()
			.exec();
		return laptop;
	} catch (error: any) {
		throw new Error(error, { cause: "getLaptopByIdService" });
	}
}

async function updateLaptopByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<LaptopDocument>): DatabaseResponseNullable<LaptopDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const laptop = await LaptopModel.findByIdAndUpdate(_id, updateObject, {
			new: true,
		})

			.lean()
			.exec();
		return laptop;
	} catch (error: any) {
		throw new Error(error, { cause: "updateLaptopByIdService" });
	}
}

async function deleteAllLaptopsService(): Promise<DeleteResult> {
	try {
		const laptops = await LaptopModel.deleteMany({}).lean().exec();
		return laptops;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllLaptopsService" });
	}
}

async function returnAllLaptopsUploadedFileIdsService(): Promise<
	Types.ObjectId[]
> {
	try {
		const laptops = await LaptopModel.find({})
			.select("uploadedFilesIds")
			.lean()
			.exec();
		const uploadedFileIds = laptops.flatMap(
			(laptop) => laptop.uploadedFilesIds,
		);
		return uploadedFileIds;
	} catch (error: any) {
		throw new Error(error, {
			cause: "returnAllLaptopsUploadedFileIdsService",
		});
	}
}

async function deleteALaptopService(
	laptopId: Types.ObjectId | string,
): Promise<DeleteResult> {
	try {
		const laptop = await LaptopModel.deleteOne({
			_id: laptopId,
		})
			.lean()
			.exec();
		return laptop;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteALaptopService" });
	}
}

export {
	createNewLaptopService,
	getQueriedLaptopsService,
	getQueriedTotalLaptopsService,
	getLaptopByIdService,
	updateLaptopByIdService,
	deleteAllLaptopsService,
	returnAllLaptopsUploadedFileIdsService,
	deleteALaptopService,
};
