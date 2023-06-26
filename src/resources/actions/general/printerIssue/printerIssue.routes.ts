import { Router } from 'express';
import {
  createNewPrinterIssueHandler,
  deletePrinterIssueHandler,
  getAPrinterIssueHandler,
  getAllPrinterIssuesHandler,
  getPrinterIssuesByUserHandler,
} from './printerIssue.controller';

const printerIssueRouter = Router();

printerIssueRouter.route('/').get(getAllPrinterIssuesHandler).post(createNewPrinterIssueHandler);

printerIssueRouter.route('/user').get(getPrinterIssuesByUserHandler);

printerIssueRouter
  .route('/:printerIssueId')
  .get(getAPrinterIssueHandler)
  .delete(deletePrinterIssueHandler);

export { printerIssueRouter };
