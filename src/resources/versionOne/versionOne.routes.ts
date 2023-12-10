import { Router } from "express";
import { actionsRouter } from "../actions";
import { commentRouter } from "../comment";
import { fileUploadRouter } from "../fileUpload";
import { userRouter } from "../user";
import { repairTicketRouter } from "../repairTicket";
import { customerRouter } from "../customer";
import { productReviewRouter } from "../productReview";
import { productCategoryRouter } from "../productCategory";
import { purchaseRouter } from "../purchase";
import { rmaRouter } from "../rma";
import { usernameEmailSetRouter } from "../usernameEmailSet";

const versionOneRouter = Router();
// route: /api/v1
versionOneRouter.use("/actions", actionsRouter);
versionOneRouter.use("/repair-ticket", repairTicketRouter);
versionOneRouter.use("/file-upload", fileUploadRouter);
versionOneRouter.use("/comment", commentRouter);
versionOneRouter.use("/customer", customerRouter);
versionOneRouter.use("/product-category", productCategoryRouter);
versionOneRouter.use("/product-review", productReviewRouter);
versionOneRouter.use("/purchase", purchaseRouter);
versionOneRouter.use("/rma", rmaRouter);
versionOneRouter.use("/user", userRouter);
versionOneRouter.use("/username-email-set", usernameEmailSetRouter);

export { versionOneRouter };
