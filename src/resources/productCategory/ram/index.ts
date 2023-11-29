/**
 * This barrel file is used to import/export ram router, model, types, controllers and services
 */

/**
 * Imports
 */
import { ramRouter } from "./ram.routes";
import { RamModel } from "./ram.model";

import {
	createNewRamBulkHandler,
	createNewRamHandler,
	deleteARamHandler,
	deleteAllRamsHandler,
	getRamByIdHandler,
	getQueriedRamsHandler,
	updateRamByIdHandler,
	updateRamsBulkHandler,
} from "./ram.controller";

import {
	createNewRamService,
	deleteARamService,
	deleteAllRamsService,
	getRamByIdService,
	getQueriedRamsService,
	getQueriedTotalRamsService,
	returnAllRamsUploadedFileIdsService,
	updateRamByIdService,
} from "./ram.service";

import type { RamDocument, RamSchema } from "./ram.model";
import type {
	CreateNewRamBulkRequest,
	CreateNewRamRequest,
	DeleteARamRequest,
	DeleteAllRamsRequest,
	GetRamByIdRequest,
	GetQueriedRamsRequest,
	UpdateRamByIdRequest,
	UpdateRamsBulkRequest,
} from "./ram.types";

/**
 * Exports
 */

export {
	RamModel,
	ramRouter,
	createNewRamBulkHandler,
	createNewRamHandler,
	createNewRamService,
	deleteARamHandler,
	deleteARamService,
	deleteAllRamsHandler,
	deleteAllRamsService,
	getRamByIdHandler,
	getRamByIdService,
	getQueriedRamsHandler,
	getQueriedRamsService,
	getQueriedTotalRamsService,
	returnAllRamsUploadedFileIdsService,
	updateRamByIdHandler,
	updateRamByIdService,
	updateRamsBulkHandler,
};

export type {
	RamDocument,
	RamSchema,
	CreateNewRamBulkRequest,
	CreateNewRamRequest,
	DeleteARamRequest,
	DeleteAllRamsRequest,
	GetRamByIdRequest,
	GetQueriedRamsRequest,
	UpdateRamByIdRequest,
	UpdateRamsBulkRequest,
};
