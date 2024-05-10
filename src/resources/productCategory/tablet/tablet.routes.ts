import { Router, NextFunction } from "express";
import {
  createNewTabletBulkController,
  createNewTabletController,
  deleteATabletController,
  deleteAllTabletsController,
  getTabletByIdController,
  getQueriedTabletsController,
  updateTabletByIdController,
  updateTabletsBulkController,
} from "./tablet.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createTabletJoiSchema, updateTabletJoiSchema } from "./tablet.validation";

const tabletRouter = Router();

tabletRouter
  .route("/")
  .get(getQueriedTabletsController)
  .post(
    validateSchemaMiddleware(createTabletJoiSchema, "tabletSchema"),
    createNewTabletController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
tabletRouter.route("/delete-all").delete(deleteAllTabletsController);

// DEV ROUTE
tabletRouter
  .route("/dev")
  .post(createNewTabletBulkController)
  .patch(updateTabletsBulkController);

// single document routes
tabletRouter
  .route("/:tabletId")
  .get(getTabletByIdController)
  .delete(deleteATabletController)
  .patch(validateSchemaMiddleware(updateTabletJoiSchema), updateTabletByIdController);

export { tabletRouter };
