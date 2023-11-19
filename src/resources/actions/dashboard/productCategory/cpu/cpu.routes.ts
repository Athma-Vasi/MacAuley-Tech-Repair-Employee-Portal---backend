import { Router } from 'express';
import { assignQueryDefaults, verifyRoles } from '../../../../../middlewares';
import {
  createNewCpuBulkHandler,
  createNewCpuHandler,
  deleteACpuHandler,
  deleteAllCpusHandler,
  getCpuByIdHandler,
  getQueriedCpusHandler,
  returnAllFileUploadsForCpusHandler,
  updateCpuByIdHandler,
} from './cpu.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../../constants';

const cpuRouter = Router();

cpuRouter.use(verifyRoles());

cpuRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedCpusHandler)
  .post(createNewCpuHandler)
  .delete(deleteAllCpusHandler);

// DEV ROUTE
cpuRouter.route('/dev').post(createNewCpuBulkHandler);

cpuRouter.route('/fileUploads').post(returnAllFileUploadsForCpusHandler);

cpuRouter
  .route('/:cpuId')
  .get(getCpuByIdHandler)
  .delete(deleteACpuHandler)
  .put(updateCpuByIdHandler);

export { cpuRouter };
