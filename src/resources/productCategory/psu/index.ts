/**
 * This barrel file is used to import/export psu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { psuRouter } from "./psu.routes";
import { PsuModel } from "./psu.model";

import {
	createNewPsuBulkHandler,
	createNewPsuHandler,
	deleteAPsuHandler,
	deleteAllPsusHandler,
	getPsuByIdHandler,
	getQueriedPsusHandler,
	updatePsuByIdHandler,
	updatePsusBulkHandler,
} from "./psu.controller";

import {
	createNewPsuService,
	deleteAPsuService,
	deleteAllPsusService,
	getPsuByIdService,
	getQueriedPsusService,
	getQueriedTotalPsusService,
	returnAllPsusUploadedFileIdsService,
	updatePsuByIdService,
} from "./psu.service";

import type { PsuDocument, PsuSchema } from "./psu.model";
import type {
	CreateNewPsuBulkRequest,
	CreateNewPsuRequest,
	DeleteAPsuRequest,
	DeleteAllPsusRequest,
	GetPsuByIdRequest,
	GetQueriedPsusRequest,
	UpdatePsuByIdRequest,
	UpdatePsusBulkRequest,
} from "./psu.types";

/**
 * Exports
 */

export {
	PsuModel,
	psuRouter,
	createNewPsuBulkHandler,
	createNewPsuHandler,
	createNewPsuService,
	deleteAPsuHandler,
	deleteAPsuService,
	deleteAllPsusHandler,
	deleteAllPsusService,
	getPsuByIdHandler,
	getPsuByIdService,
	getQueriedPsusHandler,
	getQueriedPsusService,
	getQueriedTotalPsusService,
	returnAllPsusUploadedFileIdsService,
	updatePsuByIdHandler,
	updatePsuByIdService,
	updatePsusBulkHandler,
};

export type {
	PsuDocument,
	PsuSchema,
	CreateNewPsuBulkRequest,
	CreateNewPsuRequest,
	DeleteAPsuRequest,
	DeleteAllPsusRequest,
	GetPsuByIdRequest,
	GetQueriedPsusRequest,
	UpdatePsuByIdRequest,
	UpdatePsusBulkRequest,
};
