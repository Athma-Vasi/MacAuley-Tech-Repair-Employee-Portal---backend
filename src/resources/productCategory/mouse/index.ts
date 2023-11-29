/**
 * This barrel file is used to import/export mouse router, model, types, controllers and services
 */

/**
 * Imports
 */
import { mouseRouter } from "./mouse.routes";
import { MouseModel } from "./mouse.model";

import {
	createNewMouseBulkHandler,
	createNewMouseHandler,
	deleteAMouseHandler,
	deleteAllMiceHandler,
	getMouseByIdHandler,
	getQueriedMiceHandler,
	updateMouseByIdHandler,
	updateMiceBulkHandler,
} from "./mouse.controller";

import {
	createNewMouseService,
	deleteAMouseService,
	deleteAllMiceService,
	getMouseByIdService,
	getQueriedMiceService,
	getQueriedTotalMiceService,
	returnAllMiceUploadedFileIdsService,
	updateMouseByIdService,
} from "./mouse.service";

import type { MouseDocument, MouseSchema } from "./mouse.model";
import type {
	CreateNewMouseBulkRequest,
	CreateNewMouseRequest,
	DeleteAMouseRequest,
	DeleteAllMiceRequest,
	GetMouseByIdRequest,
	GetQueriedMiceRequest,
	UpdateMouseByIdRequest,
	UpdateMiceBulkRequest,
} from "./mouse.types";

/**
 * Exports
 */

export {
	MouseModel,
	mouseRouter,
	createNewMouseBulkHandler,
	createNewMouseHandler,
	createNewMouseService,
	deleteAMouseHandler,
	deleteAMouseService,
	deleteAllMiceHandler,
	deleteAllMiceService,
	getMouseByIdHandler,
	getMouseByIdService,
	getQueriedMiceHandler,
	getQueriedMiceService,
	getQueriedTotalMiceService,
	returnAllMiceUploadedFileIdsService,
	updateMouseByIdHandler,
	updateMouseByIdService,
	updateMiceBulkHandler,
};

export type {
	MouseDocument,
	MouseSchema,
	CreateNewMouseBulkRequest,
	CreateNewMouseRequest,
	DeleteAMouseRequest,
	DeleteAllMiceRequest,
	GetMouseByIdRequest,
	GetQueriedMiceRequest,
	UpdateMouseByIdRequest,
	UpdateMiceBulkRequest,
};
