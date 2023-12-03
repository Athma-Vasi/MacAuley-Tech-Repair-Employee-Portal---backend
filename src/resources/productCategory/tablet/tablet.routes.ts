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

const tabletRouter = Router();

tabletRouter.route("/").get(getQueriedTabletsHandler).post(createNewTabletHandler);

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
  .patch(updateTabletByIdHandler);

export { tabletRouter };
