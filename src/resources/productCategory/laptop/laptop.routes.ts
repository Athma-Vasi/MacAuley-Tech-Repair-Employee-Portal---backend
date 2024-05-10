import { Router } from "express";
import {
  createNewLaptopBulkController,
  createNewLaptopController,
  deleteALaptopController,
  deleteAllLaptopsController,
  getLaptopByIdController,
  getQueriedLaptopsController,
  updateLaptopByIdController,
  updateLaptopsBulkController,
} from "./laptop.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createLaptopJoiSchema, updateLaptopJoiSchema } from "./laptop.validation";

const laptopRouter = Router();

laptopRouter
  .route("/")
  .get(getQueriedLaptopsController)
  .post(
    validateSchemaMiddleware(createLaptopJoiSchema, "laptopSchema"),
    createNewLaptopController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
laptopRouter.route("/delete-all").delete(deleteAllLaptopsController);

// DEV ROUTE
laptopRouter
  .route("/dev")
  .post(createNewLaptopBulkController)
  .patch(updateLaptopsBulkController);

// single document routes
laptopRouter
  .route("/:laptopId")
  .get(getLaptopByIdController)
  .delete(deleteALaptopController)
  .patch(validateSchemaMiddleware(updateLaptopJoiSchema), updateLaptopByIdController);

export { laptopRouter };
