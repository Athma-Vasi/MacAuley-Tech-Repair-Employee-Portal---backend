import { Router } from "express";
import { endorsementRouter } from "./endorsement";
import { printerIssueRouter } from "./printerIssue";
import { anonymousRequestRouter } from "./anonymousRequest";
import { refermentRouter } from "./referment";
import {
  assignQueryDefaults,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../../middlewares";

const actionsGeneralRouter = Router();
actionsGeneralRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

actionsGeneralRouter.use("/endorsement", endorsementRouter);
actionsGeneralRouter.use("/printer-issue", printerIssueRouter);
actionsGeneralRouter.use("/anonymous-request", anonymousRequestRouter);
actionsGeneralRouter.use("/referment", refermentRouter);

export { actionsGeneralRouter };
