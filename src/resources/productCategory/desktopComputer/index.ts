/**
 * This barrel file is used to import/export desktopComputer router, model, types, controllers and services
 */

/**
 * Imports
 */
import { desktopComputerRouter } from "./desktopComputer.routes";
import { DesktopComputerModel } from "./desktopComputer.model";

import {
	createNewDesktopComputerBulkHandler,
	createNewDesktopComputerHandler,
	deleteADesktopComputerHandler,
	deleteAllDesktopComputersHandler,
	getDesktopComputerByIdHandler,
	getQueriedDesktopComputersHandler,
	updateDesktopComputerByIdHandler,
	updateDesktopComputersBulkHandler,
} from "./desktopComputer.controller";

import {
	createNewDesktopComputerService,
	deleteADesktopComputerService,
	deleteAllDesktopComputersService,
	getDesktopComputerByIdService,
	getQueriedDesktopComputersService,
	getQueriedTotalDesktopComputersService,
	returnAllDesktopComputersUploadedFileIdsService,
	updateDesktopComputerByIdService,
} from "./desktopComputer.service";

import type {
	DesktopComputerDocument,
	DesktopComputerSchema,
} from "./desktopComputer.model";
import type {
	CreateNewDesktopComputerBulkRequest,
	CreateNewDesktopComputerRequest,
	DeleteADesktopComputerRequest,
	DeleteAllDesktopComputersRequest,
	GetDesktopComputerByIdRequest,
	GetQueriedDesktopComputersRequest,
	UpdateDesktopComputerByIdRequest,
	UpdateDesktopComputersBulkRequest,
} from "./desktopComputer.types";

/**
 * Exports
 */

export {
	DesktopComputerModel,
	desktopComputerRouter,
	createNewDesktopComputerBulkHandler,
	createNewDesktopComputerHandler,
	createNewDesktopComputerService,
	deleteADesktopComputerHandler,
	deleteADesktopComputerService,
	deleteAllDesktopComputersHandler,
	deleteAllDesktopComputersService,
	getDesktopComputerByIdHandler,
	getDesktopComputerByIdService,
	getQueriedDesktopComputersHandler,
	getQueriedDesktopComputersService,
	getQueriedTotalDesktopComputersService,
	returnAllDesktopComputersUploadedFileIdsService,
	updateDesktopComputerByIdHandler,
	updateDesktopComputerByIdService,
	updateDesktopComputersBulkHandler,
};

export type {
	DesktopComputerDocument,
	DesktopComputerSchema,
	CreateNewDesktopComputerBulkRequest,
	CreateNewDesktopComputerRequest,
	DeleteADesktopComputerRequest,
	DeleteAllDesktopComputersRequest,
	GetDesktopComputerByIdRequest,
	GetQueriedDesktopComputersRequest,
	UpdateDesktopComputerByIdRequest,
	UpdateDesktopComputersBulkRequest,
};
