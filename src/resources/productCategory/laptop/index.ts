/**
 * This barrel file is used to import/export laptop router, model, types, controllers and services
 */

/**
 * Imports
 */
import { laptopRouter } from "./laptop.routes";
import { LaptopModel } from "./laptop.model";

import {
	createNewLaptopBulkHandler,
	createNewLaptopHandler,
	deleteALaptopHandler,
	deleteAllLaptopsHandler,
	getLaptopByIdHandler,
	getQueriedLaptopsHandler,
	updateLaptopByIdHandler,
	updateLaptopsBulkHandler,
} from "./laptop.controller";

import {
	createNewLaptopService,
	deleteALaptopService,
	deleteAllLaptopsService,
	getLaptopByIdService,
	getQueriedLaptopsService,
	getQueriedTotalLaptopsService,
	returnAllLaptopsUploadedFileIdsService,
	updateLaptopByIdService,
} from "./laptop.service";

import type { LaptopDocument, LaptopSchema } from "./laptop.model";
import type {
	CreateNewLaptopBulkRequest,
	CreateNewLaptopRequest,
	DeleteALaptopRequest,
	DeleteAllLaptopsRequest,
	GetLaptopByIdRequest,
	GetQueriedLaptopsRequest,
	UpdateLaptopByIdRequest,
	UpdateLaptopsBulkRequest,
} from "./laptop.types";

/**
 * Exports
 */

export {
	LaptopModel,
	laptopRouter,
	createNewLaptopBulkHandler,
	createNewLaptopHandler,
	createNewLaptopService,
	deleteALaptopHandler,
	deleteALaptopService,
	deleteAllLaptopsHandler,
	deleteAllLaptopsService,
	getLaptopByIdHandler,
	getLaptopByIdService,
	getQueriedLaptopsHandler,
	getQueriedLaptopsService,
	getQueriedTotalLaptopsService,
	returnAllLaptopsUploadedFileIdsService,
	updateLaptopByIdHandler,
	updateLaptopByIdService,
	updateLaptopsBulkHandler,
};

export type {
	LaptopDocument,
	LaptopSchema,
	CreateNewLaptopBulkRequest,
	CreateNewLaptopRequest,
	DeleteALaptopRequest,
	DeleteAllLaptopsRequest,
	GetLaptopByIdRequest,
	GetQueriedLaptopsRequest,
	UpdateLaptopByIdRequest,
	UpdateLaptopsBulkRequest,
};
