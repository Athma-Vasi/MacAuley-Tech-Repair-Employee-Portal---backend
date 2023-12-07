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
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const customerRouter = Router();

customerRouter.use(
  verifyJWTMiddleware,
  verifyRoles(),
  assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS)
);

customerRouter.route("/").get(getQueriedCustomersHandler).post(createNewCustomerHandler);

customerRouter.route("/payment-info").get(getCustomerDocWithPaymentInfoHandler);

customerRouter.route("/update-password").patch(updateCustomerPasswordHandler);

customerRouter.route("/delete-all").delete(deleteAllCustomersHandler);

// DEV ROUTES
customerRouter
  .route("/dev")
  .post(createNewCustomersBulkHandler)
  .get(getAllCustomersBulkHandler)
  .patch(updateCustomerFieldsBulkHandler);

customerRouter
  .route("/:customerId")
  .get(getCustomerByIdHandler)
  .patch(updateCustomerByIdHandler)
  .delete(deleteCustomerHandler);

export { customerRouter };
