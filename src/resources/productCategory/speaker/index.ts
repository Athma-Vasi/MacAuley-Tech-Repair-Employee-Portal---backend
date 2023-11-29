/**
 * This barrel file is used to import/export speaker router, model, types, controllers and services
 */

/**
 * Imports
 */
import { speakerRouter } from "./speaker.routes";
import { SpeakerModel } from "./speaker.model";

import {
	createNewSpeakerBulkHandler,
	createNewSpeakerHandler,
	deleteASpeakerHandler,
	deleteAllSpeakersHandler,
	getSpeakerByIdHandler,
	getQueriedSpeakersHandler,
	updateSpeakerByIdHandler,
	updateSpeakersBulkHandler,
} from "./speaker.controller";

import {
	createNewSpeakerService,
	deleteASpeakerService,
	deleteAllSpeakersService,
	getSpeakerByIdService,
	getQueriedSpeakersService,
	getQueriedTotalSpeakersService,
	returnAllSpeakersUploadedFileIdsService,
	updateSpeakerByIdService,
} from "./speaker.service";

import type { SpeakerDocument, SpeakerSchema } from "./speaker.model";
import type {
	CreateNewSpeakerBulkRequest,
	CreateNewSpeakerRequest,
	DeleteASpeakerRequest,
	DeleteAllSpeakersRequest,
	GetSpeakerByIdRequest,
	GetQueriedSpeakersRequest,
	UpdateSpeakerByIdRequest,
	UpdateSpeakersBulkRequest,
} from "./speaker.types";

/**
 * Exports
 */

export {
	SpeakerModel,
	speakerRouter,
	createNewSpeakerBulkHandler,
	createNewSpeakerHandler,
	createNewSpeakerService,
	deleteASpeakerHandler,
	deleteASpeakerService,
	deleteAllSpeakersHandler,
	deleteAllSpeakersService,
	getSpeakerByIdHandler,
	getSpeakerByIdService,
	getQueriedSpeakersHandler,
	getQueriedSpeakersService,
	getQueriedTotalSpeakersService,
	returnAllSpeakersUploadedFileIdsService,
	updateSpeakerByIdHandler,
	updateSpeakerByIdService,
	updateSpeakersBulkHandler,
};

export type {
	SpeakerDocument,
	SpeakerSchema,
	CreateNewSpeakerBulkRequest,
	CreateNewSpeakerRequest,
	DeleteASpeakerRequest,
	DeleteAllSpeakersRequest,
	GetSpeakerByIdRequest,
	GetQueriedSpeakersRequest,
	UpdateSpeakerByIdRequest,
	UpdateSpeakersBulkRequest,
};
