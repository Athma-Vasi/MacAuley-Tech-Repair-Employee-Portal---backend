/**
 * This barrel file is used to import/export gpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { gpuRouter } from "./gpu.routes";
import { GpuModel } from "./gpu.model";

import {
	createNewGpuBulkHandler,
	createNewGpuHandler,
	deleteAGpuHandler,
	deleteAllGpusHandler,
	getGpuByIdHandler,
	getQueriedGpusHandler,
	updateGpuByIdHandler,
	updateGpusBulkHandler,
} from "./gpu.controller";

import {
	createNewGpuService,
	deleteAGpuService,
	deleteAllGpusService,
	getGpuByIdService,
	getQueriedGpusService,
	getQueriedTotalGpusService,
	returnAllGpusUploadedFileIdsService,
	updateGpuByIdService,
} from "./gpu.service";

import type { GpuDocument, GpuSchema } from "./gpu.model";
import type {
	CreateNewGpuBulkRequest,
	CreateNewGpuRequest,
	DeleteAGpuRequest,
	DeleteAllGpusRequest,
	GetGpuByIdRequest,
	GetQueriedGpusRequest,
	UpdateGpuByIdRequest,
	UpdateGpusBulkRequest,
} from "./gpu.types";

/**
 * Exports
 */

export {
	GpuModel,
	gpuRouter,
	createNewGpuBulkHandler,
	createNewGpuHandler,
	createNewGpuService,
	deleteAGpuHandler,
	deleteAGpuService,
	deleteAllGpusHandler,
	deleteAllGpusService,
	getGpuByIdHandler,
	getGpuByIdService,
	getQueriedGpusHandler,
	getQueriedGpusService,
	getQueriedTotalGpusService,
	returnAllGpusUploadedFileIdsService,
	updateGpuByIdHandler,
	updateGpuByIdService,
	updateGpusBulkHandler,
};

export type {
	GpuDocument,
	GpuSchema,
	CreateNewGpuBulkRequest,
	CreateNewGpuRequest,
	DeleteAGpuRequest,
	DeleteAllGpusRequest,
	GetGpuByIdRequest,
	GetQueriedGpusRequest,
	UpdateGpuByIdRequest,
	UpdateGpusBulkRequest,
};
