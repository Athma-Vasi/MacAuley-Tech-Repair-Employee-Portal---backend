import { Router } from "express";

import { assignQueryDefaults } from "../../middlewares";
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

actionsRouter.route("/home").get(assignQueryDefaults, getAllActionsDocumentsController);
actionsRouter
  .route("/home/:userId")
  .get(assignQueryDefaults, getUsersActionsDocumentsController);

export { actionsRouter };
