import { Router } from "express";

import { assignQueryDefaults } from "../../middlewares";
import { actionsGeneralRouter } from "./general";
import { actionsCompanyRouter } from "./company";
import { actionsOutreachRouter } from "./outreach";
import {
  getAllActionsDocumentsHandler,
  getUsersActionsDocumentsHandler,
} from "./actions.controller";

const actionsRouter = Router();

actionsRouter.use("/company", actionsCompanyRouter);
actionsRouter.use("/general", actionsGeneralRouter);
actionsRouter.use("/outreach", actionsOutreachRouter);

actionsRouter.route("/home").get(assignQueryDefaults, getAllActionsDocumentsHandler);
actionsRouter
  .route("/home/:userId")
  .get(assignQueryDefaults, getUsersActionsDocumentsHandler);

export { actionsRouter };
