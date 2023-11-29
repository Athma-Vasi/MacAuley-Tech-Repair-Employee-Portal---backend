import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import { GetQueriedResourceRequest } from "../../../types";

import { StorageSchema } from "./storage.model";

interface CreateNewStorageRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		storageFields: Omit<StorageSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewStorageBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		storageSchemas: StorageSchema[];
	};
}

interface DeleteAStorageRequest extends RequestAfterJWTVerification {
	params: { storageId: string };
}

type DeleteAllStoragesRequest = RequestAfterJWTVerification;

type GetQueriedStoragesRequest = GetQueriedResourceRequest;

interface GetStorageByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { storageId: string };
}

interface UpdateStorageByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		storageFields: Record<
			keyof StorageSchema,
			StorageSchema[keyof StorageSchema]
		>;
	};
	params: { storageId: string };
}

export type {
	CreateNewStorageRequest,
	CreateNewStorageBulkRequest,
	DeleteAStorageRequest,
	DeleteAllStoragesRequest,
	GetStorageByIdRequest,
	GetQueriedStoragesRequest,
	UpdateStorageByIdRequest,
};
