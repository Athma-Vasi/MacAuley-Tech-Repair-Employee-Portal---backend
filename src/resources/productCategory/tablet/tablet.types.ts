import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import {
	DocumentUpdateOperation,
	GetQueriedResourceRequest,
} from "../../../types";

import { TabletDocument, TabletSchema } from "./tablet.model";

interface CreateNewTabletRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		tabletSchema: TabletSchema;
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

// DEV ROUTE
interface UpdateTabletsBulkRequest extends RequestAfterJWTVerification {
	body: {
		userInfo: {
			userId: Types.ObjectId;
			username: string;
			roles: UserRoles;
		};
		sessionId: Types.ObjectId;
		tabletFields: {
			documentId: Types.ObjectId;
			documentUpdate: DocumentUpdateOperation<TabletDocument>;
		}[];
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
		documentUpdate: DocumentUpdateOperation<TabletDocument>;
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
	UpdateTabletsBulkRequest,
};
