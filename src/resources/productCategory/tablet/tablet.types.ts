import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import { GetQueriedResourceRequest } from "../../../types";

import { FileUploadDocument } from "../../fileUpload";
import { TabletDocument, TabletSchema } from "./tablet.model";

interface CreateNewTabletRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		tabletFields: Omit<TabletSchema, "userId" | "username">;
	};
}

// DEV ROUTE
interface CreateNewTabletBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		tabletSchemas: TabletSchema[];
	};
}

interface DeleteATabletRequest extends RequestAfterJWTVerification {
	params: { tabletId: string };
}

type DeleteAllTabletsRequest = RequestAfterJWTVerification;

type GetQueriedTabletsRequest = GetQueriedResourceRequest;

interface GetTabletByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
	};
	params: { tabletId: string };
}

interface UpdateTabletByIdRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		tabletFields: Record<keyof TabletSchema, TabletSchema[keyof TabletSchema]>;
	};
	params: { tabletId: string };
}

export type {
	CreateNewTabletRequest,
	CreateNewTabletBulkRequest,
	DeleteATabletRequest,
	DeleteAllTabletsRequest,
	GetTabletByIdRequest,
	GetQueriedTabletsRequest,
	UpdateTabletByIdRequest,
};
