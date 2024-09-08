import { Router } from "express";
import { endorsementRouter } from "./endorsement";
import { printerIssueRouter } from "./printerIssue";
import { anonymousRequestRouter } from "./anonymousRequest";
import { refermentRouter } from "./referment";
import {
  createMongoDbQueryObject,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../middlewares";

const generalRouter = Router();
generalRouter.use(
  verifyJWTMiddleware,
  verifyRoles,
  createMongoDbQueryObject,
);

generalRouter.use("/endorsement", endorsementRouter);
generalRouter.use("/printer-issue", printerIssueRouter);
generalRouter.use("/anonymous-request", anonymousRequestRouter);
generalRouter.use("/referment", refermentRouter);

export { generalRouter };
