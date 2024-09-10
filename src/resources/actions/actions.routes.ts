import { Router } from "express";
import { announcementRouter } from "./announcement";
import { eventRouter } from "./event";
import { expenseClaimRouter } from "./expenseClaim";
import { surveyRouter } from "./survey";
import {
    createMongoDbQueryObject,
    verifyJWTMiddleware,
    verifyRoles,
} from "../../middlewares";

const actionsRouter = Router();

actionsRouter.use(
    verifyJWTMiddleware,
    verifyRoles,
    createMongoDbQueryObject,
);

// route: /api/v1/actions
actionsRouter.use("/announcement", announcementRouter);
actionsRouter.use("/event", eventRouter);
actionsRouter.use("/expense-claim", expenseClaimRouter);
actionsRouter.use("/survey", surveyRouter);

export { actionsRouter };
