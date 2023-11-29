import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import type { UserRoles } from "../../user";
import type {
	GetQueriedResourceRequest,
	GetQueriedResourceByUserRequest,
	DocumentUpdateOperation,
} from "../../../types";
import type {
	PurchaseInStoreDocument,
	PurchaseInStoreSchema,
} from "./purchaseInStore.model";

interface CreateNewPurchaseInStoreRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		purchaseInStoreFields: Omit<PurchaseInStoreSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewPurchaseInStoresBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		purchaseInStoreSchemas: PurchaseInStoreSchema[];
	};
}

// DEV ROUTE
interface UpdatePurchaseInStoresBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		purchaseInStoreFields: {
			purchaseInStoreId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<PurchaseInStoreDocument>;
		}[];
	};
}

interface GetAllPurchaseInStoresBulkRequest
	extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
}

interface DeleteAPurchaseInStoreRequest extends RequestAfterJWTVerification {
	params: { purchaseInStoreId: string };
}

type DeleteAllPurchaseInStoresRequest = RequestAfterJWTVerification;

type GetQueriedPurchaseInStoresRequest = GetQueriedResourceRequest;
type GetQueriedPurchaseInStoresByUserRequest = GetQueriedResourceByUserRequest;

interface GetPurchaseInStoreByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { purchaseInStoreId: string };
}

interface UpdatePurchaseInStoreByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<PurchaseInStoreDocument>;
	};
	params: { purchaseInStoreId: string };
}

export type {
	CreateNewPurchaseInStoreRequest,
	GetQueriedPurchaseInStoresByUserRequest,
	CreateNewPurchaseInStoresBulkRequest,
	DeleteAPurchaseInStoreRequest,
	DeleteAllPurchaseInStoresRequest,
	GetPurchaseInStoreByIdRequest,
	GetQueriedPurchaseInStoresRequest,
	UpdatePurchaseInStoreByIdRequest,
	UpdatePurchaseInStoresBulkRequest,
	GetAllPurchaseInStoresBulkRequest,
};
