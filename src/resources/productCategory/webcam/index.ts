/**
 * This barrel file is used to import/export webcam router, model, types, controllers and services
 */

/**
 * Imports
 */
import { webcamRouter } from "./webcam.routes";
import { WebcamModel } from "./webcam.model";

import {
	createNewWebcamBulkHandler,
	createNewWebcamHandler,
	deleteAWebcamHandler,
	deleteAllWebcamsHandler,
	getWebcamByIdHandler,
	getQueriedWebcamsHandler,
	updateWebcamByIdHandler,
	updateWebcamsBulkHandler,
} from "./webcam.controller";

import {
	createNewWebcamService,
	deleteAWebcamService,
	deleteAllWebcamsService,
	getWebcamByIdService,
	getQueriedWebcamsService,
	getQueriedTotalWebcamsService,
	returnAllWebcamsUploadedFileIdsService,
	updateWebcamByIdService,
} from "./webcam.service";

import type { WebcamDocument, WebcamSchema } from "./webcam.model";
import type {
	CreateNewWebcamBulkRequest,
	CreateNewWebcamRequest,
	DeleteAWebcamRequest,
	DeleteAllWebcamsRequest,
	GetWebcamByIdRequest,
	GetQueriedWebcamsRequest,
	UpdateWebcamByIdRequest,
	UpdateWebcamsBulkRequest,
} from "./webcam.types";

/**
 * Exports
 */

export {
	WebcamModel,
	webcamRouter,
	createNewWebcamBulkHandler,
	createNewWebcamHandler,
	createNewWebcamService,
	deleteAWebcamHandler,
	deleteAWebcamService,
	deleteAllWebcamsHandler,
	deleteAllWebcamsService,
	getWebcamByIdHandler,
	getWebcamByIdService,
	getQueriedWebcamsHandler,
	getQueriedWebcamsService,
	getQueriedTotalWebcamsService,
	returnAllWebcamsUploadedFileIdsService,
	updateWebcamByIdHandler,
	updateWebcamByIdService,
	updateWebcamsBulkHandler,
};

export type {
	WebcamDocument,
	WebcamSchema,
	CreateNewWebcamBulkRequest,
	CreateNewWebcamRequest,
	DeleteAWebcamRequest,
	DeleteAllWebcamsRequest,
	GetWebcamByIdRequest,
	GetQueriedWebcamsRequest,
	UpdateWebcamByIdRequest,
	UpdateWebcamsBulkRequest,
};
