import { Router } from "express";

import { assignQueryDefaults, verifyJWTMiddleware } from "../../middlewares";
import { actionsGeneralRouter } from "./general";
import { actionsCompanyRouter } from "./company";
import { actionsOutreachRouter } from "./outreach";
import {
	getAllActionsDocumentsHandler,
	getUsersActionsDocumentsHandler,
} from "./actions.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const actionsRouter = Router();

// verify JWT middleware that returns (upon success) the decoded JWT, which is the userInfo object that is added to the request body
actionsRouter.use(verifyJWTMiddleware);

actionsRouter.use("/company", actionsCompanyRouter);
actionsRouter.use("/general", actionsGeneralRouter);
actionsRouter.use("/outreach", actionsOutreachRouter);

actionsRouter
	.route("/home")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getAllActionsDocumentsHandler,
	);
actionsRouter
	.route("/home/:userId")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getUsersActionsDocumentsHandler,
	);

export { actionsRouter };
