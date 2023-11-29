import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { HeadphoneDocument, HeadphoneSchema } from "./headphone.model";

interface CreateNewHeadphoneRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		headphoneFields: Omit<HeadphoneSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewHeadphoneBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		headphoneSchemas: HeadphoneSchema[];
	};
}

// DEV ROUTE
interface UpdateHeadphonesBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		headphoneFields: {
			headphoneId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<HeadphoneDocument>;
		}[];
	};
}

interface DeleteAHeadphoneRequest extends RequestAfterJWTVerification {
	params: { headphoneId: string };
}

type DeleteAllHeadphonesRequest = RequestAfterJWTVerification;

type GetQueriedHeadphonesRequest = GetQueriedResourceRequest;

interface GetHeadphoneByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { headphoneId: string };
}

interface UpdateHeadphoneByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<HeadphoneDocument>;
	};
	params: { headphoneId: string };
}

export type {
	CreateNewHeadphoneRequest,
	CreateNewHeadphoneBulkRequest,
	DeleteAHeadphoneRequest,
	DeleteAllHeadphonesRequest,
	GetHeadphoneByIdRequest,
	GetQueriedHeadphonesRequest,
	UpdateHeadphoneByIdRequest,
	UpdateHeadphonesBulkRequest,
};
