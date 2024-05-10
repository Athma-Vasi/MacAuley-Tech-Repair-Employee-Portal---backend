import { Router } from "express";

import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  updateCustomerFieldsBulkController,
  createNewCustomerController,
  deleteCustomerController,
  getQueriedCustomersController,
  getCustomerByIdController,
  updateCustomerByIdController,
  updateCustomerPasswordController,
  createNewCustomersBulkController,
  getAllCustomersBulkController,
  getCustomerDocWithPaymentInfoController,
  deleteAllCustomersController,
} from "./customer.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createCustomerJoiSchema, updateCustomerJoiSchema } from "./customer.validation";

const customerRouter = Router();

customerRouter
  .route("/")
  .get(
    verifyJWTMiddleware,
    verifyRoles,
    assignQueryDefaults,
    getQueriedCustomersController
  )
  .post(
    validateSchemaMiddleware(createCustomerJoiSchema, "customerSchema"),
    createNewCustomerController
  );

customerRouter
  .route("/payment-info")
  .get(
    verifyJWTMiddleware,
    verifyRoles,
    assignQueryDefaults,
    getCustomerDocWithPaymentInfoController
  );

customerRouter
  .route("/update-password")
  .patch(verifyJWTMiddleware, verifyRoles, updateCustomerPasswordController);

customerRouter
  .route("/delete-all")
  .delete(verifyJWTMiddleware, verifyRoles, deleteAllCustomersController);

// DEV ROUTES
customerRouter
  .route("/dev")
  .post(verifyJWTMiddleware, verifyRoles, createNewCustomersBulkController)
  .get(
    verifyJWTMiddleware,
    verifyRoles,
    assignQueryDefaults,
    getAllCustomersBulkController
  )
  .patch(verifyJWTMiddleware, verifyRoles, updateCustomerFieldsBulkController);

customerRouter
  .route("/:customerId")
  .get(verifyJWTMiddleware, verifyRoles, assignQueryDefaults, getCustomerByIdController)
  .patch(
    verifyJWTMiddleware,
    verifyRoles,
    validateSchemaMiddleware(updateCustomerJoiSchema),
    updateCustomerByIdController
  )
  .delete(verifyJWTMiddleware, verifyRoles, deleteCustomerController);

export { customerRouter };
