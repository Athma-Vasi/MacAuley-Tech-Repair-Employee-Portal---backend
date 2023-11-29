/**
 * This barrel file is used to import/export microphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { microphoneRouter } from "./microphone.routes";
import { MicrophoneModel } from "./microphone.model";

import {
	createNewMicrophoneBulkHandler,
	createNewMicrophoneHandler,
	deleteAMicrophoneHandler,
	deleteAllMicrophonesHandler,
	getMicrophoneByIdHandler,
	getQueriedMicrophonesHandler,
	updateMicrophoneByIdHandler,
	updateMicrophonesBulkHandler,
} from "./microphone.controller";

import {
	createNewMicrophoneService,
	deleteAMicrophoneService,
	deleteAllMicrophonesService,
	getMicrophoneByIdService,
	getQueriedMicrophonesService,
	getQueriedTotalMicrophonesService,
	returnAllMicrophonesUploadedFileIdsService,
	updateMicrophoneByIdService,
} from "./microphone.service";

import type { MicrophoneDocument, MicrophoneSchema } from "./microphone.model";
import type {
	CreateNewMicrophoneBulkRequest,
	CreateNewMicrophoneRequest,
	DeleteAMicrophoneRequest,
	DeleteAllMicrophonesRequest,
	GetMicrophoneByIdRequest,
	GetQueriedMicrophonesRequest,
	UpdateMicrophoneByIdRequest,
	UpdateMicrophonesBulkRequest,
} from "./microphone.types";

/**
 * Exports
 */

export {
	MicrophoneModel,
	microphoneRouter,
	createNewMicrophoneBulkHandler,
	createNewMicrophoneHandler,
	createNewMicrophoneService,
	deleteAMicrophoneHandler,
	deleteAMicrophoneService,
	deleteAllMicrophonesHandler,
	deleteAllMicrophonesService,
	getMicrophoneByIdHandler,
	getMicrophoneByIdService,
	getQueriedMicrophonesHandler,
	getQueriedMicrophonesService,
	getQueriedTotalMicrophonesService,
	returnAllMicrophonesUploadedFileIdsService,
	updateMicrophoneByIdHandler,
	updateMicrophoneByIdService,
	updateMicrophonesBulkHandler,
};

export type {
	MicrophoneDocument,
	MicrophoneSchema,
	CreateNewMicrophoneBulkRequest,
	CreateNewMicrophoneRequest,
	DeleteAMicrophoneRequest,
	DeleteAllMicrophonesRequest,
	GetMicrophoneByIdRequest,
	GetQueriedMicrophonesRequest,
	UpdateMicrophoneByIdRequest,
	UpdateMicrophonesBulkRequest,
};
