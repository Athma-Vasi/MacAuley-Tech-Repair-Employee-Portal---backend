/**
 * This barrel file is used to import/export motherboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { motherboardRouter } from "./motherboard.routes";
import { MotherboardModel } from "./motherboard.model";

import {
	createNewMotherboardBulkHandler,
	createNewMotherboardHandler,
	deleteAMotherboardHandler,
	deleteAllMotherboardsHandler,
	getMotherboardByIdHandler,
	getQueriedMotherboardsHandler,
	updateMotherboardByIdHandler,
	updateMotherboardsBulkHandler,
} from "./motherboard.controller";

import {
	createNewMotherboardService,
	deleteAMotherboardService,
	deleteAllMotherboardsService,
	getMotherboardByIdService,
	getQueriedMotherboardsService,
	getQueriedTotalMotherboardsService,
	returnAllMotherboardsUploadedFileIdsService,
	updateMotherboardByIdService,
} from "./motherboard.service";

import type {
	MotherboardDocument,
	MotherboardSchema,
} from "./motherboard.model";
import type {
	CreateNewMotherboardBulkRequest,
	CreateNewMotherboardRequest,
	DeleteAMotherboardRequest,
	DeleteAllMotherboardsRequest,
	GetMotherboardByIdRequest,
	GetQueriedMotherboardsRequest,
	UpdateMotherboardByIdRequest,
	UpdateMotherboardsBulkRequest,
} from "./motherboard.types";

/**
 * Exports
 */

export {
	MotherboardModel,
	motherboardRouter,
	createNewMotherboardBulkHandler,
	createNewMotherboardHandler,
	createNewMotherboardService,
	deleteAMotherboardHandler,
	deleteAMotherboardService,
	deleteAllMotherboardsHandler,
	deleteAllMotherboardsService,
	getMotherboardByIdHandler,
	getMotherboardByIdService,
	getQueriedMotherboardsHandler,
	getQueriedMotherboardsService,
	getQueriedTotalMotherboardsService,
	returnAllMotherboardsUploadedFileIdsService,
	updateMotherboardByIdHandler,
	updateMotherboardByIdService,
	updateMotherboardsBulkHandler,
};

export type {
	MotherboardDocument,
	MotherboardSchema,
	CreateNewMotherboardBulkRequest,
	CreateNewMotherboardRequest,
	DeleteAMotherboardRequest,
	DeleteAllMotherboardsRequest,
	GetMotherboardByIdRequest,
	GetQueriedMotherboardsRequest,
	UpdateMotherboardByIdRequest,
	UpdateMotherboardsBulkRequest,
};
