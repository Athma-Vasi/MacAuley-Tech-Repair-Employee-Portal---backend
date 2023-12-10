import { Router } from "express";
import { addressChangeRouter } from "./addressChange";
import { leaveRequestRouter } from "./leaveRequest";
import { expenseClaimRouter } from "./expenseClaim";
import { requestResourceRouter } from "./requestResource";
import { benefitRouter } from "./benefit";
import {
  assignQueryDefaults,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../../middlewares";

const actionsCompanyRouter = Router();

actionsCompanyRouter.use(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults);

actionsCompanyRouter.use("/address-change", addressChangeRouter);
actionsCompanyRouter.use("/leave-request", leaveRequestRouter);
actionsCompanyRouter.use("/expense-claim", expenseClaimRouter);
actionsCompanyRouter.use("/request-resource", requestResourceRouter);
actionsCompanyRouter.use("/benefit", benefitRouter);

export { actionsCompanyRouter };
