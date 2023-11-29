import { Router } from "express";

import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../middlewares";
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
} from "./customer.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../constants";

const customerRouter = Router();

// verifyJWT middleware is applied to all routes except [POST /customers] creating a new customer

customerRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedCustomersHandler,
	)
	.post(createNewCustomerHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateCustomerByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteCustomerHandler);

customerRouter
	.route("/payment-info")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		getCustomerDocWithPaymentInfoHandler,
	);

customerRouter
	.route("/update-password")
	.put(verifyJWTMiddleware, verifyRoles(), updateCustomerPasswordHandler);

// DEV ROUTES
customerRouter
	.route("/dev")
	.post(createNewCustomersBulkHandler)
	.get(getAllCustomersBulkHandler);
customerRouter.route("/dev/add-field").post(updateCustomerFieldsBulkHandler);

customerRouter
	.route("/:customerId")
	.get(verifyJWTMiddleware, verifyRoles(), getCustomerByIdHandler);

export { customerRouter };
