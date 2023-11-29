import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import type { UserRoles } from "../../user";
import type {
	GetQueriedResourceRequest,
	GetQueriedResourceByUserRequest,
	DocumentUpdateOperation,
} from "../../../types";
import type {
	PurchaseOnlineDocument,
	PurchaseOnlineSchema,
} from "./purchaseOnline.model";

interface CreateNewPurchaseOnlineRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		purchaseOnlineFields: Omit<PurchaseOnlineSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewPurchaseOnlinesBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		purchaseOnlineSchemas: PurchaseOnlineSchema[];
	};
}

// DEV ROUTE
interface UpdatePurchaseOnlinesBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		purchaseOnlineFields: {
			purchaseOnlineId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<PurchaseOnlineDocument>;
		}[];
	};
}

interface GetAllPurchaseOnlinesBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
}

interface DeleteAPurchaseOnlineRequest extends RequestAfterJWTVerification {
	params: { purchaseOnlineId: string };
}

type DeleteAllPurchaseOnlinesRequest = RequestAfterJWTVerification;

type GetQueriedPurchaseOnlinesRequest = GetQueriedResourceRequest;
type GetQueriedPurchaseOnlinesByUserRequest = GetQueriedResourceByUserRequest;

interface GetPurchaseOnlineByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { purchaseOnlineId: string };
}

interface UpdatePurchaseOnlineByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<PurchaseOnlineDocument>;
	};
	params: { purchaseOnlineId: string };
}

export type {
	CreateNewPurchaseOnlineRequest,
	GetQueriedPurchaseOnlinesByUserRequest,
	CreateNewPurchaseOnlinesBulkRequest,
	DeleteAPurchaseOnlineRequest,
	DeleteAllPurchaseOnlinesRequest,
	GetPurchaseOnlineByIdRequest,
	GetQueriedPurchaseOnlinesRequest,
	UpdatePurchaseOnlineByIdRequest,
	UpdatePurchaseOnlinesBulkRequest,
	GetAllPurchaseOnlinesBulkRequest,
};
