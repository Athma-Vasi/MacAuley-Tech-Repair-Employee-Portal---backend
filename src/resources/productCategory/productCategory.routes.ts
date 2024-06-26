import { Router, NextFunction } from "express";
import { accessoryRouter } from "./accessory";
import { cpuRouter } from "./cpu";
import { getQueriedGpusController, gpuRouter } from "./gpu";
import { motherboardRouter } from "./motherboard";
import { ramRouter } from "./ram";
import { storageRouter } from "./storage";
import { computerCaseRouter } from "./computerCase";
import { desktopComputerRouter } from "./desktopComputer";
import { headphoneRouter } from "./headphone";
import { keyboardRouter } from "./keyboard";
import { laptopRouter } from "./laptop";
import { mouseRouter } from "./mouse";
import { microphoneRouter } from "./microphone";
import { displayRouter } from "./display";
import { psuRouter } from "./psu";
import { smartphoneRouter } from "./smartphone";
import { speakerRouter } from "./speaker";
import { tabletRouter } from "./tablet";
import { webcamRouter } from "./webcam";
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";

const productCategoryRouter = Router({
  strict: true,
});
productCategoryRouter.use(verifyJWTMiddleware, verifyRoles, assignQueryDefaults);
// productCategoryRouter.route("/").get(assignQueryDefaults);

// productCategoryRouter
//   .route("/gpu")
//   .get(assignQueryDefaults, getQueriedGpusController);

productCategoryRouter.use("/accessory", accessoryRouter);
productCategoryRouter.use("/cpu", cpuRouter);
productCategoryRouter.use("/computer-case", computerCaseRouter);
productCategoryRouter.use("/desktop-computer", desktopComputerRouter);
productCategoryRouter.use("/gpu", gpuRouter);
productCategoryRouter.use("/headphone", headphoneRouter);
productCategoryRouter.use("/keyboard", keyboardRouter);
productCategoryRouter.use("/laptop", laptopRouter);
productCategoryRouter.use("/ram", ramRouter);
productCategoryRouter.use("/mouse", mouseRouter);
productCategoryRouter.use("/microphone", microphoneRouter);
productCategoryRouter.use("/display", displayRouter);
productCategoryRouter.use("/motherboard", motherboardRouter);
productCategoryRouter.use("/psu", psuRouter);
productCategoryRouter.use("/smartphone", smartphoneRouter);
productCategoryRouter.use("/speaker", speakerRouter);
productCategoryRouter.use("/storage", storageRouter);
productCategoryRouter.use("/tablet", tabletRouter);
productCategoryRouter.use("/webcam", webcamRouter);

export { productCategoryRouter };
