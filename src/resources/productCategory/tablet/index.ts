/**
 * This barrel file is used to import/export tablet router, model, types, controllers and services
 */

/**
 * Imports
 */
import { tabletRouter } from "./tablet.routes";
import { TabletModel } from "./tablet.model";

import {
  createNewTabletBulkController,
  createNewTabletController,
  deleteATabletController,
  deleteAllTabletsController,
  getTabletByIdController,
  getQueriedTabletsController,
  updateTabletByIdController,
  updateTabletsBulkController,
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
  createNewTabletBulkController,
  createNewTabletController,
  createNewTabletService,
  deleteATabletController,
  deleteATabletService,
  deleteAllTabletsController,
  deleteAllTabletsService,
  getTabletByIdController,
  getTabletByIdService,
  getQueriedTabletsController,
  getQueriedTabletsService,
  getQueriedTotalTabletsService,
  returnAllTabletsUploadedFileIdsService,
  updateTabletByIdController,
  updateTabletByIdService,
  updateTabletsBulkController,
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
