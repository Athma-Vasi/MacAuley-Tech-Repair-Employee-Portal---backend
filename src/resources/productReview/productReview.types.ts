import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import type {
	GetQueriedResourceRequest,
	GetQueriedResourceByUserRequest,
} from "../../types";
import type { ProductReviewSchema } from "./productReview.model";

interface CreateNewProductReviewRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		productReviewFields: Omit<ProductReviewSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewProductReviewsBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		productReviewSchemas: ProductReviewSchema[];
	};
}

// DEV ROUTE
interface UpdateProductReviewsFieldsBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		productReviewObjs: {
			productReviewId: string;
			productReviewFields: Partial<ProductReviewSchema>;
		}[];
	};
}

interface GetAllProductReviewsBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
}

interface DeleteAProductReviewRequest extends RequestAfterJWTVerification {
	params: { productReviewId: string };
}

type DeleteAllProductReviewsRequest = RequestAfterJWTVerification;

type GetQueriedProductReviewsRequest = GetQueriedResourceRequest;
type GetQueriedProductReviewsByUserRequest = GetQueriedResourceByUserRequest;

interface GetProductReviewByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { productReviewId: string };
}

interface UpdateProductReviewByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		productReviewFields: Partial<ProductReviewSchema>;
	};
	params: { productReviewId: string };
}

export type {
	CreateNewProductReviewRequest,
	GetQueriedProductReviewsByUserRequest,
	CreateNewProductReviewsBulkRequest,
	DeleteAProductReviewRequest,
	DeleteAllProductReviewsRequest,
	GetProductReviewByIdRequest,
	GetQueriedProductReviewsRequest,
	UpdateProductReviewByIdRequest,
	UpdateProductReviewsFieldsBulkRequest,
	GetAllProductReviewsBulkRequest,
};
