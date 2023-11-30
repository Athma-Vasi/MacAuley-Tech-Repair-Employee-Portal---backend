import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { MouseDocument, MouseSchema } from "./mouse.model";

interface CreateNewMouseRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		mouseSchema: MouseSchema;
	};
}

// DEV ROUTE
interface CreateNewMouseBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		mouseSchemas: MouseSchema[];
	};
}

// DEV ROUTE
interface UpdateMiceBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		mouseFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<MouseDocument>;
		}[];
	};
}

interface DeleteAMouseRequest extends RequestAfterJWTVerification {
	params: { mouseId: string };
}

type DeleteAllMiceRequest = RequestAfterJWTVerification;

type GetQueriedMiceRequest = GetQueriedResourceRequest;

interface GetMouseByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { mouseId: string };
}

interface UpdateMouseByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<MouseDocument>;
	};
	params: { mouseId: string };
}

export type {
	CreateNewMouseRequest,
	CreateNewMouseBulkRequest,
	DeleteAMouseRequest,
	DeleteAllMiceRequest,
	GetMouseByIdRequest,
	GetQueriedMiceRequest,
	UpdateMouseByIdRequest,
	UpdateMiceBulkRequest,
};
