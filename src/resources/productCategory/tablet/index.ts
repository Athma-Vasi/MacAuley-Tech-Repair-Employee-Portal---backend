/**
 * This barrel file is used to import/export tablet router, model, types, controllers and services
 */

/**
 * Imports
 */
import { tabletRouter } from "./tablet.routes";
import { TabletModel } from "./tablet.model";

import {
	createNewTabletBulkHandler,
	createNewTabletHandler,
	deleteATabletHandler,
	deleteAllTabletsHandler,
	getTabletByIdHandler,
	getQueriedTabletsHandler,
	updateTabletByIdHandler,
	updateTabletsBulkHandler,
} from "./tablet.controller";

import {
	createNewTabletService,
	deleteATabletService,
	deleteAllTabletsService,
	getTabletByIdService,
	getQueriedTabletsService,
	getQueriedTotalTabletsService,
	returnAllTabletsUploadedFileIdsService,
	updateTabletByIdService,
} from "./tablet.service";

import type { TabletDocument, TabletSchema } from "./tablet.model";
import type {
	CreateNewTabletBulkRequest,
	CreateNewTabletRequest,
	DeleteATabletRequest,
	DeleteAllTabletsRequest,
	GetTabletByIdRequest,
	GetQueriedTabletsRequest,
	UpdateTabletByIdRequest,
	UpdateTabletsBulkRequest,
} from "./tablet.types";

/**
 * Exports
 */

export {
	TabletModel,
	tabletRouter,
	createNewTabletBulkHandler,
	createNewTabletHandler,
	createNewTabletService,
	deleteATabletHandler,
	deleteATabletService,
	deleteAllTabletsHandler,
	deleteAllTabletsService,
	getTabletByIdHandler,
	getTabletByIdService,
	getQueriedTabletsHandler,
	getQueriedTabletsService,
	getQueriedTotalTabletsService,
	returnAllTabletsUploadedFileIdsService,
	updateTabletByIdHandler,
	updateTabletByIdService,
	updateTabletsBulkHandler,
};

export type {
	TabletDocument,
	TabletSchema,
	CreateNewTabletBulkRequest,
	CreateNewTabletRequest,
	DeleteATabletRequest,
	DeleteAllTabletsRequest,
	GetTabletByIdRequest,
	GetQueriedTabletsRequest,
	UpdateTabletByIdRequest,
	UpdateTabletsBulkRequest,
};
