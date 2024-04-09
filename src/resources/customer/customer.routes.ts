import { Router } from "express";

import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from "../../middlewares";
import {
  updateCustomerFieldsBulkHandler,
  createNewCustomerHandler,
  deleteCustomerHandler,
  getQueriedCustomersHandler,
  getCustomerByIdHandler,
  updateCustomerByIdHandler,
  updateCustomerPasswordHandler,
  createNewCustomersBulkHandler,
  getAllCustomersBulkHandler,
  getCustomerDocWithPaymentInfoHandler,
  deleteAllCustomersHandler,
} from "./customer.controller";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createCustomerJoiSchema, updateCustomerJoiSchema } from "./customer.validation";

const customerRouter = Router();

customerRouter
  .route("/")
  .get(
    verifyJWTMiddleware,
    verifyRoles(),
    assignQueryDefaults,
    getQueriedCustomersHandler
  )
  .post(
    validateSchemaMiddleware(createCustomerJoiSchema, "customerSchema"),
    createNewCustomerHandler
  );

customerRouter
  .route("/payment-info")
  .get(
    verifyJWTMiddleware,
    verifyRoles(),
    assignQueryDefaults,
    getCustomerDocWithPaymentInfoHandler
  );

customerRouter
  .route("/update-password")
  .patch(verifyJWTMiddleware, verifyRoles(), updateCustomerPasswordHandler);

customerRouter
  .route("/delete-all")
  .delete(verifyJWTMiddleware, verifyRoles(), deleteAllCustomersHandler);

// DEV ROUTES
customerRouter
  .route("/dev")
  .post(verifyJWTMiddleware, verifyRoles(), createNewCustomersBulkHandler)
  .get(
    verifyJWTMiddleware,
    verifyRoles(),
    assignQueryDefaults,
    getAllCustomersBulkHandler
  )
  .patch(verifyJWTMiddleware, verifyRoles(), updateCustomerFieldsBulkHandler);

customerRouter
  .route("/:customerId")
  .get(verifyJWTMiddleware, verifyRoles(), assignQueryDefaults, getCustomerByIdHandler)
  .patch(
    verifyJWTMiddleware,
    verifyRoles(),
    validateSchemaMiddleware(updateCustomerJoiSchema),
    updateCustomerByIdHandler
  )
  .delete(verifyJWTMiddleware, verifyRoles(), deleteCustomerHandler);

export { customerRouter };
