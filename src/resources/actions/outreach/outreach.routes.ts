import { Router } from "express";
import { surveyRouter } from "./survey";
import { eventRouter } from "./event";
import { announcementRouter } from "./announcement";
import {
  assignQueryDefaults,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../../middlewares";

const actionsOutreachRouter = Router();
actionsOutreachRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

actionsOutreachRouter.use("/survey", surveyRouter);
actionsOutreachRouter.use("/event", eventRouter);
actionsOutreachRouter.use("/announcement", announcementRouter);

export { actionsOutreachRouter };
