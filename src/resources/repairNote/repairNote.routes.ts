import { Router } from 'express';

import {
  createNewRepairNoteHandler,
  deleteRepairNoteByIdHandler,
  deleteAllRepairNotesHandler,
  getQueriedRepairNotesHandler,
  getRepairNoteByIdHandler,
  getQueriedRepairNotesByUserHandler,
  updateRepairNoteByIdHandler,
} from './repairNote.controller';

import { assignQueryDefaults, verifyRoles } from '../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../constants';

const repairNoteRouter = Router();

repairNoteRouter.use(verifyRoles());

repairNoteRouter
  .route('/')
  .post(createNewRepairNoteHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRepairNotesHandler)
  .delete(deleteAllRepairNotesHandler);

repairNoteRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRepairNotesByUserHandler);

repairNoteRouter
  .route('/:repairNoteId')
  .get(getRepairNoteByIdHandler)
  .delete(deleteRepairNoteByIdHandler)
  .put(updateRepairNoteByIdHandler);
