import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { DisplayDocument, DisplaySchema } from "./display.model";

interface CreateNewDisplayRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		displaySchema: DisplaySchema;
	};
}

// DEV ROUTE
interface CreateNewDisplayBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		displaySchemas: DisplaySchema[];
	};
}

// DEV ROUTE
interface UpdateDisplaysBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		displayFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<DisplayDocument>;
		}[];
	};
}

interface DeleteADisplayRequest extends RequestAfterJWTVerification {
	params: { displayId: string };
}

type DeleteAllDisplaysRequest = RequestAfterJWTVerification;

type GetQueriedDisplaysRequest = GetQueriedResourceRequest;

interface GetDisplayByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { displayId: string };
}

interface UpdateDisplayByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		documentUpdate: DocumentUpdateOperation<DisplayDocument>;
	};
	params: { displayId: string };
}

export type {
	CreateNewDisplayRequest,
	CreateNewDisplayBulkRequest,
	DeleteADisplayRequest,
	DeleteAllDisplaysRequest,
	GetDisplayByIdRequest,
	GetQueriedDisplaysRequest,
	UpdateDisplayByIdRequest,
	UpdateDisplaysBulkRequest,
};
