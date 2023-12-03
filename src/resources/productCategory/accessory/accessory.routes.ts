import { NextFunction, Request, Response, Router } from "express";
import {
  assignQueryDefaults,
  verifyJWTMiddleware,
  verifyRoles,
} from "../../../middlewares";
import {
  createNewAccessoryBulkHandler,
  createNewAccessoryHandler,
  deleteAAccessoryHandler,
  deleteAllAccessoriesHandler,
  getAccessoryByIdHandler,
  getQueriedAccessoriesHandler,
  updateAccessoriesBulkHandler,
  updateAccessoryByIdHandler,
} from "./accessory.controller";

const accessoryRouter = Router();

accessoryRouter
  .route("/")
  .post(createNewAccessoryHandler)
  .get(getQueriedAccessoriesHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
accessoryRouter.route("/delete-all").delete(deleteAllAccessoriesHandler);

// DEV ROUTE
accessoryRouter
  .route("/dev")
  .post(createNewAccessoryBulkHandler)
  .patch(updateAccessoriesBulkHandler);

// single document routes
accessoryRouter
  .route("/:accessoryId")
  .get(getAccessoryByIdHandler)
  .delete(deleteAAccessoryHandler)
  .patch(updateAccessoryByIdHandler);

export { accessoryRouter };
