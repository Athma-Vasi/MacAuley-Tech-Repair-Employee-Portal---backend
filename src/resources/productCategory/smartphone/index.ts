/**
 * This barrel file is used to import/export smartphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { smartphoneRouter } from "./smartphone.routes";
import { SmartphoneModel } from "./smartphone.model";

import {
	createNewSmartphoneBulkHandler,
	createNewSmartphoneHandler,
	deleteASmartphoneHandler,
	deleteAllSmartphonesHandler,
	getSmartphoneByIdHandler,
	getQueriedSmartphonesHandler,
	updateSmartphoneByIdHandler,
	updateSmartphonesBulkHandler,
} from "./smartphone.controller";

import {
	createNewSmartphoneService,
	deleteASmartphoneService,
	deleteAllSmartphonesService,
	getSmartphoneByIdService,
	getQueriedSmartphonesService,
	getQueriedTotalSmartphonesService,
	returnAllSmartphonesUploadedFileIdsService,
	updateSmartphoneByIdService,
} from "./smartphone.service";

import type { SmartphoneDocument, SmartphoneSchema } from "./smartphone.model";
import type {
	CreateNewSmartphoneBulkRequest,
	CreateNewSmartphoneRequest,
	DeleteASmartphoneRequest,
	DeleteAllSmartphonesRequest,
	GetSmartphoneByIdRequest,
	GetQueriedSmartphonesRequest,
	UpdateSmartphoneByIdRequest,
	UpdateSmartphonesBulkRequest,
} from "./smartphone.types";

/**
 * Exports
 */

export {
	SmartphoneModel,
	smartphoneRouter,
	createNewSmartphoneBulkHandler,
	createNewSmartphoneHandler,
	createNewSmartphoneService,
	deleteASmartphoneHandler,
	deleteASmartphoneService,
	deleteAllSmartphonesHandler,
	deleteAllSmartphonesService,
	getSmartphoneByIdHandler,
	getSmartphoneByIdService,
	getQueriedSmartphonesHandler,
	getQueriedSmartphonesService,
	getQueriedTotalSmartphonesService,
	returnAllSmartphonesUploadedFileIdsService,
	updateSmartphoneByIdHandler,
	updateSmartphoneByIdService,
	updateSmartphonesBulkHandler,
};

export type {
	SmartphoneDocument,
	SmartphoneSchema,
	CreateNewSmartphoneBulkRequest,
	CreateNewSmartphoneRequest,
	DeleteASmartphoneRequest,
	DeleteAllSmartphonesRequest,
	GetSmartphoneByIdRequest,
	GetQueriedSmartphonesRequest,
	UpdateSmartphoneByIdRequest,
	UpdateSmartphonesBulkRequest,
};
