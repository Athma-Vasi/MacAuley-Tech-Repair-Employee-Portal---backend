import { Router } from "express";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../handlers";
import { addUserProjection } from "../../middlewares/addUserProjection";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { CustomerModel } from "./customer.model";
import {
  createCustomerJoiSchema,
  updateCustomerJoiSchema,
} from "./customer.validation";

const customerRouter = Router();
customerRouter.use(addUserProjection);

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

// @desc   Delete many customers
// @route  DELETE api/v1/customer/delete-many
// @access Private/Admin/Manager
customerRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(CustomerModel),
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
