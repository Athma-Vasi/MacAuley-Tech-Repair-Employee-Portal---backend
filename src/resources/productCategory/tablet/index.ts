/**
 * This barrel file is used to import/export tablet router, model, types, controllers and services
 */

/**
 * Imports
 */
import { tabletRouter } from './tablet.routes';
import { TabletModel } from './tablet.model';

import {
  createNewTabletBulkHandler,
  createNewTabletHandler,
  deleteATabletHandler,
  deleteAllTabletsHandler,
  getTabletByIdHandler,
  getQueriedTabletsHandler,
  returnAllFileUploadsForTabletsHandler,
  updateTabletByIdHandler,
} from './tablet.controller';

import {
  createNewTabletService,
  deleteAllTabletsService,
  deleteATabletService,
  getTabletByIdService,
  getQueriedTabletsService,
  getQueriedTotalTabletsService,
  returnAllTabletsUploadedFileIdsService,
  updateTabletByIdService,
} from './tablet.service';

import type { TabletDocument, TabletSchema } from './tablet.model';
import type {
  CreateNewTabletBulkRequest,
  CreateNewTabletRequest,
  DeleteATabletRequest,
  DeleteAllTabletsRequest,
  GetTabletByIdRequest,
  GetQueriedTabletsRequest,
  UpdateTabletByIdRequest,
} from './tablet.types';

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
  deleteAllTabletsHandler,
  deleteAllTabletsService,
  deleteATabletService,
  getTabletByIdHandler,
  getTabletByIdService,
  getQueriedTabletsHandler,
  getQueriedTabletsService,
  getQueriedTotalTabletsService,
  returnAllTabletsUploadedFileIdsService,
  returnAllFileUploadsForTabletsHandler,
  updateTabletByIdHandler,
  updateTabletByIdService,
};

export type {
  CreateNewTabletBulkRequest,
  CreateNewTabletRequest,
  DeleteATabletRequest,
  DeleteAllTabletsRequest,
  GetTabletByIdRequest,
  GetQueriedTabletsRequest,
  TabletDocument,
  TabletSchema,
  UpdateTabletByIdRequest,
};
