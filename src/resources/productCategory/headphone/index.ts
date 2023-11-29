/**
 * This barrel file is used to import/export headphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { headphoneRouter } from "./headphone.routes";
import { HeadphoneModel } from "./headphone.model";

import {
	createNewHeadphoneBulkHandler,
	createNewHeadphoneHandler,
	deleteAHeadphoneHandler,
	deleteAllHeadphonesHandler,
	getHeadphoneByIdHandler,
	getQueriedHeadphonesHandler,
	updateHeadphoneByIdHandler,
	updateHeadphonesBulkHandler,
} from "./headphone.controller";

import {
	createNewHeadphoneService,
	deleteAHeadphoneService,
	deleteAllHeadphonesService,
	getHeadphoneByIdService,
	getQueriedHeadphonesService,
	getQueriedTotalHeadphonesService,
	returnAllHeadphonesUploadedFileIdsService,
	updateHeadphoneByIdService,
} from "./headphone.service";

import type { HeadphoneDocument, HeadphoneSchema } from "./headphone.model";
import type {
	CreateNewHeadphoneBulkRequest,
	CreateNewHeadphoneRequest,
	DeleteAHeadphoneRequest,
	DeleteAllHeadphonesRequest,
	GetHeadphoneByIdRequest,
	GetQueriedHeadphonesRequest,
	UpdateHeadphoneByIdRequest,
	UpdateHeadphonesBulkRequest,
} from "./headphone.types";

/**
 * Exports
 */

export {
	HeadphoneModel,
	headphoneRouter,
	createNewHeadphoneBulkHandler,
	createNewHeadphoneHandler,
	createNewHeadphoneService,
	deleteAHeadphoneHandler,
	deleteAHeadphoneService,
	deleteAllHeadphonesHandler,
	deleteAllHeadphonesService,
	getHeadphoneByIdHandler,
	getHeadphoneByIdService,
	getQueriedHeadphonesHandler,
	getQueriedHeadphonesService,
	getQueriedTotalHeadphonesService,
	returnAllHeadphonesUploadedFileIdsService,
	updateHeadphoneByIdHandler,
	updateHeadphoneByIdService,
	updateHeadphonesBulkHandler,
};

export type {
	HeadphoneDocument,
	HeadphoneSchema,
	CreateNewHeadphoneBulkRequest,
	CreateNewHeadphoneRequest,
	DeleteAHeadphoneRequest,
	DeleteAllHeadphonesRequest,
	GetHeadphoneByIdRequest,
	GetQueriedHeadphonesRequest,
	UpdateHeadphoneByIdRequest,
	UpdateHeadphonesBulkRequest,
};
