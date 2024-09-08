import { Router } from "express";
import { surveyRouter } from "./survey";
import { eventRouter } from "./event";
import { announcementRouter } from "./announcement";
import {
  createMongoDbQueryObject,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../middlewares";

const outreachRouter = Router();

outreachRouter.use(verifyJWTMiddleware, verifyRoles, createMongoDbQueryObject);

outreachRouter.use("/survey", surveyRouter);
outreachRouter.use("/event", eventRouter);
outreachRouter.use("/announcement", announcementRouter);

export { outreachRouter };
