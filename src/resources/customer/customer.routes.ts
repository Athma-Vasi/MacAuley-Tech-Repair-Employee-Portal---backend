import { Router } from "express";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  createCustomerJoiSchema,
  updateCustomerJoiSchema,
} from "./customer.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../handlers";
import { CustomerModel } from "./customer.model";

const customerRouter = Router();

customerRouter
  .route("/")
  // @desc   Get all customers
  // @route  GET api/v1/customer
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(CustomerModel))
  // @desc   Create a new customer
  // @route  POST api/v1/customer
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createCustomerJoiSchema, "schema"),
    createNewResourceHandler(CustomerModel),
  );

// @desc   Delete all customers
// @route  DELETE api/v1/customer/delete-all
// @access Private/Admin/Manager
customerRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(CustomerModel),
);

// @desc   Get all customers by user
// @route  GET api/v1/customer/user
// @access Private/Admin/Manager
customerRouter.route("/user").get(
  getQueriedResourcesByUserHandler(CustomerModel),
);

customerRouter
  .route("/:resourceId")
  // @desc   Get a customer by their ID
  // @route  GET api/v1/customer/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(CustomerModel))
  // @desc   Delete a customer by their ID
  // @route  DELETE api/v1/customer/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(CustomerModel))
  // @desc   Update a customer by their ID
  // @route  PATCH api/v1/customer/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateCustomerJoiSchema),
    updateResourceByIdHandler(CustomerModel),
  );

export { customerRouter };
