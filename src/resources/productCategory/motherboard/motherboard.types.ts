import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { MotherboardDocument, MotherboardSchema } from "./motherboard.model";

interface CreateNewMotherboardRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		motherboardFields: Omit<MotherboardSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewMotherboardBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		motherboardSchemas: MotherboardSchema[];
	};
}

// DEV ROUTE
interface UpdateMotherboardsBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		motherboardFields: {
			motherboardId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<MotherboardDocument>;
		}[];
	};
}

interface DeleteAMotherboardRequest extends RequestAfterJWTVerification {
	params: { motherboardId: string };
}

type DeleteAllMotherboardsRequest = RequestAfterJWTVerification;

type GetQueriedMotherboardsRequest = GetQueriedResourceRequest;

interface GetMotherboardByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { motherboardId: string };
}

interface UpdateMotherboardByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<MotherboardDocument>;
	};
	params: { motherboardId: string };
}

export type {
	CreateNewMotherboardRequest,
	CreateNewMotherboardBulkRequest,
	DeleteAMotherboardRequest,
	DeleteAllMotherboardsRequest,
	GetMotherboardByIdRequest,
	GetQueriedMotherboardsRequest,
	UpdateMotherboardByIdRequest,
	UpdateMotherboardsBulkRequest,
};
