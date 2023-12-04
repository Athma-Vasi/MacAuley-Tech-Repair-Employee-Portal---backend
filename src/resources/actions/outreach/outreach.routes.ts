import { Router } from "express";
import { surveyRouter } from "./survey";
import { eventRouter } from "./event";
import { announcementRouter } from "./announcement";

const actionsOutreachRouter = Router();

actionsOutreachRouter.use("/survey", surveyRouter);
actionsOutreachRouter.use("/event", eventRouter);
actionsOutreachRouter.use("/announcement", announcementRouter);

export { actionsOutreachRouter };
