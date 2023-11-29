/**
 * This barrel file is used to import/export keyboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { keyboardRouter } from "./keyboard.routes";
import { KeyboardModel } from "./keyboard.model";

import {
	createNewKeyboardBulkHandler,
	createNewKeyboardHandler,
	deleteAKeyboardHandler,
	deleteAllKeyboardsHandler,
	getKeyboardByIdHandler,
	getQueriedKeyboardsHandler,
	updateKeyboardByIdHandler,
	updateKeyboardsBulkHandler,
} from "./keyboard.controller";

import {
	createNewKeyboardService,
	deleteAKeyboardService,
	deleteAllKeyboardsService,
	getKeyboardByIdService,
	getQueriedKeyboardsService,
	getQueriedTotalKeyboardsService,
	returnAllKeyboardsUploadedFileIdsService,
	updateKeyboardByIdService,
} from "./keyboard.service";

import type { KeyboardDocument, KeyboardSchema } from "./keyboard.model";
import type {
	CreateNewKeyboardBulkRequest,
	CreateNewKeyboardRequest,
	DeleteAKeyboardRequest,
	DeleteAllKeyboardsRequest,
	GetKeyboardByIdRequest,
	GetQueriedKeyboardsRequest,
	UpdateKeyboardByIdRequest,
	UpdateKeyboardsBulkRequest,
} from "./keyboard.types";

/**
 * Exports
 */

export {
	KeyboardModel,
	keyboardRouter,
	createNewKeyboardBulkHandler,
	createNewKeyboardHandler,
	createNewKeyboardService,
	deleteAKeyboardHandler,
	deleteAKeyboardService,
	deleteAllKeyboardsHandler,
	deleteAllKeyboardsService,
	getKeyboardByIdHandler,
	getKeyboardByIdService,
	getQueriedKeyboardsHandler,
	getQueriedKeyboardsService,
	getQueriedTotalKeyboardsService,
	returnAllKeyboardsUploadedFileIdsService,
	updateKeyboardByIdHandler,
	updateKeyboardByIdService,
	updateKeyboardsBulkHandler,
};

export type {
	KeyboardDocument,
	KeyboardSchema,
	CreateNewKeyboardBulkRequest,
	CreateNewKeyboardRequest,
	DeleteAKeyboardRequest,
	DeleteAllKeyboardsRequest,
	GetKeyboardByIdRequest,
	GetQueriedKeyboardsRequest,
	UpdateKeyboardByIdRequest,
	UpdateKeyboardsBulkRequest,
};
