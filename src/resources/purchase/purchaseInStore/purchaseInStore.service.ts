import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type {
	PurchaseInStoreDocument,
	PurchaseInStoreSchema,
} from "./purchaseInStore.model";
import type {
	DatabaseResponse,
	DatabaseResponseNullable,
	QueriedResourceGetRequestServiceInput,
	QueriedTotalResourceGetRequestServiceInput,
	UpdateDocumentByIdServiceInput,
} from "../../../types";

import { PurchaseInStoreModel } from "./purchaseInStore.model";

async function createNewPurchaseInStoreService(
	purchaseInStoreSchema: PurchaseInStoreSchema,
): Promise<PurchaseInStoreDocument> {
	try {
		const purchaseInStore = await PurchaseInStoreModel.create(
			purchaseInStoreSchema,
		);
		return purchaseInStore;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewPurchaseInStoreService" });
	}
}

async function getAllPurchaseInStoresService(): DatabaseResponse<PurchaseInStoreDocument> {
	try {
		const purchaseInStores = await PurchaseInStoreModel.find({})

			.lean()
			.exec();
		return purchaseInStores;
	} catch (error: any) {
		throw new Error(error, { cause: "getAllPurchaseInStoresService" });
	}
}

async function getQueriedPurchaseInStoresService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<PurchaseInStoreDocument>): DatabaseResponse<PurchaseInStoreDocument> {
	try {
		const purchaseInStores = await PurchaseInStoreModel.find(
			filter,
			projection,
			options,
		)

			.lean()
			.exec();
		return purchaseInStores;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedPurchaseInStoresService" });
	}
}

async function getQueriedTotalPurchaseInStoresService({
	filter = {},
}: QueriedTotalResourceGetRequestServiceInput<PurchaseInStoreDocument>): Promise<number> {
	try {
		const totalPurchaseInStores = await PurchaseInStoreModel.countDocuments(
			filter,
		)
			.lean()
			.exec();
		return totalPurchaseInStores;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalPurchaseInStoresService" });
	}
}

async function getQueriedPurchaseInStoresByUserService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<PurchaseInStoreDocument>): DatabaseResponse<PurchaseInStoreDocument> {
	try {
		const purchaseInStores = await PurchaseInStoreModel.find(
			filter,
			projection,
			options,
		)

			.lean()
			.exec();
		return purchaseInStores;
	} catch (error: any) {
		throw new Error(error, {
			cause: "getQueriedPurchaseInStoresByUserService",
		});
	}
}

async function getPurchaseInStoreByIdService(
	purchaseInStoreId: Types.ObjectId | string,
): DatabaseResponseNullable<PurchaseInStoreDocument> {
	try {
		const purchaseInStore = await PurchaseInStoreModel.findById(
			purchaseInStoreId,
		)

			.lean()
			.exec();
		return purchaseInStore;
	} catch (error: any) {
		throw new Error(error, { cause: "getPurchaseInStoreByIdService" });
	}
}

async function updatePurchaseInStoreByIdService({
	_id,
	fields,
	updateOperator,
}: UpdateDocumentByIdServiceInput<PurchaseInStoreDocument>): DatabaseResponseNullable<PurchaseInStoreDocument> {
	const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
	const updateObject = JSON.parse(updateString);

	try {
		const purchaseInStore = await PurchaseInStoreModel.findByIdAndUpdate(
			_id,
			updateObject,
			{
				new: true,
			},
		)

			.lean()
			.exec();
		return purchaseInStore;
	} catch (error: any) {
		throw new Error(error, { cause: "updatePurchaseInStoreByIdService" });
	}
}

async function deleteAPurchaseInStoreService(
	purchaseInStoreId: string | Types.ObjectId,
): Promise<DeleteResult> {
	try {
		const purchaseInStore = await PurchaseInStoreModel.deleteOne({
			_id: purchaseInStoreId,
		})
			.lean()
			.exec();
		return purchaseInStore;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAPurchaseInStoreService" });
	}
}

async function deleteAllPurchaseInStoresService(): Promise<DeleteResult> {
	try {
		const purchaseInStores = await PurchaseInStoreModel.deleteMany({})
			.lean()
			.exec();
		return purchaseInStores;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllPurchaseInStoresService" });
	}
}

export {
	createNewPurchaseInStoreService,
	getAllPurchaseInStoresService,
	getPurchaseInStoreByIdService,
	deleteAPurchaseInStoreService,
	deleteAllPurchaseInStoresService,
	getQueriedPurchaseInStoresService,
	getQueriedPurchaseInStoresByUserService,
	getQueriedTotalPurchaseInStoresService,
	updatePurchaseInStoreByIdService,
};
