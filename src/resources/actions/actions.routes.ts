import { Router } from "express";

import { createMongoDbQueryObject } from "../../middlewares";
import { actionsGeneralRouter } from "./general";
import { actionsCompanyRouter } from "./company";
import { actionsOutreachRouter } from "./outreach";
import {
  getAllActionsDocumentsController,
  getUsersActionsDocumentsController,
} from "./actions.controller";

const actionsRouter = Router();

actionsRouter.use("/company", actionsCompanyRouter);
actionsRouter.use("/general", actionsGeneralRouter);
actionsRouter.use("/outreach", actionsOutreachRouter);

actionsRouter.route("/home").get(
  createMongoDbQueryObject,
  getAllActionsDocumentsController,
);
actionsRouter
  .route("/home/:userId")
  .get(createMongoDbQueryObject, getUsersActionsDocumentsController);

export { actionsRouter };
