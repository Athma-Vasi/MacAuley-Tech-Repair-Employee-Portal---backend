import { Router } from "express";
import { commentRouter } from "../comment";
import { fileUploadRouter } from "../fileUpload";
import { userRouter } from "../user";
import { repairTicketRouter } from "../repairTicket";
import { customerRouter } from "../customer";
import { productCategoryRouter } from "../productCategory";
import { usernameEmailSetRouter } from "../usernameEmailSet";
import { errorLogRouter } from "../errorLog";
import { companyRouter } from "../company/company.routes";
import { generalRouter } from "../general/general.routes";
import { outreachRouter } from "../outreach/outreach.routes";

const versionOneRouter = Router();
// route: /api/v1
versionOneRouter.use("/company", companyRouter);
versionOneRouter.use("/general", generalRouter);
versionOneRouter.use("/outreach", outreachRouter);
versionOneRouter.use("/comment", commentRouter);
versionOneRouter.use("/customer", customerRouter);
versionOneRouter.use("/error-log", errorLogRouter);
versionOneRouter.use("/file-upload", fileUploadRouter);
versionOneRouter.use("/product-category", productCategoryRouter);
versionOneRouter.use("/repair-ticket", repairTicketRouter);
versionOneRouter.use("/user", userRouter);
versionOneRouter.use("/username-email-set", usernameEmailSetRouter);

export { versionOneRouter };
