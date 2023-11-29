/**
 * This barrel file is used to import/export display router, model, types, controllers and services
 */

/**
 * Imports
 */
import { displayRouter } from "./display.routes";
import { DisplayModel } from "./display.model";

import {
	createNewDisplayBulkHandler,
	createNewDisplayHandler,
	deleteADisplayHandler,
	deleteAllDisplaysHandler,
	getDisplayByIdHandler,
	getQueriedDisplaysHandler,
	updateDisplayByIdHandler,
	updateDisplaysBulkHandler,
} from "./display.controller";

import {
	createNewDisplayService,
	deleteADisplayService,
	deleteAllDisplaysService,
	getDisplayByIdService,
	getQueriedDisplaysService,
	getQueriedTotalDisplaysService,
	returnAllDisplaysUploadedFileIdsService,
	updateDisplayByIdService,
} from "./display.service";

import type { DisplayDocument, DisplaySchema } from "./display.model";
import type {
	CreateNewDisplayBulkRequest,
	CreateNewDisplayRequest,
	DeleteADisplayRequest,
	DeleteAllDisplaysRequest,
	GetDisplayByIdRequest,
	GetQueriedDisplaysRequest,
	UpdateDisplayByIdRequest,
	UpdateDisplaysBulkRequest,
} from "./display.types";

/**
 * Exports
 */

export {
	DisplayModel,
	displayRouter,
	createNewDisplayBulkHandler,
	createNewDisplayHandler,
	createNewDisplayService,
	deleteADisplayHandler,
	deleteADisplayService,
	deleteAllDisplaysHandler,
	deleteAllDisplaysService,
	getDisplayByIdHandler,
	getDisplayByIdService,
	getQueriedDisplaysHandler,
	getQueriedDisplaysService,
	getQueriedTotalDisplaysService,
	returnAllDisplaysUploadedFileIdsService,
	updateDisplayByIdHandler,
	updateDisplayByIdService,
	updateDisplaysBulkHandler,
};

export type {
	DisplayDocument,
	DisplaySchema,
	CreateNewDisplayBulkRequest,
	CreateNewDisplayRequest,
	DeleteADisplayRequest,
	DeleteAllDisplaysRequest,
	GetDisplayByIdRequest,
	GetQueriedDisplaysRequest,
	UpdateDisplayByIdRequest,
	UpdateDisplaysBulkRequest,
};
