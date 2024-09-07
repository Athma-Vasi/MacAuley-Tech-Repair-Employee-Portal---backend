import { Router } from "express";
import { accessoryRouter } from "./accessory";
import { cpuRouter } from "./cpu";
import { gpuRouter } from "./gpu";
import { motherboardRouter } from "./motherboard";
import { ramRouter } from "./ram";
import { storageRouter } from "./storage";
import { computerCaseRouter } from "./computerCase";

import { headphoneRouter } from "./headphone";
import { keyboardRouter } from "./keyboard";
import { mouseRouter } from "./mouse";
import { microphoneRouter } from "./microphone";
import { displayRouter } from "./display";
import { psuRouter } from "./psu";
import { speakerRouter } from "./speaker";
import { webcamRouter } from "./webcam";
import {
  createMongoDbQueryObject,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../middlewares";

const productCategoryRouter = Router({
  strict: true,
});
productCategoryRouter.use(
  verifyJWTMiddleware,
  verifyRoles,
  createMongoDbQueryObject,
);

productCategoryRouter.use("/accessory", accessoryRouter);
productCategoryRouter.use("/cpu", cpuRouter);
productCategoryRouter.use("/computer-case", computerCaseRouter);
productCategoryRouter.use("/gpu", gpuRouter);
productCategoryRouter.use("/headphone", headphoneRouter);
productCategoryRouter.use("/keyboard", keyboardRouter);
productCategoryRouter.use("/ram", ramRouter);
productCategoryRouter.use("/mouse", mouseRouter);
productCategoryRouter.use("/microphone", microphoneRouter);
productCategoryRouter.use("/display", displayRouter);
productCategoryRouter.use("/motherboard", motherboardRouter);
productCategoryRouter.use("/psu", psuRouter);
productCategoryRouter.use("/speaker", speakerRouter);
productCategoryRouter.use("/storage", storageRouter);
productCategoryRouter.use("/webcam", webcamRouter);

export { productCategoryRouter };
