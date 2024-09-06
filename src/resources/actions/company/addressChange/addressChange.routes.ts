import { Router } from "express";
import {
  createNewAddressChangeController,
  deleteAllAddressChangesController,
  deleteAnAddressChangeController,
  getAddressChangeByIdController,
  getAddressChangesByUserController,
  getQueriedAddressChangesController,
  updateAddressChangeByIdController,
} from "./addressChange.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAddressChangeJoiSchema,
  updateAddressChangeJoiSchema,
} from "./addressChange.validation";

const addressChangeRouter = Router();

addressChangeRouter
  .route("/")
  .get(getQueriedAddressChangesController)
  .post(
    validateSchemaMiddleware(
      createAddressChangeJoiSchema,
      "addressChangeSchema",
    ),
    createNewAddressChangeController,
  );

addressChangeRouter.route("/delete-all").delete(
  deleteAllAddressChangesController,
);

addressChangeRouter.route("/user").get(getAddressChangesByUserController);

addressChangeRouter
  .route("/:resourceId")
  .get(getAddressChangeByIdController)
  .delete(deleteAnAddressChangeController)
  .patch(
    validateSchemaMiddleware(updateAddressChangeJoiSchema),
    updateAddressChangeByIdController,
  );

export { addressChangeRouter };
