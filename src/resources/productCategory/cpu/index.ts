/**
 * This barrel file is used to import/export cpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { cpuRouter } from "./cpu.routes";
import { CpuModel } from "./cpu.model";

import {
	createNewCpuBulkHandler,
	createNewCpuHandler,
	deleteACpuHandler,
	deleteAllCpusHandler,
	getCpuByIdHandler,
	getQueriedCpusHandler,
	updateCpuByIdHandler,
	updateCpusBulkHandler,
} from "./cpu.controller";

import {
	createNewCpuService,
	deleteACpuService,
	deleteAllCpusService,
	getCpuByIdService,
	getQueriedCpusService,
	getQueriedTotalCpusService,
	returnAllCpusUploadedFileIdsService,
	updateCpuByIdService,
} from "./cpu.service";

import type { CpuDocument, CpuSchema } from "./cpu.model";
import type {
	CreateNewCpuBulkRequest,
	CreateNewCpuRequest,
	DeleteACpuRequest,
	DeleteAllCpusRequest,
	GetCpuByIdRequest,
	GetQueriedCpusRequest,
	UpdateCpuByIdRequest,
	UpdateCpusBulkRequest,
} from "./cpu.types";

/**
 * Exports
 */

export {
	CpuModel,
	cpuRouter,
	createNewCpuBulkHandler,
	createNewCpuHandler,
	createNewCpuService,
	deleteACpuHandler,
	deleteACpuService,
	deleteAllCpusHandler,
	deleteAllCpusService,
	getCpuByIdHandler,
	getCpuByIdService,
	getQueriedCpusHandler,
	getQueriedCpusService,
	getQueriedTotalCpusService,
	returnAllCpusUploadedFileIdsService,
	updateCpuByIdHandler,
	updateCpuByIdService,
	updateCpusBulkHandler,
};

export type {
	CpuDocument,
	CpuSchema,
	CreateNewCpuBulkRequest,
	CreateNewCpuRequest,
	DeleteACpuRequest,
	DeleteAllCpusRequest,
	GetCpuByIdRequest,
	GetQueriedCpusRequest,
	UpdateCpuByIdRequest,
	UpdateCpusBulkRequest,
};
