import { Router } from "express";
import {
  createNewLaptopBulkHandler,
  createNewLaptopHandler,
  deleteALaptopHandler,
  deleteAllLaptopsHandler,
  getLaptopByIdHandler,
  getQueriedLaptopsHandler,
  updateLaptopByIdHandler,
  updateLaptopsBulkHandler,
} from "./laptop.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createLaptopJoiSchema, updateLaptopJoiSchema } from "./laptop.validation";

const laptopRouter = Router();

laptopRouter
  .route("/")
  .get(getQueriedLaptopsHandler)
  .post(
    validateSchemaMiddleware(createLaptopJoiSchema, "laptopSchema"),
    createNewLaptopHandler
  );

// separate route for safety reasons (as it deletes all documents in the collection)
laptopRouter.route("/delete-all").delete(deleteAllLaptopsHandler);

// DEV ROUTE
laptopRouter
  .route("/dev")
  .post(createNewLaptopBulkHandler)
  .patch(updateLaptopsBulkHandler);

// single document routes
laptopRouter
  .route("/:laptopId")
  .get(getLaptopByIdHandler)
  .delete(deleteALaptopHandler)
  .patch(validateSchemaMiddleware(updateLaptopJoiSchema), updateLaptopByIdHandler);

export { laptopRouter };
