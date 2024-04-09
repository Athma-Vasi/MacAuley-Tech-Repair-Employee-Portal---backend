import { Router } from "express";
import {
  createNewTabletBulkHandler,
  createNewTabletHandler,
  deleteATabletHandler,
  deleteAllTabletsHandler,
  getTabletByIdHandler,
  getQueriedTabletsHandler,
  updateTabletByIdHandler,
  updateTabletsBulkHandler,
} from "./tablet.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createTabletJoiSchema, updateTabletJoiSchema } from "./tablet.validation";

const tabletRouter = Router();

tabletRouter
  .route("/")
  .get(getQueriedTabletsHandler)
  .post(
    validateSchemaMiddleware(createTabletJoiSchema, "tabletSchema"),
    createNewTabletHandler
  );

// separate route for safety reasons (as it deletes all documents in the collection)
tabletRouter.route("/delete-all").delete(deleteAllTabletsHandler);

// DEV ROUTE
tabletRouter
  .route("/dev")
  .post(createNewTabletBulkHandler)
  .patch(updateTabletsBulkHandler);

// single document routes
tabletRouter
  .route("/:tabletId")
  .get(getTabletByIdHandler)
  .delete(deleteATabletHandler)
  .patch(validateSchemaMiddleware(updateTabletJoiSchema), updateTabletByIdHandler);

export { tabletRouter };
