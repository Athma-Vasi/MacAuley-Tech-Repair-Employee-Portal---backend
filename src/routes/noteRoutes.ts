import { Router } from 'express';

const noteRouter = Router();

noteRouter.route('/').get().post().patch().delete();

export { noteRouter };
