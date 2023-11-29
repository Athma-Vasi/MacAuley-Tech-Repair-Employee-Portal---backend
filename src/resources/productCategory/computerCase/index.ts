/**
 * This barrel file is used to import/export case router, model, types, controllers and services
 */

/**
 * Imports
 */
import { computerCaseRouter } from "./computerCase.routes";
import { ComputerCaseModel } from "./computerCase.model";

import {
	createNewComputerCaseBulkHandler,
	createNewComputerCaseHandler,
	deleteAComputerCaseHandler,
	deleteAllComputerCasesHandler,
	getComputerCaseByIdHandler,
	getQueriedComputerCasesHandler,
	updateComputerCaseByIdHandler,
	updateComputerCasesBulkHandler,
} from "./computerCase.controller";

import {
	createNewComputerCaseService,
	deleteAComputerCaseService,
	deleteAllComputerCasesService,
	getComputerCaseByIdService,
	getQueriedComputerCasesService,
	getQueriedTotalComputerCasesService,
	returnAllComputerCasesUploadedFileIdsService,
	updateComputerCaseByIdService,
} from "./computerCase.service";

import type {
	ComputerCaseDocument,
	ComputerCaseSchema,
} from "./computerCase.model";
import type {
	CreateNewComputerCaseBulkRequest,
	CreateNewComputerCaseRequest,
	DeleteAComputerCaseRequest,
	DeleteAllComputerCasesRequest,
	GetComputerCaseByIdRequest,
	GetQueriedComputerCasesRequest,
	UpdateComputerCaseByIdRequest,
	UpdateComputerCasesBulkRequest,
} from "./computerCase.types";

/**
 * Exports
 */

export {
	ComputerCaseModel,
	computerCaseRouter,
	createNewComputerCaseBulkHandler,
	createNewComputerCaseHandler,
	createNewComputerCaseService,
	deleteAComputerCaseHandler,
	deleteAComputerCaseService,
	deleteAllComputerCasesHandler,
	deleteAllComputerCasesService,
	getComputerCaseByIdHandler,
	getComputerCaseByIdService,
	getQueriedComputerCasesHandler,
	getQueriedComputerCasesService,
	getQueriedTotalComputerCasesService,
	returnAllComputerCasesUploadedFileIdsService,
	updateComputerCaseByIdHandler,
	updateComputerCaseByIdService,
	updateComputerCasesBulkHandler,
};

export type {
	ComputerCaseDocument,
	ComputerCaseSchema,
	CreateNewComputerCaseBulkRequest,
	CreateNewComputerCaseRequest,
	DeleteAComputerCaseRequest,
	DeleteAllComputerCasesRequest,
	GetComputerCaseByIdRequest,
	GetQueriedComputerCasesRequest,
	UpdateComputerCaseByIdRequest,
	UpdateComputerCasesBulkRequest,
};
