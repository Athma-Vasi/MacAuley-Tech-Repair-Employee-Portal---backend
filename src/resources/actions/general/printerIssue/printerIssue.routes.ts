import { Router } from 'express';
import {
  createNewPrinterIssueHandler,
  deleteAllPrinterIssuesHandler,
  deletePrinterIssueHandler,
  getAPrinterIssueHandler,
  getQueriedPrinterIssuesHandler,
  getQueriedPrinterIssuesByUserHandler,
  updatePrinterIssueByIdHandler,
} from './printerIssue.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const printerIssueRouter = Router();

printerIssueRouter.use(verifyRoles());

printerIssueRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPrinterIssuesHandler)
  .post(createNewPrinterIssueHandler)
  .delete(deleteAllPrinterIssuesHandler);

printerIssueRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPrinterIssuesByUserHandler);

printerIssueRouter
  .route('/:printerIssueId')
  .get(getAPrinterIssueHandler)
  .delete(deletePrinterIssueHandler)
  .patch(updatePrinterIssueByIdHandler);

export { printerIssueRouter };
