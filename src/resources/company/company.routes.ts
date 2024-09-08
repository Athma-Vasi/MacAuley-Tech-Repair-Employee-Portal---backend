import { Router } from "express";
import { addressChangeRouter } from "./addressChange";
import { leaveRequestRouter } from "./leaveRequest";
import { expenseClaimRouter } from "./expenseClaim";
import { requestResourceRouter } from "./requestResource";
import { benefitRouter } from "./benefit";
import {
  createMongoDbQueryObject,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../middlewares";

const companyRouter = Router();

companyRouter.use(
  verifyJWTMiddleware,
  verifyRoles,
  createMongoDbQueryObject,
);

companyRouter.use("/address-change", addressChangeRouter);
companyRouter.use("/leave-request", leaveRequestRouter);
companyRouter.use("/expense-claim", expenseClaimRouter);
companyRouter.use("/request-resource", requestResourceRouter);
companyRouter.use("/benefit", benefitRouter);

export { companyRouter };
